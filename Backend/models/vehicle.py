from typing import Literal
from pydantic import BaseModel


class VehicleCreate(BaseModel):
    slug: str
    name: str
    brand: str
    brandSlug: str
    category: Literal["sedan", "coupe", "suv", "convertible", "hypercar", "electric"]
    price: float
    year: int
    mileage: int = 0
    horsepower: int
    topSpeed: int
    zeroToSixty: float
    transmission: str
    drivetrain: str
    exteriorColor: str
    interiorColor: str
    vin: str
    images: list[str] = []
    featured: bool = False
    tags: list[str] = []
    description: str = ""
    status: Literal["available", "reserved", "sold"] = "available"


class VehicleUpdate(BaseModel):
    """All fields optional — admin can PATCH just the fields that changed."""

    name: str | None = None
    price: float | None = None
    mileage: int | None = None
    images: list[str] | None = None
    featured: bool | None = None
    tags: list[str] | None = None
    description: str | None = None
    status: Literal["available", "reserved", "sold"] | None = None


class VehicleOut(VehicleCreate):
    id: str