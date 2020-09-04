import React, { Component } from 'react'
import {Accordion, Card, Button } from 'react-bootstrap';
import CardHeader from './trans_card/CardHeader'
import CardBody from './trans_card/CardBody'
import HistTrans from './trans_card/HistTrans'
import BuyNewModal from './trans_card/BuyNewModal'
import { calculateQuantity, calculateCurrentCost, calculateHistoryCost } from './calculateCost'
import axios from 'axios'
import './Layout.css'

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        axios.get('/api/history/all')
            .then((response) => {
                var data = response.data;
                var state_copy = Object.assign({}, this.state);
                for (let i = 0; i < data.length; i++) {
                    state_copy[data[i].id] = data[i];
                }
                this.setState({ stock_history: state_copy })
            })
            .catch((error) => {
                console.log(error)
            });
    }

    handleClick = event => {
        event.preventDefault()
        axios.get('/api/history/update')
            .then((response) => {
                console.log(response)
                window.location.reload(false);
            })
            .catch((error) => {
                console.log(error)
            });

    }

    render() {
        var currentStockCards = [];
        var historyStock = [];
        var stock_history = this.state.stock_history;
        var current_return = 0;
        var history_return = 0;
        for (var key in stock_history) {
            var currentStockHolding = stock_history[key];
            var trans = currentStockHolding.transaction;
            var quantity = calculateQuantity(trans);
            var symbol = currentStockHolding.stock;
            if (quantity > 0) {
                var total = calculateCurrentCost(trans);
                var current_price = currentStockHolding.current;
                var avg_price = total / quantity;
                var pct_return = (current_price - avg_price) / avg_price;
                var total_return = (current_price - avg_price) * quantity;
                var current_total = current_price * quantity;
                current_return = current_return + total_return;
                currentStockCards.push(
                    <Card key={key}>
                        <Accordion.Toggle as={Card.Header} variant="link" eventKey={key}>
                            <CardHeader symbol={symbol}
                                total={current_total}
                                current={current_price}
                                avg_cost={avg_price}
                                quantity={quantity}
                                total_return={total_return}
                                pct_return={pct_return} />
                        </Accordion.Toggle>

                        <Accordion.Collapse eventKey={key}>
                            <Card.Body>
                                <CardBody trans_id={currentStockHolding.id}
                                    symbol={symbol} transactions={trans} />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            } else {
                // eslint-disable-next-line
                var total = calculateHistoryCost(trans);
                history_return = history_return + total[0];

                historyStock.unshift(
                    <HistTrans key={"hist_" + key}
                        symbol={symbol}
                        total_return={total[0]}
                        pct_return={total[1]} />
                )
            }
        }

        return (
            <div className="page">
                <div className="data_table">
                    <div className="data__left">
                        <div className='body_header_row'>
                            <div><h4>Current</h4></div>
                            <div>
                                <Button className="update_button" variant="link" onClick={this.handleClick}>Update</Button>
                            </div>
                        </div>

                        <Accordion className="dataCol_left">
                            {currentStockCards}
                        </Accordion>
                    </div>
                    <div className="data__right">
                        <BuyNewModal />
                        <h4>History</h4>
                        <div className="dataCol_right">
                            {historyStock}
                        </div>
                    </div>
                </div>
                <div className="summary">
                    <div className="data__left">Current: ${current_return.toFixed(2)}</div>
                    <div className="data__right">Total: ${history_return.toFixed(2)}</div>
                </div>
            </div>
        )
    }

}
