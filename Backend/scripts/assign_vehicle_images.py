"""
One-time script: assigns a real, specific photo to each matching vehicle
by slug, using the exact filenames currently sitting in public/vehicles/.

Run this from your backend folder (same place you run uvicorn):

    python scripts/assign_vehicle_images.py

NOTE ON SLUGS:
    The keys below (left side, e.g. "911-turbo-s") must exactly match the
    `slug` field already stored in your vehicle documents. If a vehicle
    doesn't get updated, check its detail page URL in the browser:
    localhost:3000/collection/<this-is-the-slug>
    ...and fix the key below to match exactly.

NOTE ON THE BMW SLUG:
    "bmw-m4-competition" is my best guess based on the vehicle name.
    Confirm it against the actual URL and correct it if it's different.
"""

import asyncio
import sys
from pathlib import Path
from urllib.parse import quote

sys.path.append(str(Path(__file__).resolve().parent.parent))

from core.database import vehicles_collection  # noqa: E402


# slug -> exact filename as it exists in public/vehicles/
IMAGE_FILENAMES = {
    "porsche-911-turbo-s": "porshe 911 turbo s.jpg",
    "ferrari-296-gtb": "ferrari 296gtb.jpg",
    "lamborghini-revuelto": "lambourghini.jpg",
    "rolls-royce-ghost": "rollsroyce ghost.jpg",
    "tesla-model-s-plaid": "tesla model s plate.jpg",
    "bmw-m4-competition": "BMW M4 Competetion.jpg",  # already assigned, harmless to re-run
}


def to_public_path(filename: str) -> str:
    """Builds a browser-safe URL path, encoding spaces as %20."""
    return "/vehicles/" + quote(filename)


async def main():
    updated_count = 0
    not_found = []

    for slug, filename in IMAGE_FILENAMES.items():
        image_path = to_public_path(filename)
        result = await vehicles_collection.update_one(
            {"slug": slug},
            {"$set": {"images": [image_path]}},
        )
        if result.matched_count == 0:
            not_found.append(slug)
        else:
            updated_count += 1
            print(f"✔ Updated '{slug}' -> {image_path}")

    print(f"\nDone. {updated_count} vehicle(s) updated.")
    if not_found:
        print(f"⚠ No vehicle found for these slugs (check spelling/casing against the actual URL): {not_found}")


if __name__ == "__main__":
    asyncio.run(main())