# AURELIA

**An independent, AI-native multi-brand luxury automotive dealership platform.**

AURELIA is not a manufacturer website — it's a curated dealership that sells vehicles across multiple luxury brands (Porsche, Ferrari, Lamborghini, Rolls-Royce, Bentley, Tesla, BMW, Mercedes-Benz, Audi, McLaren, Aston Martin) through a single, premium digital showroom, with an AI concierge as a first-class discovery feature rather than a bolted-on chatbot.

---

## Tech Stack

**Frontend**
- Next.js (App Router), JavaScript
- Tailwind CSS v4 (theme tokens via `@theme` in `globals.css`, not a `tailwind.config.js`)
- Framer Motion (animations)
- Axios (API layer)
- React Hook Form
- React Context (auth, wishlist, compare — no Redux)

**Backend**
- FastAPI (async)
- MongoDB Atlas via Motor (async driver)
- JWT authentication (`python-jose` + `passlib`/`bcrypt`)
- Groq (LLM for the AI concierge)
- Cloudinary (configured, not yet wired to an upload endpoint — see [Known Gaps](#known-gaps))

**Design direction:** British racing heritage — deep racing green, bone-white, brass accent. Display serif (Bodoni Moda) for headlines, Manrope for body copy, Space Mono for specs/prices/VINs.

---

## Project Structure

```
AURELIA/
├── frontend/
│   ├── app/                     # Routes (App Router)
│   │   ├── admin/                 # Admin-only, separate login + protected dashboard
│   │   ├── collection/[slug]/     # Vehicle detail page
│   │   ├── brands/[slug]/         # Brand detail page
│   │   ├── account/                # Customer profile + reservation history
│   │   ├── login/, signup/         # Customer auth
│   │   ├── wishlist/, compare/, search/, concierge/
│   ├── components/                # Shared UI (ui/) and structural chrome (layout/)
│   ├── features/                  # Page/domain-scoped components (home, vehicles, orders, brands)
│   ├── context/                   # AuthContext, WishlistContext, CompareContext
│   ├── services/                  # ALL API calls — one file per resource
│   ├── config/, constants/, lib/, hooks/, utils/, animations/
│   └── public/                    # Static vehicle/brand images, served directly at their path
│
└── backend/
    ├── main.py                    # App entrypoint
    ├── core/                      # config, database, security, auth dependencies
    ├── models/                    # Pydantic schemas
    ├── routers/                   # One file per resource (auth, brands, vehicles, wishlist, orders, ai, dashboard, testimonials)
    ├── seed/seed_data.py          # One-time DB seeding script
    ├── utils/
    └── requirements.txt
```

---

## Setup

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows

pip install -r requirements.txt
```

> The pinned versions in `requirements.txt` matter — several packages (`motor`, `bcrypt`, `httpx`) have known compatibility breaks with their own latest releases. Install from this file as-is rather than installing packages individually.

Create `backend/.env` (copy `.env.example` and fill in):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=aurelia

JWT_SECRET_KEY=<a long random string>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# Reservation hold duration. 1 = testing (watch it expire quickly). 4320 (3 days) for production.
RESERVATION_EXPIRY_MINUTES=1

FRONTEND_ORIGIN=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GROQ_API_KEY=<from console.groq.com>
GROQ_MODEL=openai/gpt-oss-120b
```

Seed the database (idempotent — safe to re-run):

```bash
python -m seed.seed_data
```

This creates the initial brands/vehicles/testimonials and a default admin account:

```
email: admin@aurelia.com
password: ChangeMe123!
```

**Change this password before sharing the project publicly.**

Run the server:

```bash
uvicorn main:app --reload --port 8000
```

API docs: `http://127.0.0.1:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local` (optional — sensible defaults exist without it):

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_USE_MOCK_DATA=false
```

> Use `127.0.0.1` rather than `localhost` — on some Windows/Node setups, `localhost` resolves to both IPv4 and IPv6 and can cause connection errors during server-side data fetching.

Run:

```bash
npm run dev
```

Visit `http://localhost:3000`.

**Both servers must be running simultaneously** for the site to work — the frontend fetches everything live from the backend; there is no mock-data fallback in normal operation.

---

## Environment Variables Reference

| Variable | Where | Purpose |
|---|---|---|
| `MONGODB_URI` | backend | Atlas connection string |
| `MONGODB_DB_NAME` | backend | Database name |
| `JWT_SECRET_KEY` | backend | Signs auth tokens — keep secret |
| `JWT_ALGORITHM` | backend | Token signing algorithm (`HS256`) |
| `JWT_EXPIRE_MINUTES` | backend | How long a login session lasts |
| `RESERVATION_EXPIRY_MINUTES` | backend | How long a vehicle stays held after a customer reserves it |
| `FRONTEND_ORIGIN` | backend | Allowed CORS origin |
| `CLOUDINARY_*` | backend | Reserved for future image-upload endpoint (not yet used) |
| `GROQ_API_KEY` | backend | Powers the AI concierge — without it, `/ai/concierge` returns 503 |
| `GROQ_MODEL` | backend | Which Groq-hosted model to use |
| `NEXT_PUBLIC_API_BASE_URL` | frontend | Where the frontend sends API requests |
| `NEXT_PUBLIC_USE_MOCK_DATA` | frontend | Legacy flag from early development — leave `false`/unset |

---

## Features Implemented

**Customer-facing**
- Homepage: cinematic hero, featured collection, brand showcase, trust section, stats, testimonials, CTA
- Full collection browse + brand pages + vehicle detail pages with related vehicles
- Working keyword search
- Wishlist — works for guests, no login required (stored client-side)
- Compare up to 3 vehicles side-by-side
- AI Concierge — grounded strictly in the live catalog (Groq), refuses to invent vehicles/specs that don't exist
- Customer authentication (signup/login), required only at the point of reserving a vehicle
- Vehicle reservation system: confirmation modal → hold with a countdown → automatic expiry and release back to available inventory if not confirmed by the concierge in time; customer can self-cancel while still Pending
- Customer account page: profile info + full reservation history with live status timeline

**Admin**
- Separate, login-protected admin dashboard (`/admin`)
- Brands: create, edit, delete
- Vehicles: create, delete, assign an image path
- Orders: view all, advance status through the Pending → Confirmed → In Process → Completed pipeline (or cancel), which also releases the vehicle back to availability
- Dashboard stats overview

---

## Known Gaps

- **Cloudinary upload** — not wired up. Vehicle images are currently assigned as static paths from `frontend/public/` (e.g. `/bmw/bmw1.jpg`) via the admin panel, not uploaded through Cloudinary despite it being configured in the backend.
- **Reviews/comments on vehicles** — not built (no backend model or route yet).
- **UI/animation polish** — functional flows were prioritized over final visual polish for this submission.

---

## Default Login

```
Admin:    admin@aurelia.com / ChangeMe123!
Customer: create your own via /signup
```
