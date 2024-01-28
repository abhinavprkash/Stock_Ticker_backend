import requests
from flask import current_app

def company_tab_details(symbol):
    api_key = current_app.config['FINNHUB_API_KEY']
    url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()  
        data = response.json()

        company_data = {
            "company_logo": data.get("logo", ""),
            "company_name": data.get("name", ""),
            "stock_ticker_symbol": data.get("ticker", ""),
            "stock_exchange_code": data.get("exchange", ""),
            "company_start_date": data.get("ipo", ""),
            "category": data.get("finnhubIndustry", ""),
        }

        return company_data

    except requests.exceptions.RequestException as e:
        print(f"Could not find company details for {symbol}: {e}")
        return {"error": "Unable to get details of the company"}
