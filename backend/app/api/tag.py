from enum import Enum


class APITag(str, Enum):
    SHIPMENT = "Shipment"
    SELLER = "Seller"
    PARTNER = "Delivery Partner"