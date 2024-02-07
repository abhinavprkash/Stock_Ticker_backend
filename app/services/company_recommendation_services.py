import requests
from flask import current_app
from app.services.company_details_services import get_ticker_symbol
def company_recommendations(symbol):
    api_key = current_app.config['FINNHUB_API_KEY']
    url = f"https://finnhub.io/api/v1/stock/recommendation?symbol={symbol}&token={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
                
        recommendation_data = {
            "buy": data[0].get("buy", ""),
            "hold": data[0].get("hold", ""),
            "period": data[0].get("period", ""),
            "sell": data[0].get("sell", ""),
            "strong_buy": data[0].get("strongBuy", ""),
            "strong_sell": data[0].get("strongSell", ""),
            "symbol": data[0].get("symbol", ""),
        }
        
        return recommendation_data
    
    except requests.exceptions.RequestException as e:
        print(f"Could not find company recommendations for {symbol}: {e}")
        return {"error": "Unable to get company recommendations"}