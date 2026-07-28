from bson import ObjectId


def serialize_doc(doc: dict) -> dict:
    """Converts a MongoDB document's _id (ObjectId) into a plain string 'id' field.
    Every router response passes documents through this before returning them,
    since ObjectId isn't JSON-serializable and the frontend expects a plain 'id'.
    """
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


def to_object_id(id_str: str) -> ObjectId | None:
    try:
        return ObjectId(id_str)
    except Exception:
        return None