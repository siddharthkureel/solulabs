import React, { useEffect, useState } from 'react';
import logo from './bitcoin-logo.png';

const Ticker = ({ connect, disconnect }) => {

    const [price, setPrice] = useState(0);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(0);
    const [volume, setVolume] = useState(0);
    const [dailyChange, setDailyChange] = useState(0);
    const [dailyChangePercent, setDailyChangePercent] = useState(0);
    const [channelID, setChannelID] = useState(0);
    
    
    useEffect(() => {

        const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

        if (connect) {
            let msg = JSON.stringify({ 
                event: 'subscribe', 
                channel: 'ticker', 
                symbol: 'tBTCUSD' 
            })
            wss.onopen = () => wss.send(msg)
            wss.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                if(Array.isArray(data[1])){
                    // [ BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_RELATIVE, LAST_PRICE, VOLUME, HIGH, LOW ]
                    //destructure of above data
                    const [ , , , , DAILY_CHANGE, , LAST_PRICE, VOLUME, HIGH, LOW ] = data[1]
                    setChannelID(data[0])
                    setPrice(LAST_PRICE.toFixed(2));
                    setDailyChange(DAILY_CHANGE.toFixed(2));
                    setLow(LOW.toFixed(2));
                    setHigh(HIGH.toFixed(2));
                    setVolume(VOLUME.toFixed(2));
                    const percentageChange = DAILY_CHANGE * 100 / LOW;
                    setDailyChangePercent(percentageChange);
                }
            }
        }
        if (disconnect) {
            try {
                
                let msg = JSON.stringify({ 
                    event: 'unsubscribe', 
                    chanId: channelID, 
                })
                wss.onclose = () => wss.send(msg)

            } catch (error) {
                console.log(error)
            } finally {
                window.location.reload()
            }
        }
        
    },[connect, disconnect, channelID])

    return (
        <div style={styles.container}>
            <div style={styles.logo}>
            </div>
            <div style={styles.subContainer}>
                <div style={styles.left}>
                        <span>BTC/USD</span><br/>
                        <div>
                            <span style={styles.silver}>VOL</span>
                                &nbsp;{volume}&nbsp; 
                            <span style={styles.silver}>BTC</span>
                        </div>
                        <div>
                            <span style={styles.silver}>LOW</span>
                            &nbsp;{low}
                        </div>
                    </div>
                    <div style={styles.left}>
                        <span>{price}</span><br/>
                        <span style={dailyChange > 0 ? { color: 'green' } : { color: 'red' }} >
                            {dailyChange} &nbsp; ({dailyChangePercent.toFixed(2)} %)
                        </span><br/>
                        <div>
                            <span style={styles.silver}>HIGH</span>
                            &nbsp;{high}
                        </div>
                    </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        backgroundColor: '#253038',
        height: '120px',
        width: '600px',
        lineHeight: '1.4'
    },
    logo: {
        height: '40px',
        width: '50px',
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '40px 40px',
        margin: 'auto 15px'
    },
    left: {
        color: 'white',
        margin: 'auto 0'
    },
    subContainer: {
        display: 'flex',
        height: '120px',
        width: '100%',
        justifyContent: 'space-between',
        padding: '0 20px'
    },
    silver: {
        color: 'silver'
    }
}

export default Ticker;
