import React from 'react'
import './WatchListItem.css'
import CloseIcon from '@material-ui/icons/Close';

function WatchListItem({item, scrollHandler, deleteHandler}) {

    return (
        <div className="watchListItem">
            <div className="ticker" onClick={()=>scrollHandler(item)}>
                {item}
            </div>
            
            <CloseIcon onClick={()=>deleteHandler(item)}/>
        </div>
    )
}

export default WatchListItem
