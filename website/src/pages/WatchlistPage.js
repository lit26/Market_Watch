import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChartCard from '../components/ChartCard'
import WatchListItem from '../components/WatchListItem'
import './Watchlistpage.css'
import Slider from '@material-ui/core/Slider';
import RefreshIcon from '@material-ui/icons/Refresh';

function WatchlistPage() {
    const [charts, setCharts] = useState([]);
    const [value, setValue] = useState(7.5);
    const [myList, setList] = useState('watchlist');
    const [tickers, setTickers] = useState([]);
    const [cookie, updateCookie] = useState(false);
    const [warning, setWarning] = useState(false);

    const listCategory = {
        'watchlist': 'Watchlist',
        'triangleAsc': 'Triangle Ascending',
        'triangleDes': 'Triangle Descending',
        'channelUp': 'Channel Up',
        'channelDown': 'Channel Down',
        'channel': 'Channel'
    }

    useEffect(() => {
        let cookie = document.cookie;
        if (cookie.length > 0) {
            let cookies = cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                let cookie_name = cookies[i].trim().split('=')[0]
                let cookie_value = cookies[i].trim().split('=')[1]
                if (cookie_name === 'image_size') {
                    setValue(parseFloat(cookie_value))
                } else {
                    setList(cookie_value)
                }
            }
        }
        updateCookie(true)
    }, [])

    useEffect(() => {
        if (cookie) {
            document.cookie = `image_size=${value};`;
            document.cookie = `list=${myList}`;
        }
    }, [value, myList, cookie])

    useEffect(() => {
        if (myList.length > 0) {
            axios.get('/api/tickercategory?list=' + myList)
                .then(res => {
                    if (res.data.refresh === 0) {
                        setCharts(res.data.chart)
                        setTickers(res.data.viewList)
                        setWarning(false)
                    } 
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [myList])


    const refreshClick = () => {
        axios.get('/api/rehreshcharts')
            .then(res => {
                console.log('Rehreshing ...')
            })
            .catch(err => {
                console.log(err)
            })
    }

    const scrollHandler = (item) => {
        let selectTicker = document.getElementById(item)
        selectTicker.scrollIntoView({ behavior: 'smooth' });
    }

    const deleteHandler = (item) => {
        let postItem = { 'dir': myList, 'ticker': item };
        axios.post('/api/delete_chart', postItem)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <>
            {warning &&
            <div className="stockCharts__refreshWarn">
                <h6>Rehreshing</h6>
            </div>}
            <div className="analysisPage">
                <div className="stockCharts">
                    <div className="stockCharts__header">
                        <h4>Charts</h4>
                        <Slider
                            className="stockCharts__slider"
                            min={6}
                            step={0.5}
                            max={15}
                            value={value}
                            onChange={(e, newValue) => setValue(newValue)}
                            // valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                        // getAriaValueText={valuetext}
                        />
                        <RefreshIcon className="stockCharts__rehresh" onClick={refreshClick} />
                    </div>

                    <div className="stockChart">
                        {
                            charts.map((chart, index) =>
                                <ChartCard
                                    id={chart.ticker}
                                    key={index}
                                    imgUrl={chart.path}
                                    imgWidth={value * 70} />
                            )
                        }
                    </div>
                </div>
                <div className="watchList">
                    <h4>{listCategory[myList]}</h4>
                    <select className="watchList__category" onChange={(e) => setList(e.target.value)} value={myList}>
                        <option value="watchlist">Watch list</option>
                        <optgroup label="Trading Signal">
                            <option value="triangleAsc">Triangle Ascending</option>
                            <option value="triangleDes">Triangle Descending</option>
                            <option value="channelUp">Channel Up</option>
                            <option value="channelDown">Channel Down</option>
                            <option value="channel">Channel</option>
                        </optgroup>
                    </select>
                    <div className="watchList__items">
                        {
                            tickers.map((ticker, index) =>
                                <WatchListItem
                                    key={index}
                                    item={ticker}
                                    scrollHandler={scrollHandler}
                                    deleteHandler={deleteHandler} />
                            )
                        }
                    </div>
                    <div className="watchList__summary">
                        <span>No. {tickers.length}</span>

                    </div>

                </div>
            </div>
        </>

    )
}

export default WatchlistPage
