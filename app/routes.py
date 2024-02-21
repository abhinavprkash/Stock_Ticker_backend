from flask import jsonify, request
from app import app
from app.service import (company_tab_details, company_tab_stock_summary, company_recommendations, company_news, stock_graph)


@app.route('/')
def index():
    return app.send_static_file('wbassignment2.html')

@app.route('/details')
def get_company_tab():
    symbol = request.args.get('ticker')
    company_details = company_tab_details(symbol)

    if 'error' in company_details:
        return jsonify({"error": "Unable to fetch company details"})

    return jsonify(company_details)

@app.route('/summary')
def get_company_tab_stock_summary():
    symbol = request.args.get('ticker')
    companyStockSummary = company_tab_stock_summary(symbol)
    companyRecommendations = company_recommendations(symbol)
    
    data = {"stockSummary": companyStockSummary, "recommendations": companyRecommendations}
    
    if 'error' in companyStockSummary:
        return jsonify({"error": "Unable to fetch company stock summary"})
    
    if 'error' in companyRecommendations:
        return jsonify({"error": "Unable to fetch company recommendations"})
    
    return jsonify(data)


@app.route('/news')
def get_company_news():
    symbol = request.args.get('ticker')
    companyNews = company_news(symbol)
    
    company_news_filtered = []

    for news in companyNews:
        if news.get('image') and news.get('url') and news.get('headline') and news.get('datetime'):
            company_news_filtered.append(news)

    if 'error' in companyNews:
        return jsonify({"error": "Unable to fetch company news"})
    
    companyNews = company_news_filtered[:5]

    return jsonify(companyNews)

@app.route('/graph')
def get_company_graph():
    symbol = request.args.get('ticker')
    companyGraph = stock_graph(symbol)

    if 'error' in companyGraph:
        return jsonify({"error": "Unable to fetch company graph"})

    return jsonify(companyGraph)