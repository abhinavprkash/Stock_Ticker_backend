from flask import jsonify
from app import app
from app.services import company_tab_details

@app.route('/company/details/<symbol>')
def get_company_tab(symbol):
    company_details = company_tab_details(symbol)

    if 'error' in company_details:
        return jsonify({"error": "Unable to fetch company details"})

    return jsonify({"company_details": company_details})
