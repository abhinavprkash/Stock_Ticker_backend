import requests
from flask import current_app
import time
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import json


def company_tab_details(symbol):
    api_key = current_app.config['FINNHUB_API_KEY']
    url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={api_key}"

    try:
        response = requests.get(url)
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Could not find company details for {symbol}: {e}")
        return {"error": "Unable to get company details"}
    


def stock_graph(symbol):
  
    symbol = symbol.upper()
    api_key = current_app.config['POLYGON_API_KEY']
  
    
    end_date = int(time.mktime(datetime.now().timetuple()))
    start_date = int(time.mktime((datetime.now() - relativedelta(months=6, days=1)).timetuple()))
    
    end_date_str = (datetime.now()).strftime('%Y-%m-%d')
    start_date_str = (datetime.now() - relativedelta(months=6, days=1)).strftime('%Y-%m-%d')
    
    url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_date_str}/{end_date_str}?adjusted=true&sort=asc&apiKey={api_key}"
    
    stock_data = []
    stock_volume = []
    
    response = requests.get(url)
    
    result = response.json().get('results', [])
    index = 0
    
    while index < len(result):
        data = result[index]
        stock_data.append([data['t'], data['c']])
        stock_volume.append([data['t'], data['v']])
        index += 1
        
    res = json.dumps({"stock_data": stock_data, "stock_volume": stock_volume})
    return res

def company_news(symbol):
    api_key = current_app.config['FINNHUB_API_KEY']
    
    end_date_str = (datetime.now()).strftime('%Y-%m-%d')
    
    start_date_str = (datetime.now() - relativedelta(days=30)).strftime('%Y-%m-%d')

    
    url = f"https://finnhub.io/api/v1/company-news?symbol={symbol}&from={start_date_str}&to={end_date_str}&token={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        return data
    
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
                
        return data
    
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
        
        return data
    
    except requests.exceptions.RequestException as e:
        print(f"Could not find stock summary for {symbol}: {e}")
        return {"error": "Unable to get stock summary"}
