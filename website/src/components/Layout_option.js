import React, { Component } from 'react'
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import CardHeader from './option_card/CardHeader'
import CardBody from './option_card/CardBody'
import HistTrans from './trans_card/HistTrans'
import NewOptionTradeModal from './option_card/NewOptionTradeModal'
import { calculateQuantity, calculateCurrentCost, calculateHistoryCost } from './calculateCost'
import axios from 'axios'

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        axios.get('/api/option/all')
            .then((response) => {
                var data = response.data;
                var state_copy = Object.assign({}, this.state);
                for (let i = 0; i < data.length; i++) {
                    state_copy[data[i].id] = data[i];
                }
                this.setState({ option_history: state_copy })
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        var winHeight = window.innerHeight;
        var colStyle1 = {
            height: (winHeight-350)+"px",
            overflowY: "auto"
        }
        var colStyle2 = {
            height: (winHeight-350)+"px",
            overflow: "auto"
        }
        var currentOptionCards = [];
        var historyOption = [];
        var option_history = this.state.option_history;
        var current_return = 0;
        var history_return = 0;
        for (var key in option_history) {
            var currentOptionHolding = option_history[key];
            var trans = currentOptionHolding.transaction;
            var quantity = calculateQuantity(trans);
            var symbol = currentOptionHolding.stock;
            var status = currentOptionHolding.status;
            if(status!=='Close' && quantity !== 0){
                var total = calculateCurrentCost(trans);
                var current_price = currentOptionHolding.current;
                var avg_price = total / quantity;
                var pct_return = (current_price - avg_price) / avg_price;
                var total_return = (current_price - avg_price) * quantity * 100;
                current_return = current_return + total_return;
                currentOptionCards.push(
                    <Card key={key}>
                        <Accordion.Toggle as={Card.Header} variant="link" eventKey={key}>
                           <CardHeader symbol={symbol}
                                 current={current_price}
                                 avg_cost={avg_price}
                                 quantity={quantity}
                                 type={currentOptionHolding.type}
                                 total_return={total_return}
                                 pct_return={pct_return} />
                         </Accordion.Toggle>
                         <Accordion.Collapse eventKey={key}>
                            <Card.Body>
                            <CardBody trans_id={currentOptionHolding.id}
                                    current={current_price}
                                    total={current_price*quantity}
                                    symbol={symbol} transactions={trans} />
                            </Card.Body>
                         </Accordion.Collapse>
                    </Card>
                )
            }else{
                total = calculateHistoryCost(trans);
                total_return = total[0]*100;
                history_return += total_return;
                historyOption.unshift(
                    <HistTrans key={"hist_" + key}
                                symbol={symbol}
                                total_return={total_return}
                                pct_return={total[1]} />
                        )
            }
        }

        return (
            <Container style={{minHeight: '480px', textAlign: 'left', fontSize:'13px' }}>
                <Row>
                    <Col sm={9} >
                        <h4>Current</h4>
                        <Accordion className="dataCol" style={colStyle1}>
                            {currentOptionCards}
                        </Accordion>
                    </Col>
                    <Col sm={3}>
                        <NewOptionTradeModal />
                        <h4>History</h4>
                        <div className="dataCol" style={colStyle2}>
                            {historyOption}
                        </div>
                        
                    </Col>
                </Row>
                <Row style={{textAlign:'right'}}>
                    <Col sm={9}>
                        <h6>Current: ${current_return.toFixed(2)}</h6>
                    </Col>
                    <Col sm={3}>
                        <h6>Total: ${history_return.toFixed(2)}</h6>
                    </Col>
                </Row>
            </Container>

        )
    }

}
