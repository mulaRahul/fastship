from pydantic import BaseModel, EmailStr


class BaseSeller(BaseModel):
    name: str
    email: EmailStr


class SellerRead(BaseSeller):
    pass

class SellerCreate(BaseSeller):
    password: str
    address: str
    zip_code: int