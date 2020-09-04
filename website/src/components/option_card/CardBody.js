import React, { Component } from 'react'
import {Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './CardBody.css'

export default class CardBody extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleChange = event => {
        const name = event.target.name;
        var trade_id = name.split('_');
        var info = trade_id[0];
        trade_id = trade_id[1];
        var value = event.target.value;
        var stateCopy = Object.assign({}, this.state);
        if (stateCopy[trade_id] === undefined) {
            stateCopy[trade_id] = {
                'date': null,
                'price': null,
                'current': null,
                'quantity': null,
                'type': null
            };
        }
        if (info === 'price' || info === 'quantity') {
            value = parseFloat(value)
        }
        stateCopy[trade_id][info] = value
        this.setState(stateCopy);
    }

    updateCurrent = event => {
        event.preventDefault();
        var error = false;
        var trade_id = parseInt(event.target.name.split('_')[1]);
        if (Object.keys(this.state).length === 0) {
            alert("No new transaction.");
            error = true;
        }
        if (error === false) {
            var postData = this.state[trade_id].current;
            postData = { 'current': parseFloat(postData) }
            axios.post('/api/option/current/' + trade_id, postData)
                .then(response => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleClick = event => {
        var trade_id = parseInt(event.target.name.split('_')[1]);
        var postDate = { 'trade_id': trade_id }
        axios.post('/api/option/close/', postDate)
            .then(response => {
                console.log(response)
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleSubmit = event => {
        event.preventDefault();
        var trade_id = event.target.name;
        trade_id = trade_id.split('_')[1];

        var error = false;
        if (Object.keys(this.state).length === 0) {
            alert("No new transaction.");
            error = true;
        }
        var data = this.state[parseInt(trade_id)];
        var data_key = Object.keys(data);

        // check information missing
        for (let i = 0; i < data_key.length; i++) {
            var key = data_key[i];
            if (data[key] === null && key !== 'current') {
                alert('Missing ' + key);
                error = true;
                break
            }
        }

        // upload new transaction
        if (error === false) {
            var postData = this.state[parseInt(trade_id)];
            delete postData['current']
            postData = { "transaction": postData };
            axios.post('/api/option/transaction/' + trade_id, postData)
                .then(response => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    render() {
        var trans = [];
        var transactions = this.props.transactions;

        for (let i = 0; i < transactions.length; i++) {
            var total = transactions[i].price * transactions[i].quantity;
            if (transactions[i].type === 'Buy') {
                total = -total
            }
            trans.push(
                <div className="optionCard__formRow">
                    <div className="optionCard__dataTableDate">
                        <div>{transactions[i].date}</div>
                    </div>
                    <div className="optionCard__dataTablePrice">
                        <div>${transactions[i].price.toFixed(2)}</div>
                    </div>
                    <div className="optionCard__dataTableQuantity">
                        <div>{transactions[i].quantity}</div>
                    </div>
                    <div className="optionCard__dataTableTotal">
                        <div>${total.toFixed(2)}</div>
                    </div>
                    <div className="optionCard__dataTableAdd">
                    </div>
                </div>
            )
        }
        var trans_id = this.props.trans_id;
        var breakEven = this.props.strikePrice;
        if(this.props.type === "Call"){
            breakEven = breakEven+this.props.avg_cost;
        }else if(this.props.type === "Put"){
            breakEven = breakEven-this.props.avg_cost;
        }
        return (
            <div className="optionCard__body">
                <div className="optionCard__info">
                    <div className="optionCard__infoLeft">
                        <div className="optionCard__infoRow">
                            <div className="optionCard__infoTitle">
                                <p>Market Value</p>
                            </div>
                            <div className="optionCard__infoDetail">
                                <p>${(this.props.total * 100).toFixed(2)}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="optionCard__infoRow">
                            <div className="optionCard__infoTitle">
                                <p>Total Cost</p>
                            </div>
                            <div className="optionCard__infoDetail">
                                <p>${(this.props.avg_cost * this.props.quantity * 100).toFixed(2)}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="optionCard__infoRow">
                            <div className="optionCard__infoTitle">
                                <p>Expiry Date</p>
                            </div>
                            <div className="optionCard__infoDetail">
                                <p>{this.props.expireDate}</p>
                            </div>
                        </div>
                    </div>
                    <div className="optionCard__infoLeft">
                        <div className="optionCard__infoRow">
                            <div className="optionCard__infoTitle">
                                <p>Strike Price</p>
                            </div>
                            <div className="optionCard__infoDetail">
                                <p>${this.props.strikePrice}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="optionCard__infoRow">
                            <div className="optionCard__infoTitle">
                                <p>Break even</p>
                            </div>
                            <div className="optionCard__infoDetail">
                                <p>${breakEven}</p>
                            </div>
                        </div>
                        
                    </div>
                    <div className="optionCard__inforight">
                        <div className="optionCard__infoRow">
                            <h6>Current</h6>
                        </div>
                        <div className="optionCard__infoRow">
                            <Form name={"updatePrice_" + trans_id}
                                onSubmit={this.updateCurrent} >
                                <Form.Control className="optionCard__infoTitle currentInput"
                                    name={"current_" + trans_id}
                                    placeholder={this.props.current}
                                    onChange={this.handleChange}
                                    type='text' />

                                <Button className="optionCard__infoDetail currentInput"
                                    variant="warning"
                                    type="submit">Update</Button>
                            </Form>
                        </div>
                        <div className="optionCard__infoRow">
                            <Button className='option_style'
                                name={"close_" + trans_id}
                                variant="secondary"
                                type="submit"
                                onClick={this.handleClick}>Close</Button>
                        </div>
                    </div>
                </div>

                <Form name={'addtrade_' + trans_id}
                    onSubmit={this.handleSubmit} >
                    <div className="optionCard__formRow">
                        <div className="optionCard__dataTableDate">
                            <div><strong>Date</strong></div>
                        </div>
                        <div className="optionCard__dataTablePrice">
                            <div><strong>Price</strong></div>
                        </div>
                        <div className="optionCard__dataTableQuantity">
                            <div><strong>Quantity</strong></div>
                        </div>
                        <div className="optionCard__dataTableTotal">
                            <div><strong>Total</strong></div>
                        </div>
                        <div className="optionCard__dataTableAdd">
                            <div></div>
                        </div>
                    </div>
                    {trans}
                    <div className="optionCard__formRow">
                        <div className="optionCard__dataTableDate optionAdd">
                            <div>
                                <Form.Control name={'date_' + trans_id}
                                    type='date'
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="optionCard__dataTablePrice optionAdd">
                            <div>
                                <Form.Control name={'price_' + trans_id}
                                    type='text'
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="optionCard__dataTableQuantity optionAdd">
                            <div>
                                <Form.Control name={'quantity_' + trans_id}
                                    type='text'
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="optionCard__dataTableTotal optionAdd">
                            <div>
                                <Form.Control as="select"
                                    name={'type_' + trans_id}
                                    onChange={this.handleChange}>
                                    <option value='null'>Choose</option>
                                    <option value='Buy'>Buy</option>
                                    <option value='Sell'>Sell</option>
                                </Form.Control>
                            </div>
                        </div>
                        <div className="optionCard__dataTableAdd optionAdd">
                            <div>
                                <Button variant="secondary" type="submit">Add</Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}