from pydantic import BaseModel


class BrandCreate(BaseModel):
    slug: str
    name: str
    country: str
    founded: int
    logo: str = ""
    description: str = ""


class BrandUpdate(BaseModel):
    name: str | None = None
    country: str | None = None
    founded: int | None = None
    logo: str | None = None
    description: str | None = None


class BrandOut(BrandCreate):
    id: str