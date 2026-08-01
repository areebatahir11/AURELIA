import json
import uuid

from fastapi import APIRouter, HTTPException, status
from groq import Groq

from core.config import settings
from core.database import vehicles_collection
from models.ai import ConciergeRequest, ConciergeResponse
from utils.serializers import serialize_doc

router = APIRouter(prefix="/ai", tags=["AI"])

groq_client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None

SYSTEM_PROMPT = """You are the AI concierge for AURELIA, an independent multi-brand luxury car dealership.

RULES (non-negotiable):
- You may ONLY recommend or describe vehicles that appear in the CATALOG JSON provided below.
- Never invent a model, spec, or price that is not in the catalog.
- If nothing in the catalog matches what the customer wants, say so honestly and suggest they widen their criteria or speak with a human advisor — do not force a match.
- If asked something unrelated to vehicles (general chit-chat, other brands not in the catalog), politely redirect the conversation back to what AURELIA can help with.
- Keep responses concise, warm, and consultative — like a knowledgeable showroom advisor, not a search engine dumping results.

LANGUAGE RULE (non-negotiable):
- Always reply in the exact same language AND script the customer used in their message.
- If the customer writes in Roman Urdu/Hinglish (Latin/English alphabet, e.g. "mujhe gaari chahiye"), reply in Roman Urdu/Hinglish using the Latin alphabet — NEVER switch to Devanagari or Urdu/Arabic script.
- If the customer writes in English, reply in English.
- If the customer writes in a script (e.g. Devanagari, Urdu script), you may match that script.
- Do not translate or transliterate the customer's language into a different script under any circumstance, even if the vocabulary is Hindi/Urdu in origin.

FORMATTING RULE (non-negotiable):
- Do not use Markdown formatting of any kind: no **bold**, no tables, no pipe characters, no headers, no bullet symbols like "--I--I--".
- Write in plain, natural, flowing conversational sentences, as if speaking to the customer in a showroom.
- Keep it short — 2 to 5 sentences per reply, then a natural follow-up question if relevant.

CATALOG:
{catalog}
"""


@router.post("/concierge", response_model=ConciergeResponse)
async def ask_concierge(payload: ConciergeRequest):
    if groq_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI concierge is not configured — set GROQ_API_KEY in your .env file",
        )

    # NOTE: this stuffs the entire published catalog into the prompt as context on every call.
    # That's a legitimate, honest form of grounding for a small catalog (tens of vehicles) and
    # satisfies "never hallucinate" — but it will not scale past a few hundred listings. The
    # PRD's stated future path is Voyage AI embeddings + Atlas Vector Search for real retrieval;
    # swap the block below for a vector query when the catalog grows.
    vehicles = await vehicles_collection.find({"status": "available"}).to_list(length=None)
    catalog = [serialize_doc(vehicle) for vehicle in vehicles]

    try:
        completion = groq_client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT.format(catalog=json.dumps(catalog, default=str))},
                {"role": "user", "content": payload.message},
            ],
            temperature=0.4,
        )
        reply = completion.choices[0].message.content
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"AI provider error: {error}")

    conversation_id = payload.conversationId or str(uuid.uuid4())
    return ConciergeResponse(reply=reply, conversationId=conversation_id, referencedVehicleIds=[])