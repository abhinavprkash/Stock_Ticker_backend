import requests
from flask import current_app
import time
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


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

def get_ticker_symbol(symbol):
    company_details = company_tab_details(symbol)
    return company_details["stock_ticker_symbol"] if "error" not in company_details else None


def stock_graph(symbol):
  
    symbol = symbol.upper()
    api_key = current_app.config['POLYGON_API_KEY']
  
    
    end_date = int(time.mktime(datetime.now().timetuple()))
    start_date = int(time.mktime((datetime.now() - relativedelta(months=6, days=1)).timetuple()))
    
    end_date_str = (datetime.now()).strftime('%Y-%m-%d')
    start_date_str = (datetime.now() - relativedelta(months=6, days=1)).strftime('%Y-%m-%d')
    
    url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_date_str}/{end_date_str}?adjusted=true&sort=asc&apiKey={api_key}"
    
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
  
    graph_data = []
    
    for day in data['results']:
        graph_data.append({
          "date" : day.get("t", ""),
          "stock_price" : day.get("c", ""),
          "volume" : day.get("v", "")
        })
    
    return graph_data
  

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
