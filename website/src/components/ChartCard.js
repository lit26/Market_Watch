import React,{useState} from 'react'
import './ChartCard.css'
import CloseIcon from '@material-ui/icons/Close';
import {Modal} from 'react-bootstrap';

function ChartCard({id, imgUrl, imgWidth}) {
    const [isShow, setShow] = useState(true);
    const [zoomImg, setZoom] = useState(false)

    return (
        <>
        {isShow &&
            <div id={id} className="chartCard" style={{width: imgWidth+'px'}}>
                <img className="chartCard__img"
                    src={require(`../charts/${imgUrl}`)} 
                    onClick={() => setZoom(!zoomImg)}
                    alt=""/>
                <CloseIcon 
                    className="chartCard__closeIcon" 
                    onClick={()=>setShow(!isShow)}/>

                <Modal size="xl" show={zoomImg} onHide={() => setZoom(false)} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>{id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <img className="chartCard__img"
                        src={require(`../charts/${imgUrl}`)} 
                        alt=""/>
                    </Modal.Body>
                </Modal>
                
            </div>
        }
        </>
    )
}

export default ChartCard;
