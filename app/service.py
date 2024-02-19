import requests
from flask import current_app
import time
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import json


def company_tab_details(ticker):
    api_key = current_app.config['FINNHUB_API_KEY']
    url = f"https://finnhub.io/api/v1/stock/profile2?symbol={ticker}&token={api_key}"

    try:
        response = requests.get(url)
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Could not find company details for {ticker}: {e}")
        return {"error": "Unable to get company details"}
    


def stock_graph(ticker):
  
    ticker = ticker.upper()
    api_key = current_app.config['POLYGON_API_KEY']
  
    
    end_date = int(time.mktime(datetime.now().timetuple()))
    start_date = int(time.mktime((datetime.now() - relativedelta(months=6, days=1)).timetuple()))
    
    end_date_str = (datetime.now()).strftime('%Y-%m-%d')
    start_date_str = (datetime.now() - relativedelta(months=6, days=1)).strftime('%Y-%m-%d')
    
    url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/day/{start_date_str}/{end_date_str}?adjusted=true&sort=asc&apiKey={api_key}"

    
    # response = requests.get(url)
    
    # result = response.json().get('results', [])
    # index = 0
        
    # res = json.dumps({"stock_data": stock_data, "stock_volume": stock_volume})
    # return res
    try:
        response = requests.get(url)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Could not find stock graph for {ticker}: {e}")
        return {"error": "Unable to get stock graph"}

def company_news(ticker):
    api_key = current_app.config['FINNHUB_API_KEY']
    
    end_date_str = (datetime.now()).strftime('%Y-%m-%d')
    
    start_date_str = (datetime.now() - relativedelta(days=30)).strftime('%Y-%m-%d')

    
    url = f"https://finnhub.io/api/v1/company-news?symbol={ticker}&from={start_date_str}&to={end_date_str}&token={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        return data
    
    except requests.exceptions.RequestException as e:
        print(f"Could not find company recommendations for {ticker}: {e}")
        return {"error": "Unable to get company recommendations"}
      
def company_recommendations(ticker):
    api_key = current_app.config['FINNHUB_API_KEY']
    url = f"https://finnhub.io/api/v1/stock/recommendation?symbol={ticker}&token={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
                
        return data
    
    except requests.exceptions.RequestException as e:
        print(f"Could not find company recommendations for {ticker}: {e}")
        return {"error": "Unable to get company recommendations"}
      
def company_tab_stock_summary(ticker):
    api_key = current_app.config['FINNHUB_API_KEY']
    url = f"https://finnhub.io/api/v1/quote?symbol={ticker}&token={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        return data
    
    except requests.exceptions.RequestException as e:
        print(f"Could not find stock summary for {ticker}: {e}")
        return {"error": "Unable to get stock summary"}
