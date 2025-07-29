from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import Column, Field, Relationship, SQLModel, select


class TagName(str, Enum):
    EXPRESS = "express"
    STANDARD = "standard"
    FRAGILE = "fragile"
    HEAVY = "heavy"
    INTERNATIONAL = "international"
    DOMESTIC = "domestic"
    TEMPERATURE_CONTROLLED = "temperature_controlled"
    GIFT = "gift"
    RETURN = "return"
    DOCUMENTS = "documents"

    async def tag(self, session: AsyncSession) -> "Tag":
        return await session.scalar(select(Tag).where(Tag.name == self.value))


class ShipmentStatus(str, Enum):
    placed = "placed"
    in_transit = "in_transit"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    cancelled = "cancelled"


class ShipmentTag(SQLModel, table=True):
    __tablename__ = "shipment_tag"

    shipment_id: UUID = Field(
        foreign_key="shipment.id",
        primary_key=True,
    )
    tag_id: UUID = Field(
        foreign_key="tag.id",
        primary_key=True,
    )


class Tag(SQLModel, table=True):
    __tablename__ = "tag"

    id: UUID = Field(
        sa_column=Column(
            postgresql.UUID,
            default=uuid4,
            primary_key=True,
        )
    )
    name: TagName
    instruction: str

    shipments: list["Shipment"] = Relationship(
        back_populates="tags",
        link_model=ShipmentTag,
        sa_relationship_kwargs={"lazy": "immediate"},
    )


class Shipment(SQLModel, table=True):
    __tablename__ = "shipment"

    id: UUID = Field(
        sa_column=Column(
            postgresql.UUID,
            default=uuid4,
            primary_key=True,
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            postgresql.TIMESTAMP,
            default=datetime.now,
        )
    )

    client_contact_email: EmailStr
    client_contact_phone: str | None

    content: str
    weight: float = Field(le=25)
    destination: int
    estimated_delivery: datetime | None

    timeline: list["ShipmentEvent"] = Relationship(
        back_populates="shipment",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    seller_id: UUID = Field(foreign_key="seller.id")
    seller: "Seller" = Relationship(
        back_populates="shipments",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    delivery_partner_id: UUID = Field(foreign_key="delivery_partner.id")
    delivery_partner: "DeliveryPartner" = Relationship(
        back_populates="shipments",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    review: "Review" = Relationship(
        back_populates="shipment",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    tags: list[Tag] = Relationship(
        back_populates="shipments",
        link_model=ShipmentTag,
        sa_relationship_kwargs={"lazy": "immediate"},
    )

    @property
    def status(self):
        return self.timeline[-1].status if len(self.timeline) > 0 else None


class ShipmentEvent(SQLModel, table=True):
    __tablename__ = "shipment_event"

    id: UUID = Field(
        sa_column=Column(
            postgresql.UUID,
            default=uuid4,
            primary_key=True,
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            postgresql.TIMESTAMP,
            default=datetime.now,
        )
    )

    location: int
    status: ShipmentStatus
    description: str | None = Field(default=None)

    shipment_id: UUID = Field(foreign_key="shipment.id")
    shipment: Shipment = Relationship(
        back_populates="timeline",
        sa_relationship_kwargs={"lazy": "selectin"},
    )


class User(SQLModel):
    name: str

    email: EmailStr
    email_verified: bool = Field(default=False)
    password_hash: str = Field(exclude=True)


class Seller(User, table=True):
    __tablename__ = "seller"

    id: UUID = Field(
        sa_column=Column(
            postgresql.UUID,
            default=uuid4,
            primary_key=True,
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            postgresql.TIMESTAMP,
            default=datetime.now,
        )
    )

    address: str
    zip_code: int

    shipments: list[Shipment] = Relationship(
        back_populates="seller",
        sa_relationship_kwargs={"lazy": "selectin"},
    )


class ServicableLocation(SQLModel, table=True):
    __tablename__ = "servicable_location"

    partner_id: UUID = Field(
        foreign_key="delivery_partner.id",
        primary_key=True,
    )
    location_id: int = Field(
        foreign_key="location.zip_code",
        primary_key=True,
    )


class DeliveryPartner(User, table=True):
    __tablename__ = "delivery_partner"

    id: UUID = Field(
        sa_column=Column(
            postgresql.UUID,
            default=uuid4,
            primary_key=True,
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            postgresql.TIMESTAMP,
            default=datetime.now,
        )
    )

    # serviceable_zip_codes: list[int] = Field(
    #     sa_column=Column(ARRAY(INTEGER)),
    # )
    servicable_locations: list["Location"] = Relationship(
        back_populates="delivery_partners",
        link_model=ServicableLocation,
        sa_relationship_kwargs={"lazy": "immediate"},
    )
    max_handling_capacity: int

    shipments: list[Shipment] = Relationship(
        back_populates="delivery_partner",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    @property
    def active_shipments(self):
        return [
            shipment
            for shipment in self.shipments
            if shipment.status != ShipmentStatus.delivered
            or shipment.status != ShipmentStatus.cancelled
        ]

    @property
    def current_handling_capacity(self):
        return self.max_handling_capacity - len(self.active_shipments)


class Location(SQLModel, table=True):
    __tablename__ = "location"

    zip_code: int = Field(primary_key=True)
    
    # Additional metadata fields
    # estimated_delivery_days: int = Field(default=3)
    # surcharge: float = Field(default=0.0)
    # active: bool = Field(default=True)

    delivery_partners: list[DeliveryPartner] = Relationship(
        back_populates="servicable_locations",
        link_model=ServicableLocation,
        sa_relationship_kwargs={"lazy": "immediate"},
    )


class Review(SQLModel, table=True):
    __tablename__ = "review"

    id: UUID = Field(
        sa_column=Column(
            postgresql.UUID,
            default=uuid4,
            primary_key=True,
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            postgresql.TIMESTAMP,
            default=datetime.now,
        )
    )

    rating: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None)

    shipment_id: UUID = Field(foreign_key="shipment.id")
    shipment: Shipment = Relationship(
        back_populates="review",
        sa_relationship_kwargs={"lazy": "selectin"},
    )