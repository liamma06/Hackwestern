from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin with env variable
firebase_creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-service-account.json")
cred = credentials.Certificate(firebase_creds_path)
firebase_admin.initialize_app(cred)

app = FastAPI()

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple auth dependency
async def get_user_id(authorization: str = Header(...)):
    try:
        token = authorization.split("Bearer ")[1]
        decoded = auth.verify_id_token(token)
        return decoded["uid"]
    except:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/data")
async def get_data(user_id: str = Depends(get_user_id)):
    return {"user_id": user_id, "data": "your data"}

@app.post("/api/data")
async def save_data(data: dict, user_id: str = Depends(get_user_id)):
    return {"saved": True, "user_id": user_id}
