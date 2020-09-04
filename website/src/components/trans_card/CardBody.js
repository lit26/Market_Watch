import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap';
import axios from 'axios';
import './CardBody.css'

export default class CardBody extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        };
    }

    handleChange = event =>{
        const name = event.target.name;
        var trade_id = name.split('_');
        var info = trade_id[0];
        trade_id = trade_id[1];
        var value = event.target.value;
        var stateCopy = Object.assign({}, this.state);
        if (stateCopy[trade_id]===undefined){
            stateCopy[trade_id] = {
                'date':null,
                'price':null,
                'quantity':null,
                'type': null
            };
        }
        if (info === 'price' || info === 'quantity'){
            value = parseFloat(value)
        }
        stateCopy[trade_id][info] = value
        this.setState(stateCopy);
    }

    handleSubmit = event => {
        event.preventDefault()
        var trade_id = event.target.name;
        trade_id = trade_id.split('_')[1];
        
        var error = false;
        if(Object.keys(this.state).length === 0){
            alert("No new transaction.");
            error = true;
        }
        var data = this.state[parseInt(trade_id)];
        var data_key = Object.keys(data);

        // check information missing
        for(let i=0; i<data_key.length; i++){
            var key = data_key[i];
            if(data[key] === null){
                alert('Missing '+key);
                error = true;
                break
            }
        }

        // upload new transaction
        if(error === false){
            var postData = {"transaction": this.state[parseInt(trade_id)]};
            console.log(postData)
            axios.post('/api/history/transaction/'+trade_id, postData)
                .then(response => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error =>{
                    console.log(error)
                })
        }
    }

    render() {
        var trans = [];
        var transactions = this.props.transactions;

        for (let i=0; i<transactions.length;i++){
            var total = transactions[i].price * transactions[i].quantity;
            if(transactions[i].type==='Buy'){
                total = -total
            }
            trans.push(
                <div className="transCard__formRow">
                    <div className="transCard__dataTableDate">
                        <div>{transactions[i].date}</div>
                    </div>
                    <div className="transCard__dataTablePrice">
                        <div>${transactions[i].price.toFixed(2)}</div>
                    </div>
                    <div className="transCard__dataTableQuantity">
                        <div>{transactions[i].quantity}</div>
                    </div>
                    <div className="transCard__dataTableTotal">
                        <div>${total.toFixed(2)}</div>
                    </div>
                    <div className="transCard__dataTableAdd">
                        <div></div>
                    </div>
                </div>
                )
        }
        var trans_id = this.props.trans_id;
        return (
            <div className="transCard__body">
            <Form name={'addtrade_' + trans_id}
                    onSubmit={this.handleSubmit} >
                    <div className="transCard__formRow">
                        <div className="transCard__dataTableDate">
                            <div><strong>Date</strong></div>
                        </div>
                        <div className="transCard__dataTablePrice">
                            <div><strong>Price</strong></div>
                        </div>
                        <div className="transCard__dataTableQuantity">
                            <div><strong>Quantity</strong></div>
                        </div>
                        <div className="transCard__dataTableTotal">
                            <div><strong>Total</strong></div>
                        </div>
                        <div className="transCard__dataTableAdd">
                            <div></div>
                        </div>
                    </div>
                    {trans}
                    <div className="transCard__formRow">
                        <div className="transCard__dataTableDate stockAdd">
                            <div>
                                <Form.Control name={'date_' + trans_id}
                                    type='date'
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="transCard__dataTablePrice stockAdd">
                            <div>
                                <Form.Control name={'price_' + trans_id}
                                    type='text'
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="transCard__dataTableQuantity stockAdd">
                            <div>
                                <Form.Control name={'quantity_' + trans_id}
                                    type='text'
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="transCard__dataTableTotal stockAdd">
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
                        <div className="transCard__dataTableAdd stockAdd">
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