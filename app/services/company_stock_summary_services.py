import requests
from flask import current_app
from app.services.company_details_services import get_ticker_symbol
def company_tab_stock_summary(symbol):
    api_key = current_app.config['FINNHUB_API_KEY']
    url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        stock_data = {
            "stock_ticker_symbol": get_ticker_symbol(symbol),
            "trading_day": data.get("t", ""),
            "previous_closing_price": data.get("pc", ""),
            "opening_price": data.get("o", ""),
            "highest_price": data.get("h", ""),
            "lowest_price": data.get("l", ""),
            "change": data.get("d", ""),
            "change_percent": data.get("dp", ""),
        }
        
        return stock_data
    
    except requests.exceptions.RequestException as e:
        print(f"Could not find stock summary for {symbol}: {e}")
        return {"error": "Unable to get stock summary"}
