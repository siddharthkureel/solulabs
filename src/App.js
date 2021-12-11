import React, { useState } from 'react';
import OrderBook from './component/OrderBook/index';
import Ticker from './component/ticker';

function App() {

  const [connect, setConnect] = useState(false)
  const [update, setUpdate] = useState(false)

  const handleConnect = () => {
    setConnect(true)
  }
  const handleDisconnect = () => {
    setConnect(false)
  }
  return (
    <div className="App" style={styles.container}> 
      <div style={styles.buttons}>
          <button onClick={handleConnect}>Connect</button>
          <button onClick={handleDisconnect}>DisConnect</button>
      </div>
      <Ticker connect={connect}/>
        <br/>
      <OrderBook connect={connect} update={update} setUpdate={setUpdate}/>
    </div>
  );
}

const styles = {
  container: { display: 'table', margin: 'auto' }
}

export default App;
