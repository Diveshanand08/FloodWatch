from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xgboost as xgb
import pandas as pd
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = xgb.XGBRegressor()
model_path = os.path.join(os.path.dirname(__file__), "models/flood_prediction_model.json")
model.load_model(model_path)

class FloodInput(BaseModel):
    ward_name: str
    month: int
    temperature: float
    humidity: float
    pressure: float
    cloud_cover: float
    # NEW PARAMS
    elevation: float
    siltation: float
    drainage_capacity: float

@app.post("/predict")
def predict_flood(data: FloodInput):
    input_df = pd.DataFrame([[
        data.month,
        data.temperature,
        data.humidity,
        data.pressure,
        data.cloud_cover,
        data.elevation,        # New
        data.siltation,        # New
        data.drainage_capacity # New
    ]], columns=['month', 'temperature', 'humidity', 'pressure', 'cloud_cover', 'elevation', 'siltation', 'drainage_capacity'])
    
    prediction = float(model.predict(input_df)[0])
    probability = max(0, min(100, prediction))
    
    # Simple logic for confidence
    confidence = 92 if probability < 20 else 85

    # Trend logic: If drainage is bad, trend is "rising"
    trend = "stable"
    if data.drainage_capacity < 40 and data.cloud_cover > 50:
        trend = "rising"
    elif probability < 10:
        trend = "falling"

    return {
        "ward": data.ward_name,
        "probability": int(probability),
        "confidence": confidence,
        "trend": trend,
        "timeframe": "10-30 min"
    }