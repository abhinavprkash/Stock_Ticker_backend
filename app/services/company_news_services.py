import requests
from flask import current_app
from app.services.company_details_services import get_ticker_symbol
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

def company_news(symbol):
    api_key = current_app.config['FINNHUB_API_KEY']
    
    end_date_str = (datetime.now()).strftime('%Y-%m-%d')
    
    start_date_str = (datetime.now() - relativedelta(days=30)).strftime('%Y-%m-%d')

    
    url = f"https://finnhub.io/api/v1/company-news?symbol={symbol}&from={start_date_str}&to={end_date_str}&token={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        news_array = []
                
        for news in data:
            formatted_date = datetime.utcfromtimestamp(news['datetime']).strftime('%Y-%m-%d %H:%M:%S')
            news_array.append({
                "image": news.get("image", ""),
                "date": formatted_date,
                "url": news.get("url", ""),
                "headline": news.get("headline", ""),
            })
            if len(news_array) == 5:
                break
            
        return news_array
    
    except requests.exceptions.RequestException as e:
        print(f"Could not find company recommendations for {symbol}: {e}")
        return {"error": "Unable to get company recommendations"}