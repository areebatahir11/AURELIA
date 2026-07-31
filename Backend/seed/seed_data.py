"""
Run this once against a fresh database: python -m seed.seed_data

Loads the same brands/vehicles that were used as frontend mock data, so what you
see in the browser doesn't change the moment you flip useMockData to false.
"""

import asyncio

from core.database import brands_collection, testimonials_collection, users_collection, vehicles_collection
from core.security import hash_password

BRANDS = [
    {"slug": "bmw", "name": "BMW", "country": "Germany", "founded": 1916, "logo": "/images/brands/bmw.png", "description": "Precision German engineering meeting sheer driving pleasure."},
    {"slug": "mercedes-benz", "name": "Mercedes-Benz", "country": "Germany", "founded": 1926, "logo": "/images/brands/mercedes-benz.png", "description": "The inventor of the automobile, redefined for the modern age."},
    {"slug": "audi", "name": "Audi", "country": "Germany", "founded": 1909, "logo": "/images/brands/audi.png", "description": "Vorsprung durch Technik — progress through technology."},
    {"slug": "porsche", "name": "Porsche", "country": "Germany", "founded": 1931, "logo": "/images/brands/porsche.png", "description": "There is no substitute."},
    {"slug": "ferrari", "name": "Ferrari", "country": "Italy", "founded": 1939, "logo": "/images/brands/ferrari.png", "description": "The prancing horse — Italian passion engineered for the track and road."},
    {"slug": "lamborghini", "name": "Lamborghini", "country": "Italy", "founded": 1963, "logo": "/images/brands/lamborghini.png", "description": "Unmistakable design, uncompromising performance."},
    {"slug": "bentley", "name": "Bentley", "country": "United Kingdom", "founded": 1919, "logo": "/images/brands/bentley.png", "description": "Handcrafted British luxury, effortless power."},
    {"slug": "rolls-royce", "name": "Rolls-Royce", "country": "United Kingdom", "founded": 1904, "logo": "/images/brands/rolls-royce.png", "description": "The pinnacle of automotive luxury since 1904."},
    {"slug": "mclaren", "name": "McLaren", "country": "United Kingdom", "founded": 1963, "logo": "/images/brands/mclaren.png", "description": "Born from racing, built for the road."},
    {"slug": "tesla", "name": "Tesla", "country": "United States", "founded": 2003, "logo": "/images/brands/tesla.png", "description": "Accelerating the world's transition to sustainable performance."},
    {"slug": "aston-martin", "name": "Aston Martin", "country": "United Kingdom", "founded": 1913, "logo": "/images/brands/aston-martin.png", "description": "Power, beauty, and soul — British grand touring at its finest."},
]

VEHICLES = [
    {"slug": "porsche-911-turbo-s", "name": "911 Turbo S", "brand": "Porsche", "brandSlug": "porsche", "category": "coupe", "price": 230000, "year": 2025, "mileage": 120, "horsepower": 640, "topSpeed": 205, "zeroToSixty": 2.6, "transmission": "8-Speed PDK", "drivetrain": "AWD", "exteriorColor": "GT Silver Metallic", "interiorColor": "Black Leather", "vin": "WP0AB2A99PS123456", "images": [], "featured": True, "tags": ["exclusive", "new-arrival"], "description": "The benchmark sports car, elevated.", "status": "available"},
    {"slug": "ferrari-296-gtb", "name": "296 GTB", "brand": "Ferrari", "brandSlug": "ferrari", "category": "hypercar", "price": 340000, "year": 2025, "mileage": 45, "horsepower": 819, "topSpeed": 205, "zeroToSixty": 2.9, "transmission": "8-Speed DCT", "drivetrain": "RWD", "exteriorColor": "Rosso Corsa", "interiorColor": "Cuoio Leather", "vin": "ZFF95NLA9P0123456", "images": [], "featured": True, "tags": ["exclusive"], "description": "A V6 hybrid masterpiece.", "status": "available"},
    {"slug": "rolls-royce-ghost", "name": "Ghost", "brand": "Rolls-Royce", "brandSlug": "rolls-royce", "category": "sedan", "price": 385000, "year": 2025, "mileage": 210, "horsepower": 563, "topSpeed": 155, "zeroToSixty": 4.6, "transmission": "8-Speed Automatic", "drivetrain": "AWD", "exteriorColor": "Diamond Black", "interiorColor": "Seashell Leather", "vin": "SCA665S53PU123456", "images": [], "featured": True, "tags": ["new-arrival"], "description": "Post Opulent design philosophy.", "status": "available"},
    {"slug": "lamborghini-revuelto", "name": "Revuelto", "brand": "Lamborghini", "brandSlug": "lamborghini", "category": "hypercar", "price": 608000, "year": 2025, "mileage": 15, "horsepower": 1001, "topSpeed": 218, "zeroToSixty": 2.5, "transmission": "8-Speed DCT Hybrid", "drivetrain": "AWD", "exteriorColor": "Verde Citrea", "interiorColor": "Nero Ade", "vin": "ZHWUC4ZF9PL123456", "images": [], "featured": True, "tags": ["exclusive", "new-arrival"], "description": "Lamborghini's first V12 hybrid.", "status": "available"},
    {"slug": "bentley-continental-gt", "name": "Continental GT Speed", "brand": "Bentley", "brandSlug": "bentley", "category": "coupe", "price": 275000, "year": 2024, "mileage": 890, "horsepower": 650, "topSpeed": 208, "zeroToSixty": 3.1, "transmission": "8-Speed Dual Clutch", "drivetrain": "AWD", "exteriorColor": "Tanzanite Blue", "interiorColor": "Linen Hide", "vin": "SCBFR7ZA9PC123456", "images": [], "featured": False, "tags": [], "description": "The grand tourer, redefined.", "status": "available"},
    {"slug": "tesla-model-s-plaid", "name": "Model S Plaid", "brand": "Tesla", "brandSlug": "tesla", "category": "electric", "price": 108000, "year": 2025, "mileage": 340, "horsepower": 1020, "topSpeed": 200, "zeroToSixty": 1.99, "transmission": "Single-Speed", "drivetrain": "AWD", "exteriorColor": "Stealth Grey", "interiorColor": "Black & White", "vin": "5YJSA1E60PF123456", "images": [], "featured": False, "tags": ["new-arrival"], "description": "The quickest accelerating production car ever made.", "status": "available"},
]


TESTIMONIALS = [
    {"name": "Hassan Raza", "title": "Entrepreneur, Lahore", "quote": "Aurelia made acquiring a Bentley feel less like a transaction and more like an occasion. Impeccable.", "rating": 5},
    {"name": "Fatima Ilyas", "title": "Architect, Islamabad", "quote": "The concierge team understood exactly what I wanted before I finished describing it.", "rating": 5},
    {"name": "Omar Sheikh", "title": "Collector", "quote": "I've bought cars across three continents. Aurelia's process is the most refined I've experienced.", "rating": 5},
]


async def seed():
    if await brands_collection.count_documents({}) == 0:
        await brands_collection.insert_many(BRANDS)
        print(f"Inserted {len(BRANDS)} brands")
    else:
        print("Brands already seeded, skipping")

    if await vehicles_collection.count_documents({}) == 0:
        await vehicles_collection.insert_many(VEHICLES)
        print(f"Inserted {len(VEHICLES)} vehicles")
    else:
        print("Vehicles already seeded, skipping")

    if await testimonials_collection.count_documents({}) == 0:
        await testimonials_collection.insert_many(TESTIMONIALS)
        print(f"Inserted {len(TESTIMONIALS)} testimonials")
    else:
        print("Testimonials already seeded, skipping")

    admin_email = "admin@aurelia.com"
    if await users_collection.find_one({"email": admin_email}) is None:
        await users_collection.insert_one(
            {
                "name": "Aurelia Admin",
                "email": admin_email,
                "hashedPassword": hash_password("ChangeMe123!"),  
                "role": "admin",
                "wishlist": [],
            }
        )
        print(f"Created admin user: {admin_email} / ChangeMe123!")
    else:
        print("Admin user already exists, skipping")


if __name__ == "__main__":
    asyncio.run(seed())