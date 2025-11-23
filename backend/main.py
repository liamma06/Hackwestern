from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

# Load environment variables
load_dotenv()

class GPIOData(BaseModel):
    pin: int
    state: int



# Initialize Firebase Admin with env variable
firebase_creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-service-account.json")
cred = credentials.Certificate(firebase_creds_path)
firebase_admin.initialize_app(cred)


app = FastAPI()

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/gpio")
async def update_gpio(data: GPIOData):
    print(f"Received GPIO data: {data}")
    return {"status": "received"}

# --- Seat state and WebSocket logic ---
from fastapi import WebSocket

seat_states = {}      # e.g., {1: 1, 2: 0, 3: 1}
clients = []

@app.post("/update")
async def update_state(data: dict):
    seat_id = data["seat_id"]
    status = data["status"]

    seat_states[seat_id] = status

    # broadcast update
    for ws in clients:
        await ws.send_json({"seat_id": seat_id, "status": status})

    return {"ok": True}

@app.websocket("/ws")
async def websocket(ws: WebSocket):
    await ws.accept()
    clients.append(ws)

    # Send all current seat states
    await ws.send_json(seat_states)

    try:
        while True:
            await ws.receive_text()
    except Exception:
        if ws in clients:
            clients.remove(ws)

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


# Configure Gemini

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.post("/api/chat")
async def chat_with_bot(payload: dict):
    """Chat endpoint that uses Gemini with seat data context"""
    try:
        user_message = payload.get('message', '')

        # Use mock seat data for testing
        seats = [
            {"id": "A1", "occupied": False, "popularity": 10},
            {"id": "A2", "occupied": True, "popularity": 80},
            {"id": "B1", "occupied": False, "popularity": 30},
            {"id": "B2", "occupied": True, "popularity": 60},
        ]

        total_seats = len(seats)
        occupied_count = sum(1 for s in seats if s.get('occupied'))
        available_count = total_seats - occupied_count
        popular_seats = sorted(seats, key=lambda s: s.get('popularity', 0), reverse=True)[:2]
        quiet_seats = [s for s in seats if not s.get('occupied') and s.get('popularity', 50) < 60]

        context = f"""You are a helpful library seat assistant. Here's the current data:
        - Total seats: {total_seats}
        - Occupied: {occupied_count}
        - Available: {available_count}
        - Most popular seats: {', '.join([s['id'] for s in popular_seats])}
        - Quiet available seats: {', '.join([s['id'] for s in quiet_seats])}

        Answer the user's question helpfully and concisely and fitting thier needs.
        For example, if they ask for a quiet seat, suggest from the quiet available seats.
        For example, if they ask for a popular seat, suggest from the most popular seats.
        """

        # Call Gemini using new API
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=f"{context}\n\nUser: {user_message}"
        )
        return {
            "success": True,
            "message": response.text
        }

    except Exception as e:
        print(f"Gemini chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
