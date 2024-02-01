from flask import jsonify
from app import app
from app.service import company_tab_details, company_tab_stock_summary, company_recommendations, company_news, stock_graph

@app.route('/company/details/<symbol>')
def get_company_tab(symbol):
    company_details = company_tab_details(symbol)

    if 'error' in company_details:
        return jsonify({"error": "Unable to fetch company details"})

    return jsonify({"company_details": company_details})

@app.route('/company/summary/<symbol>')
def get_company_tab_stock_summary(symbol):
    companyStockSummary = company_tab_stock_summary(symbol)

    if 'error' in companyStockSummary:
        return jsonify({"error": "Unable to fetch company stock summary"})

    return jsonify({"company_stock_summary": companyStockSummary})

@app.route('/company/recommendations/<symbol>')
def get_company_recommendations(symbol):
    companyRecommendations = company_recommendations(symbol)

    if 'error' in companyRecommendations:
        return jsonify({"error": "Unable to fetch company recommendations"})

    return jsonify({"company_recommendations": companyRecommendations})

@app.route('/company/news/<symbol>')
def get_company_news(symbol):
    companyNews = company_news(symbol)

    if 'error' in companyNews:
        return jsonify({"error": "Unable to fetch company news"})

    return jsonify({"company_news": companyNews})

@app.route('/company/graph/<symbol>')
def get_company_graph(symbol):
    companyGraph = stock_graph(symbol)

    if 'error' in companyGraph:
        return jsonify({"error": "Unable to fetch company graph"})

    return jsonify({"company_graph": companyGraph})