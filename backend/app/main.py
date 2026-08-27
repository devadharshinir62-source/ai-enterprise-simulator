from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Enterprise Simulator API")

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the agents API router
from backend.app.api.agents import router as agents_router
app.include_router(agents_router, prefix="/api")

@app.get("/", response_class=JSONResponse)
def root():
    return {"message": "AI Enterprise Simulator API is running"}

@app.get("/api/health", response_class=JSONResponse)
def health():
    return {"status": "healthy"}
