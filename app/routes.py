from flask import jsonify, request
from app import app
from app.service import company_tab_details, company_tab_stock_summary, company_recommendations, company_news, stock_graph


@app.route('/')
def index():
    return app.send_static_file('wbassignment2.html')

@app.route('/details')
def get_company_tab():
    symbol = request.args.get('symbol')
    company_details = company_tab_details(symbol)

    if 'error' in company_details:
        return jsonify({"error": "Unable to fetch company details"})

    return jsonify(company_details)

@app.route('/summary')
def get_company_tab_stock_summary():
    symbol = request.args.get('symbol')
    companyStockSummary = company_tab_stock_summary(symbol)

    if 'error' in companyStockSummary:
        return jsonify({"error": "Unable to fetch company stock summary"})

    return jsonify(companyStockSummary)

@app.route('/recommendations')
def get_company_recommendations():
    symbol = request.args.get('symbol')
    companyRecommendations = company_recommendations(symbol)

    if 'error' in companyRecommendations:
        return jsonify({"error": "Unable to fetch company recommendations"})

    return jsonify(companyRecommendations)

@app.route('/news')
def get_company_news(symbol):
    symbol = request.args.get('symbol')
    companyNews = company_news(symbol)

    if 'error' in companyNews:
        return jsonify({"error": "Unable to fetch company news"})

    return jsonify(companyNews)

@app.route('/graph')
def get_company_graph(symbol):
    symbol = request.args.get('symbol')
    companyGraph = stock_graph(symbol)

    if 'error' in companyGraph:
        return jsonify({"error": "Unable to fetch company graph"})

    return companyGraph