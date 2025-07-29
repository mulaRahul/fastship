from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from scalar_fastapi import get_scalar_api_reference

from app.api.router import master_router
from app.api.tag import APITag
from app.core.exceptions import add_exception_handlers
# from app.core.logging import logger

description = """
Delivery Management System for sellers and delivery agents

### Seller
- Submit shipment effortlessly
- Share tracking links with customers

### Delivery Agent
- Auto accept shipments
- Track and update shipment status
- Email and SMS notifications
"""
tags_metadata = [
        {
            "name": APITag.SHIPMENT.value,
            "description": "Operations related to shipments.",
        },
        {
            "name": APITag.SELLER.value,
            "description": "Operations related to seller.",
        },
        {
            "name": APITag.PARTNER.value,
            "description": "Operations related to delivery partner.",
        },
    ]


def custom_generate_unique_id_function(route: APIRoute) -> str:
    return route.name

app = FastAPI(
    title="FastShip",
    description=description,
    docs_url=None,
    redoc_url=None,
    version="0.1.0",
    openapi_tags=tags_metadata,
    # generate_unique_id_function=custom_generate_unique_id_function,
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add all endpoints
app.include_router(master_router)

# Add custom exception handlers
add_exception_handlers(app)

@app.get('/')
def root():
    return {"message": "Welcome to FastShip API!"}

# Scalar API Documentation
@app.get("/docs", include_in_schema=False)
def get_scalar_docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="Scalar API",
    )
