

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, sync, subscription
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Curio Critters API",
    description="Backend API for Curio Critters math learning game",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Parent app and game
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(sync.router, prefix="/sync", tags=["sync"])
app.include_router(subscription.router, prefix="/subscription", tags=["subscription"])

@app.get("/")
async def root():
    return {"message": "Curio Critters API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

