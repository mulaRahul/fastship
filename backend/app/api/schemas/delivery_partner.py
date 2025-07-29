from pydantic import BaseModel, EmailStr, Field

from app.api.schemas.shipment import ShipmentRead
from app.database.models import Location


class BaseDeliveryPartner(BaseModel):
    name: str
    email: EmailStr
    max_handling_capacity: int


class DeliveryPartnerRead(BaseDeliveryPartner):
    servicable_locations: list[Location]

class DeliveryPartnerUpdate(BaseModel):
    serviceable_zip_codes: list[int] | None = Field(default=None)
    max_handling_capacity: int | None = Field(default=None)


class DeliveryPartnerCreate(BaseDeliveryPartner):
    password: str
    serviceable_zip_codes: list[int]


class DeliveryPartnerShipments(BaseModel):
    shipments: list[ShipmentRead]
    total_shipments: int
    page: int
    total_pages: int