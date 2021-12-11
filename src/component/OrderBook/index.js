import React, { useEffect, useState } from 'react';

const OrderBook = ({ connect, setUpdate, update }) => {
    const [buyOrder, setBuyOrder] = useState([]);
    const [sellOrder, setSellOrder] = useState([]);
    const [channelID, setChannelID] = useState(0);
    let buys = [];
    let sells = [];
    useEffect(() => {
        const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
        if (connect) {
            let msg = JSON.stringify({ 
                event: 'subscribe', 
                channel: 'book', 
                symbol: 'tBTCUSD',
                freq: 'F1'
            });
            wss.onopen = () => wss.send(msg)
            wss.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                if (Array.isArray(data[1])) {
                    if ( data[1].length > 10) {
                        setChannelID(data[0])
                        // [48278, 1, 0.00119345]
                        // [48304, 2, -0.84250245]
                        const orders = data[1];
                        orders.forEach(order => {
                            if (order[2] > 0) {
                                buys.push(order);
                            } else {
                                sells.push(order);
                            }
                        });
                        setTimeout(() => {
                            setUpdate(true)
                        }, 1000);
                    } else if (update) {
                        console.log(update)
                        const orders = data[1];
                        if (orders[2] > 0) {
                            buys.unshift(orders);
                            buys.pop();
                            console.log(buys);
                        } else {
                            sells.unshift(orders);
                            sells.pop();
                        }
                    }
                    setBuyOrder(buys);
                    setSellOrder(sells);
                }
            }
        }
    },[connect, update])
    return (
        <div style={styles.container}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Total</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody style={styles.tbody}>
                {
                    buyOrder ?
                        buyOrder.map((order, i)=>(
                            <tr key={i}>
                                <td>{order[2].toFixed(2)}</td>
                                <td>{order[0]}</td>
                            </tr>
                        ))
                        :
                        <div></div>
                }
                </tbody>
            </table>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody style={styles.tbody}>
                {
                    sellOrder ?
                        sellOrder.map((order, i)=>(
                            <tr key={i}>
                                <td>{order[0]}</td>
                                <td>{order[2].toFixed(2)}</td>
                            </tr>
                        ))
                        :
                        <div></div>
                }
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        backgroundColor: '#253038',
        height: 'auto',
        width: '600px',
        color: 'white'
    },
    name: {
        color: 'white',
        margin: 'auto 0'
    },
    table: {
        width: '50%',
        lineHeight: '1.4',
        padding: '10px'
    },
    tbody: {
        textAlign: 'center'
    }
}

export default OrderBook;
