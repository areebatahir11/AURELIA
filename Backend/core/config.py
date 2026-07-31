from pydantic_settings import BaseSettings, SettingsConfigDict
#core/config.py

class Settings(BaseSettings):
    # --- Database ---
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "aurelia"

    # --- Auth ---
    jwt_secret_key: str = "change-this-in-your-.env-file"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    # --- CORS ---
    frontend_origin: str = "http://localhost:3000"

    # --- Cloudinary ---
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    # --- AI (Groq) ---
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-120b" 

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()