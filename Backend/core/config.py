from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database ---
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "aurelia"

    # --- Auth ---
    jwt_secret_key: str = "change-this-in-your-.env-file"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    # --- Reservations ---
    # Testing value: 1 minute, so you can watch a reservation expire without waiting.
    # For production, set this to 4320 (3 days) via RESERVATION_EXPIRY_MINUTES in .env.
    reservation_expiry_minutes: int = 1

    # --- CORS ---
    frontend_origin: str = "http://localhost:3000"

    # --- Cloudinary ---
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    # --- AI (Groq) ---
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"  # check console.groq.com/docs/models for the current model list

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()