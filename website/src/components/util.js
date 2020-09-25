export function calculateCurrent(transactions){
    var total = 0;
    var total_quantity = 0;
    for(let j=0;j<transactions.length;j++){
        var price = transactions[j].price* transactions[j].quantity;
        if(transactions[j].type==="Buy"){
            total = total+price;
            total_quantity = total_quantity+ transactions[j].quantity;
        }else if (transactions[j].type==="Sell"){
            total = total-price;
            total_quantity = total_quantity- transactions[j].quantity;
        }
    }
    return [total, total_quantity];
}

export function calculateHistoryCost(transactions){
    var buyTotal = 0;
    var sellTotal = 0;
    for(let j=0;j<transactions.length;j++){
        var price = transactions[j].price* transactions[j].quantity;
        if(transactions[j].type==="Buy"){
            buyTotal = buyTotal+price;
        }else if (transactions[j].type==="Sell"){
            sellTotal = sellTotal+price;
        }
    }
    var total_return = sellTotal-buyTotal;
    var pct_return = 0;
    if (transactions[0].type === "Buy"){
        pct_return = total_return/buyTotal;
    } else if (transactions[0].type === "Sell"){
        pct_return = total_return/sellTotal;
    }
    return [total_return, pct_return];
}