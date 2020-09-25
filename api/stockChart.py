import pandas as pd
from finvizfinance.quote import finvizfinance
from finvizfinance.screener.ticker import Ticker
from tqdm import tqdm

ticker_list = ['SPY','AAPL','TSLA']
filters_dict = {'Price': 'Over $1'}
signals = ['Triangle Ascending','Triangle Descending','Channel Up','Channel Down','Channel']

def fetchChart():
	for ticker in tqdm(ticker_list):
	    stock = finvizfinance(ticker)
	    stock.TickerCharts(out_dir='../website/src/charts/watchlist')

def downSignalChart():
    for signal in signals:
        fticker = Ticker()
        fticker.set_filter(signal=signal)
        tickers = fticker.ScreenerView()
        for ticker in tqdm(tickers):
            stock = finvizfinance(ticker)
            stock.TickerCharts(out_dir='../website/src/charts/signal/'+signal)

def fetchSignalChart(signal):
    fticker = Ticker()
    fticker.set_filter(signal=signal)
    tickers = fticker.ScreenerView()
    return tickers

