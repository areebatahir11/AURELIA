from fastapi import APIRouter

from core.database import testimonials_collection
from models.testimonial import TestimonialOut
from utils.serializers import serialize_doc

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


@router.get("", response_model=list[TestimonialOut])
async def get_testimonials():
    testimonials = await testimonials_collection.find().to_list(length=None)
    return [serialize_doc(testimonial) for testimonial in testimonials]