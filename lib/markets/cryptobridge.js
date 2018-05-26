const request = require("request");
const base_url = "https://api.crypto-bridge.org/api/v1";

function get_summary(coin, exchange, cb) {
    let req_url = base_url + "/ticker";
    request({
        uri: req_url,
        json: true
    }, (error, response, body) => {
        let err = (error) => {return cb(error, null);}
        if (error) err(error);

        let market;
        for(let m = 0; m < body.length; m++) {
            market = body[m];
            if (market.id === coin+"_"+exchange) {
                break;
            }
        }
        if(typeof market === undefined) err("Couldn't get market.");
        
        return cb(null, {
            volume: market.volume,
            last: market.last,
            bid: market.bid,
            ask: market.ask
        })
    });
}

function get_trades(coin, exchange, cb) {
    return cb(null, [], []); //no possibility to get trades from CB
}

function get_orders(coin, exchange, cb) {
    return cb(null, []); //no possibility to get orders from CB
}

module.exports = {
    get_data: function (coin, exchange, cb) {
        let error = null;
        get_orders(coin, exchange, (err, buys, sells) => {
            if (err) {error = err;}
            get_trades(coin, exchange, (err, trades) => {
                if (err) {error = err;}
                get_summary(coin, exchange, (err, stats) => {
                    if (err) {error = err;}
                    return cb(error,{
                        buys: buys,
                        sells: sells,
                        chartData: [],
                        trades: trades,
                        stats: stats
                    })
                })
            })
        })
    }
}