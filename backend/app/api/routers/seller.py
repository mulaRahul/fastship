from typing import Annotated

from fastapi import APIRouter, Depends, Form, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates
from pydantic import EmailStr

from app.api.schemas.shipment import ShipmentRead
from app.api.tag import APITag
from app.core.security import TokenData
from app.database.redis import add_jti_to_blacklist
from app.utils import TEMPLATE_DIR
from app.config import app_settings

from ..dependencies import SellerDep, SellerServiceDep, get_seller_access_token
from ..schemas.seller import SellerCreate, SellerRead

router = APIRouter(prefix="/seller", tags=[APITag.SELLER])


### Register a new seller
@router.post("/signup", response_model=SellerRead)
async def register_seller(seller: SellerCreate, service: SellerServiceDep):
    return await service.add(seller)


### Login a seller
@router.post("/token", response_model=TokenData)
async def login_seller(
    request_form: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: SellerServiceDep,
):
    token = await service.token(request_form.username, request_form.password)
    return {
        "access_token": token,
        "token_type": "jwt",
    }


### Get seller profile
@router.get("/me", response_model=SellerRead)
async def get_seller_profile(seller: SellerDep):
    return seller


### Get all shipments created by the seller
@router.get("/shipments", response_model=list[ShipmentRead])
async def get_shipments(seller: SellerDep):
    return seller.shipments


### Verify Seller Email
@router.get("/verify", include_in_schema=False)
async def verify_seller_email(token: str, service: SellerServiceDep):
    await service.verify_email(token)
    return {"detail": "Account verified"}


### Email Password Reset Link
@router.get("/forgot_password")
async def forgot_password(email: EmailStr, service: SellerServiceDep):
    await service.send_password_reset_link(email, router.prefix)
    return {"detail": "Check email for password reset link"}


### Password Reset Form
@router.get("/reset_password_form")
async def get_reset_password_form(request: Request, token: str):
    templates = Jinja2Templates(TEMPLATE_DIR)

    return templates.TemplateResponse(
        request=request,
        name="password/reset.html",
        context={
            "reset_url": f"http://{app_settings.APP_DOMAIN}{router.prefix}/reset_password?token={token}"
        },
    )


### Reset Seller Password
@router.post("/reset_password")
async def reset_password(
    request: Request,
    token: str,
    password: Annotated[str, Form()],
    service: SellerServiceDep,
):
    is_success = await service.reset_password(token, password)

    templates = Jinja2Templates(TEMPLATE_DIR)
    return templates.TemplateResponse(
        request=request,
        name="password/reset_success.html"
        if is_success
        else "password/reset_failed.html",
    )


### Logout a seller
@router.get("/logout")
async def logout_seller(
    token_data: Annotated[dict, Depends(get_seller_access_token)],
):
    await add_jti_to_blacklist(token_data["jti"])
    return {"detail": "Successfully logged out"}
