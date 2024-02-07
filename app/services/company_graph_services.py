import requests
from flask import current_app
import time
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

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