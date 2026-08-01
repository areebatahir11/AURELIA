"""
Diagnostic script — prints every vehicle's name, brand, and exact slug
straight from the database, so you can see the real slugs instead of
guessing them.

Run from your backend folder:
    python scripts/list_vehicle_slugs.py
"""

import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from core.database import vehicles_collection  # noqa: E402


async def main():
    vehicles = await vehicles_collection.find({}, {"name": 1, "brand": 1, "slug": 1, "image": 1}).to_list(length=None)

    if not vehicles:
        print("No vehicles found in the database.")
        return

    print(f"{'NAME':<25} {'BRAND':<15} {'SLUG':<25} {'HAS IMAGE?'}")
    print("-" * 85)
    for v in vehicles:
        has_image = "yes" if v.get("image") else "no"
        print(f"{v.get('name', ''):<25} {v.get('brand', ''):<15} {v.get('slug', ''):<25} {has_image}")


if __name__ == "__main__":
    asyncio.run(main())