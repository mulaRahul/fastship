import asyncio
import random
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Form, Request
from fastapi.templating import Jinja2Templates

from app.api.tag import APITag
from app.config import app_settings
from app.core.exceptions import NothingToUpdate
from app.database.models import TagName
from app.utils import TEMPLATE_DIR

from ..dependencies import DeliveryPartnerDep, SellerDep, ShipmentServiceDep
from ..schemas.shipment import (
    ShipmentCreate,
    ShipmentRead,
    ShipmentUpdate,
)

router = APIRouter(prefix="/shipment", tags=[APITag.SHIPMENT])


templates = Jinja2Templates(TEMPLATE_DIR)

### Tracking details of shipment
@router.get("/track", include_in_schema=False)
async def get_tracking(request: Request, id: UUID, service: ShipmentServiceDep):
    # Check for shipment with given id
    shipment = await service.get(id)

    context = shipment.model_dump()
    context["status"] = shipment.status
    context["partner"] = shipment.delivery_partner.name
    context["timeline"] = shipment.timeline
    context["timeline"].reverse()

    return templates.TemplateResponse(
        request=request,
        name="track.html",
        context=context,
    )


### Read a shipment by id
@router.get("/", response_model=ShipmentRead)
async def get_shipment(id: UUID, service: ShipmentServiceDep):
    # Simluate delay
    await asyncio.sleep(random.randint(1, 3))
    # Check for shipment with given id
    return await service.get(id)


### Create a new shipment
@router.post("/", response_model=ShipmentRead)
async def submit_shipment(
    seller: SellerDep,
    shipment: ShipmentCreate,
    service: ShipmentServiceDep,
):
    return await service.add(shipment, seller)


### Update fields of a shipment
@router.patch("/", response_model=ShipmentRead)
async def update_shipment(
    id: UUID,
    shipment_update: ShipmentUpdate,
    partner: DeliveryPartnerDep,
    service: ShipmentServiceDep,
):
    # Update data with given fields
    update = shipment_update.model_dump(exclude_none=True)

    if not update:
        raise NothingToUpdate()

    return await service.update(id, shipment_update, partner)


### Get all shipments with a tag
# @router.get("/tagged", response_model=list[ShipmentRead])
# async def get_shipments_with_tag(
#     tag_name: TagName,
#     session: SessionDep,
# ):
#     tag = await tag_name.tag(session)
#     return tag.shipments


### Add a tag to a shipment
@router.get("/tag", response_model=ShipmentRead)
async def add_tag_to_shipment(
    id: UUID,
    tag_name: TagName,
    service: ShipmentServiceDep,
):
    return await service.add_tag(id, tag_name)


### Remove a tag from a shipment
@router.delete("/tag", response_model=ShipmentRead)
async def remove_tag_from_shipment(
    id: UUID,
    tag_name: TagName,
    service: ShipmentServiceDep,
):
    return await service.remove_tag(id, tag_name)


### Cancel a shipment by id
@router.get("/cancel")
async def cancel_shipment(
    id: UUID,
    seller: SellerDep,
    service: ShipmentServiceDep,
):
    await service.cancel(id, seller)


### Sumbit a reivew for a shipment
@router.get("/review", include_in_schema=False)
async def submit_review_page(request: Request, token: str):
    return templates.TemplateResponse(
        request=request,
        name="review.html",
        context={
            "review_url": f"http://{app_settings.APP_DOMAIN}/shipment/review?token={token}",
        },
    )


### Sumbit a reivew for a shipment
@router.post("/review", include_in_schema=False)
async def submit_review(
    token: str,
    rating: Annotated[int, Form(ge=1, le=5)],
    comment: Annotated[str | None, Form()],
    service: ShipmentServiceDep,
):
    await service.rate(token, rating, comment)
    return {"detail": "Review submitted"}
