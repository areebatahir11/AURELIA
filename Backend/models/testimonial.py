from pydantic import BaseModel, Field


class TestimonialOut(BaseModel):
    id: str
    name: str
    title: str
    quote: str
    rating: int = Field(ge=1, le=5)