from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.shipment import ShipmentCreate, ShipmentUpdate
from app.core.exceptions import ClientNotAuthorized, EntityNotFound, InvalidToken
from app.database.models import DeliveryPartner, Review, Seller, Shipment, ShipmentStatus, TagName
from app.database.redis import get_shipment_verification_code
from app.services.shipment_event import ShipmentEventService
from app.utils import decode_url_safe_token

from .base import BaseService
from .delivery_partner import DeliveryPartnerService


class ShipmentService(BaseService):
    def __init__(
        self,
        session: AsyncSession,
        partner_service: DeliveryPartnerService,
        event_service: ShipmentEventService,
    ):
        super().__init__(Shipment, session)
        self.partner_service = partner_service
        self.event_service = event_service

    # Get a shipment by id
    async def get(self, id: UUID) -> Shipment | None:
        shipment = await self._get(id)
        if not shipment:
            raise EntityNotFound()
        return shipment

    # Add a new shipment
    async def add(self, shipment_create: ShipmentCreate, seller: Seller) -> Shipment:
        new_shipment = Shipment(
            **shipment_create.model_dump(),
            status=ShipmentStatus.placed,
            estimated_delivery=datetime.now() + timedelta(days=3),
            seller_id=seller.id,
        )
        # Assign delivery partner to the shipment
        partner = await self.partner_service.assign_shipment(
            new_shipment,
        )
        # Add the delivery partner foreign key
        new_shipment.delivery_partner_id = partner.id

        shipment: Shipment = await self._add(new_shipment)

        event = await self.event_service.add(
            shipment=shipment,
            location=seller.zip_code,
            status=ShipmentStatus.placed,
            description=f"assigned to {partner.name}",
        )

        shipment.timeline.append(event)

        return shipment

    # Update an existing shipment
    async def update(
        self,
        id: UUID,
        shipment_update: ShipmentUpdate,
        partner: DeliveryPartner,
    ) -> Shipment:
        # Validate logged in parter with assigned partner
        # on the shipment with given id
        shipment = await self.get(id)

        if shipment.delivery_partner_id != partner.id:
            raise ClientNotAuthorized()

        if shipment_update.status == ShipmentStatus.delivered:
            code = await get_shipment_verification_code(shipment.id)

            if code != shipment_update.verification_code:
                raise ClientNotAuthorized()

        update = shipment_update.model_dump(
            exclude_none=True,
            exclude=["verification_code"],
        )

        if shipment_update.estimated_delivery:
            shipment.estimated_delivery = shipment_update.estimated_delivery

        if len(update) > 1 or not shipment_update.estimated_delivery:
            await self.event_service.add(
                shipment=shipment,
                **update,
            )

        return await self._update(shipment)
    
    async def add_tag(self, id: UUID, tag_name: TagName):
        shipment = await self.get(id)
        shipment.tags.append(await tag_name.tag(self.session))

        return await self._update(shipment)
    
    async def remove_tag(self, id: UUID, tag_name: TagName):
        shipment = await self.get(id)

        try:
            shipment.tags.remove(await tag_name.tag(self.session))
        except ValueError:
            raise EntityNotFound()

        return await self._update(shipment)

    async def rate(self, token: str, rating: int, comment: str):
        token_data = decode_url_safe_token(token)

        if not token_data:
            raise InvalidToken()

        shipment = await self.get(UUID(token_data["id"]))

        new_review = Review(
            rating=rating,
            comment=comment if comment else None,
            shipment_id=shipment.id,
        )

        self.session.add(new_review)
        await self.session.commit()

    
    async def cancel(self, id: UUID, seller: Seller) -> Shipment:
        # Validate the seller
        shipment = await self.get(id)

        if shipment.seller_id != seller.id:
            raise ClientNotAuthorized()

        event = await self.event_service.add(
            shipment=shipment,
            status=ShipmentStatus.cancelled,
        )

        shipment.timeline.append(event)
        return shipment

    # Delete a shipment
    async def delete(self, id: UUID) -> None:
        await self._delete(await self.get(id))
