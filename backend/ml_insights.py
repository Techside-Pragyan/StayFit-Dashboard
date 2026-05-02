import numpy as np
from sklearn.linear_model import LinearRegression

def generate_insights(logs, goal):
    if not logs:
        return {"tips": ["Log your daily data to get personalized insights!"], "trends": {}}
        
    tips = []
    trends = {}
    
    # Sort logs by date ascending
    logs.sort(key=lambda x: x.date)
    
    # Latest log
    latest = logs[-1]
    
    # Sleep analysis
    if latest.sleep_hours:
        if latest.sleep_hours < 7:
            tips.append(f"You slept {latest.sleep_hours}h. Try to get at least 7-8 hours of sleep for better recovery.")
        elif latest.sleep_hours > 9:
            tips.append(f"You slept {latest.sleep_hours}h. Consider maintaining a more standard 8-hour sleep schedule.")
            
    # Water analysis
    if latest.water_intake and goal and goal.daily_water:
        if latest.water_intake < goal.daily_water:
            tips.append(f"You drank {latest.water_intake}L of water. Your goal is {goal.daily_water}L. Keep hydrated!")
            
    # Steps analysis
    if latest.steps and goal and goal.daily_steps:
        if latest.steps < goal.daily_steps:
            tips.append(f"You took {latest.steps} steps. Try a short walk to reach your {goal.daily_steps} step goal!")
        else:
            tips.append("Great job hitting your step goal!")
            
    # Weight trend (using Linear Regression)
    weights = [log.weight for log in logs if log.weight is not None]
    if len(weights) >= 3:
        X = np.array(range(len(weights))).reshape(-1, 1)
        y = np.array(weights)
        model = LinearRegression().fit(X, y)
        slope = model.coef_[0]
        
        if slope > 0.1:
            trends['weight'] = 'increasing'
            tips.append("Your weight seems to be trending upwards over the last few logs.")
        elif slope < -0.1:
            trends['weight'] = 'decreasing'
            tips.append("You are consistently losing weight.")
        else:
            trends['weight'] = 'stable'
            
    if not tips:
        tips.append("Keep logging your daily metrics to see more insights!")
        
    return {
        "tips": tips,
        "trends": trends
    }
