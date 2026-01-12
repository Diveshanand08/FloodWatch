import pandas as pd
import numpy as np
import xgboost as xgb
import os

if not os.path.exists("models"):
    os.makedirs("models")

def generate_flood_data(n_samples=5000):
    data = []
    print("Generating sensitive flood data...")
    
    for _ in range(n_samples):
        month = np.random.randint(1, 13)
        
        # 1. Base Weather
        if month in [11, 12, 1, 2]: 
            base_risk = 2  # Winter base
        elif month in [7, 8, 9]: 
            base_risk = 50 # Monsoon base
        else:
            base_risk = 15

        # Randomize Params
        temp = np.random.normal(25, 10)
        humidity = np.random.normal(50, 15)
        pressure = np.random.normal(1012, 5)
        cloud_cover = np.random.randint(0, 100)
        elevation = np.random.randint(200, 250)
        siltation = np.random.randint(0, 100)
        drainage_capacity = 100 - siltation + np.random.randint(-5, 5)
        drainage_capacity = max(0, min(100, drainage_capacity))

        # 3. Calculate Risk Logic
        risk_score = base_risk

        # RULE 1: Rain Risk (Standard)
        if cloud_cover > 40:
            if drainage_capacity < 40: risk_score += 45
            if siltation > 60: risk_score += 25
            if elevation < 210: risk_score += 15
            
        # RULE 2: MAINTENANCE RISK (The Fix)
        # Even if clouds are low (e.g. 8%), if siltation exists, add small risk.
        elif cloud_cover > 5: 
            if siltation > 20: 
                risk_score += 4  # +4% pure maintenance risk
            if drainage_capacity < 85:
                risk_score += 2  # +2% capacity warning

        # Clamp but allow small risks to exist
        final_prob = max(0, min(100, risk_score + np.random.normal(0, 1)))
        
        data.append([month, temp, humidity, pressure, cloud_cover, elevation, siltation, drainage_capacity, final_prob])

    columns = ['month', 'temperature', 'humidity', 'pressure', 'cloud_cover', 'elevation', 'siltation', 'drainage_capacity', 'flood_prob']
    return pd.DataFrame(data, columns=columns)

df = generate_flood_data()
X = df.drop(['flood_prob'], axis=1)
y = df['flood_prob']

model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100)
model.fit(X, y)
model.save_model("models/flood_prediction_model.json")
print("Success! Model Retrained: Added Maintenance Risk Sensitivity.")