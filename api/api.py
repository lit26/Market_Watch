import json
import flask
from flask import request, jsonify, abort
from webfetch import webdata

app = flask.Flask(__name__)
app.config["DEBUG"] = True

data_file = 'stock_holding.json'
option_file = 'option_holding.json'
# Function
## load data
def loadJSON(file):
	data = []
	with open(file) as f:
		data = json.load(f)
	return data

## write data
def writeJSON(outputFile, data):
	with open(outputFile, 'w', encoding='utf-8') as f:
		json.dump(data, f, ensure_ascii=False, indent=4)

api_data = loadJSON(data_file)
option_data = loadJSON(option_file)
crumbs = webdata.get_crumbs()

for i,trans in enumerate(api_data):
	if api_data[i]['status'] == 'Open':
		stock = api_data[i]['stock']
		api_data[i]['current'] = webdata.getRegularMarketData(stock, crumbs)

@app.route('/', methods=['GET'])
def home():
    return '''<h1>Trading history api</h1>'''


@app.route('/api/history/all', methods=['GET'])
def api_all():
    return jsonify(api_data)


@app.route('/api/history/<int:tran_id>', methods=['GET'])
def api_id(tran_id):
    trans = [trans for trans in api_data if trans['id'] == tran_id]
    if len(trans) == 0:
        abort(404)
    return jsonify(trans)

@app.route('/api/history/transaction', methods=['POST'])
def add_tran():
	if not request.json or not 'stock' in request.json \
		or not 'transaction' in request.json:
		abort(400)

	stock = request.json['stock'].upper()
	new_trans = {
		'id':api_data[-1]['id']+1,
		'current':webdata.getRegularMarketData(stock, crumbs),
		'status': 'Open',
		'stock': stock,
		'transaction':request.json['transaction']
	}
	api_data.append(new_trans)

	writeJSON(data_file, api_data)
	return jsonify({'result': True})

@app.route('/api/history/transaction/<int:tran_id>', methods=['POST'])
def update_tran(tran_id):
	if len(api_data) == 0:
		abort(404)
	if not request.json:
		abort(400)
	if request.json['transaction'] == "null":
		abort(400)
	for i, trans in enumerate(api_data):
		if trans['id'] == tran_id:
			api_data[i]['transaction'].append(request.json['transaction'])

			# check close
			remain_stocks = 0
			for tran in api_data[i]['transaction']:
				if tran['type'] == 'Buy':
					remain_stocks += tran['quantity']
				elif tran['type'] == 'Sell':
					remain_stocks -= tran['quantity']
			if remain_stocks == 0:
				api_data[i]['status'] = 'Close'
				del api_data[i]['current']
			break

	writeJSON(data_file, api_data)
	return jsonify({'result': True})

@app.route('/api/option/all', methods=['GET'])
def option_all():
	return jsonify(option_data)

@app.route('/api/option/<int:tran_id>', methods=['GET'])
def option_id(tran_id):
    trans = [trans for trans in option_data if trans['id'] == tran_id]
    if len(trans) == 0:
        abort(404)
    return jsonify(trans)

@app.route('/api/option/transaction/<int:tran_id>', methods=['POST'])
def update_option(tran_id):
	if len(option_data) == 0:
		abort(404)
	if not request.json:
		abort(400)
	if request.json['transaction'] == "null":
		abort(400)
	for i, trans in enumerate(option_data):
		if trans['id'] == tran_id:
			option_data[i]['transaction'].append(request.json['transaction'])
			
			# check close
			remain_stocks = 0
			for tran in option_data[i]['transaction']:
				if tran['type'] == 'Buy':
					remain_stocks += tran['quantity']
				elif tran['type'] == 'Sell':
					remain_stocks -= tran['quantity']
			if remain_stocks == 0:
				option_data[i]['status'] = 'Close'
				del option_data[i]['current']
			break


	writeJSON(option_file, option_data)
	return jsonify({'result': True})

@app.route('/api/option/transaction', methods=['POST'])
def add_option():
	if not request.json or not 'stock' in request.json \
		or not 'type' in request.json \
		or not 'transaction' in request.json:
		abort(400)

	stock = request.json['stock'].upper()
	new_trans = {
		'id':option_data[-1]['id']+1,
		'current': request.json['transaction'][0]['price'],
		'status': 'Open',
		'stock': stock,
		'transaction':request.json['transaction'],
		'type':request.json['type']
	}
	option_data.append(new_trans)

	writeJSON(option_file, option_data)
	return jsonify({'result': True})

@app.route('/api/option/current/<int:tran_id>', methods=['POST'])
def update_option_current(tran_id):
	if len(option_data) == 0:
		abort(404)
	if not request.json:
		abort(400)
	if not request.json or not 'current' in request.json:
		abort(400)
	for i, trans in enumerate(option_data):
		if trans['id'] == tran_id:
			option_data[i]['current'] = request.json['current']
			break

	writeJSON(option_file, option_data)
	return jsonify({'result': True})

@app.route('/api/option/close/', methods=['POST'])
def close_option():
	if len(option_data) == 0:
		abort(404)
	if not request.json:
		abort(400)
	if request.json['trade_id'] == "null":
		abort(400)
	for i, trans in enumerate(option_data):
		if trans['id'] == request.json['trade_id']:
			option_data[i]['status'] = 'Close'
			del option_data[i]['current']
			break

	writeJSON(option_file, option_data)
	return jsonify({'result': True})


app.run()