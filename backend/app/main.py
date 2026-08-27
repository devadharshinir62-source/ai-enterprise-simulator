from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.agents import router as agents_router


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI Enterprise Simulator API",
    description="Backend API for the AI Enterprise Simulator",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-enterprise-simulator.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTES
# ============================================================

app.include_router(
    agents_router,
    prefix="/api",
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/", response_class=JSONResponse)
def root():
    return {
        "message": "AI Enterprise Simulator API is running",
        "status": "success",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health", response_class=JSONResponse)
def health():
    return {
        "status": "healthy",
        "service": "AI Enterprise Simulator API",
    }


# ============================================================
# LOCAL SERVER ENTRY POINT
# ============================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )