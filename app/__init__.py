from flask import Flask 

app = Flask(__name__)
app.config['FINNHUB_API_KEY'] = 'cmr6lipr01qvmr5q0ikgcmr6lipr01qvmr5q0il0'
app.config['POLYGON_API_KEY'] = 'ieKDgWIyGyoEJID4ck9EoOsIBsozFNBh'

from app import routes
