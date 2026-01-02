"""
Fast API backend routes

This file cals services functions, handle exceptions, and return JSON
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services import get_all_salary_data, get_qualifying_offer

app = FastAPI(
    title="Phillies Questionnaire Backend",
    description="Backend API for the Phillies Questionnaire application.",
)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",  # Vite default development server
    "https://phillies-assessment.onrender.com", # Render URL
    "https://*.vercel.app", # Vercel deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def root():
#     return {"status": "healthy"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/get-all-rows")
def get_all_rows():
    """
    Get all rows from data source
    """
    result = get_all_salary_data()
    return result


@app.get("/qualifying-offer")
def read_qualifying_offer():
    """
    Get qualifying offer

    Calculates and returns mlb qualifying offer

    returns qualifying offer value as JSON
    """
    # call the logic from the services.py file
    result = get_qualifying_offer()
    return result