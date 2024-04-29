import {useEffect} from 'react';
import {useDispatch} from 'react-redux'
import config from '../config.json';
import Navbar from './Navbar'
import Markets from './Markets'
import Balance from './Balance'
import Order from './Order'
import {
  loadProvider, 
  loadNetwork, 
  loadAccount, 
  loadTokens,
  loadExchange,
  subscribeToEvents
} from '../store/interactions';

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch)

    // Fetch current network's chainID (e.g. hardhat: 31337, kovan: 42, etc.. )
    const chainId  = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
    // Fetch current account & balance from Metamask when changed
    window.ethereum.on('accountsChanged',  () => {
      loadAccount(provider, dispatch)
    })
    // 

    // Load Token smart contract
    const ALT = config[chainId].ALT
    const mETH = config[chainId].mETH
    const mDAI = config[chainId].mDAI
    await loadTokens(provider, [ALT.address, mETH.address, mDAI.address ], dispatch)

    // Load Exchange smart contract
    const exchangeConfig = config[chainId].exchange
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch )
    
    // Listen to events 
    subscribeToEvents(exchange, dispatch)
  
  }
  
  useEffect(() => {
    loadBlockchainData()
  })


  return (
    <div>

      {/* Navbar */}
      <Navbar />
      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}
          <Markets />

          {/* Balance */}
          <Balance />

          {/* Order */}
          <Order />

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
