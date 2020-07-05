import re
import json
import datetime
import requests
import pandas as pd
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

# Getting crumbs from yahoo finance
def get_crumbs():
    url = 'https://finance.yahoo.com/quote'
    header = {'Connection': 'keep-alive',
              'Expires': '-1',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) \
               AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
              }

    website = requests.get(url, headers=header)
    soup = BeautifulSoup(website.text, 'lxml')
    crumb = re.findall('"CrumbStore":{"crumb":"(.+?)"}', str(soup))
    return crumb[0]

# Fetch history data from yahoo
def get_stock_data(symbol, crumbs, latest=5000, interval='1d'):
    current = datetime.now()
    period2 = int(datetime.timestamp(current))
    period1 = current - timedelta(days=latest)
    period1 = period1.replace(hour=0, minute=0, second=0, microsecond=0)
    period1 = int(datetime.timestamp(period1))
    includePrePost = 'true'
    url ='https://query1.finance.yahoo.com/v8/finance/chart/{}?symbol={}&period1={}&period2={}&interval={}' \
          '&includePrePost={}&events=div%7Csplit%7Cearn&lang=en-US&region=US&crumb={}&corsDomain=finance.yahoo.com'\
          ''.format(symbol, symbol, period1, period2, interval, includePrePost, crumbs)
    response = requests.get(url=url)
    if response.status_code == 200:
        response = json.loads(response.content)
        web_data = response['chart']['result'][0]['indicators']['quote'][0]
        df = pd.DataFrame()
        df['Datetime'] = response['chart']['result'][0]['timestamp']
        df['Datetime'] = df['Datetime'].apply(lambda x: datetime.fromtimestamp(x))
        ohlcv = ['Open', 'High', 'Low', 'Close', 'Volume']
        for item in ohlcv:
            df[item] = web_data[item.lower()]
        return df
    else:
        print('Web data fetch fail. Response code')
        print(response.status_code)

# Get today close stock data
def getRegularMarketData(symbol, crumbs, latest=2, interval='1d'):
    current = datetime.now()
    period2 = int(datetime.timestamp(current))
    period1 = current - timedelta(days=latest)
    period1 = period1.replace(hour=0, minute=0, second=0, microsecond=0)
    period1 = int(datetime.timestamp(period1))
    includePrePost = 'true'
    url ='https://query1.finance.yahoo.com/v8/finance/chart/{}?symbol={}&period1={}&period2={}&interval={}' \
          '&includePrePost={}&events=div%7Csplit%7Cearn&lang=en-US&region=US&crumb={}&corsDomain=finance.yahoo.com'\
          ''.format(symbol, symbol, period1, period2, interval, includePrePost, crumbs)
    response = requests.get(url=url)
    if response.status_code == 200:
        response = json.loads(response.content)
        web_data = response['chart']['result'][0]['meta']['regularMarketPrice']
        return web_data
    else:
        print('Web data fetch fail. Response code')
        print(response.status_code)