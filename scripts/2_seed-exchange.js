const { ethers } = require("hardhat")
const config = require('../src/config.json')

const tokens = (n) =>{
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
  // Fetch accounts from wallets - these are unlocked
  const accounts = await ethers.getSigners()

  // Fetch network
  const {chainId} = await ethers.provider.getNetwork()
  console.log("Using chainId:", chainId)

  // Fetch deployed tokens
  const ALT = await ethers.getContractAt('Token', config[chainId].ALT.address)
  console.log('ALT Token fetched at: ', ALT.address)

  const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
  console.log('mETH Token fetched at: ', mETH.address)

  const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
  console.log('mDAI Token fetched at: ', mDAI.address)

// Fetch deployed Exchange
  const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address )
  console.log('Exchange fetched at: ', exchange.address)

  // Give tokens to account[1]
  const sender = accounts[0]
  const receiver = accounts[1]
  let amount = tokens(10000)
  // User1 transfers 10,000 mEth...
  let transaction, result
  transaction = await mETH.connect(sender).transfer(receiver.address, amount)
  console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)


  // Setup Exchange users
  const user1 = accounts[0]
  const user2 = accounts[1]
  amount = tokens(10000)

  // user1 approves 10,000 ALT
  transaction = await ALT.connect(user1).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} tokens from ${user1.address}`)

  // User1 deposits 10,000 ALT
  transaction = await exchange.connect(user1).depositToken(ALT.address, amount)
  await transaction.wait()
  console.log(`Deposited ${amount} Ether from ${user1.address}\n`)

  // User2 approves mETH
  transaction = await mETH.connect(user2).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} tokens from ${user2.address}`)

  // User2 Deposits 10,000 mETH
  transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
  await transaction.wait()
  console.log(`Deposited ${amount} Ether from ${user2.address}\n`)

  // ----------------------------------------------------
  // SEED A CANCELLED ORDER
  
  //  User 1 makes order to get tokens 
  let orderId 
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), ALT.address, tokens(5))
  result  = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User 1 cancels order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user1).cancelOrder(orderId)
  result = await transaction.wait()
  console.log(`Cancelled order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // -------------------------------------------------
  // SEED FILLED ORDERS

  // User 1 makes order
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), ALT.address, tokens(10))
  result  = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User 2 fills order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // Wait 1 seconds
  await wait(1)

  // User 1 makes another order
  transaction = await exchange.makeOrder(mETH.address, tokens(50), ALT.address, tokens(15))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User 2 fills order again
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)
// Wait 1 seconds
  await wait(1)

  // User 1 makes final order
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), ALT.address, tokens(20))
  result  = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User 2 fills final order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // Wait 1 seconds
  await wait(1)

  // --------------------------------------------------
  // SEED OPEN ORDERS

  // User 1 makes 10 orders
  for(let i = 1; i <= 10; i++){
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens((i  * 10)), ALT.address, tokens(10))
    result = await transaction.wait()

    console.log(`Made order form ${user1.address}`)
    // Wait 1 second
    await wait(1)
  }

  // User 2 makes 10 orders
  for(let i = 1; i <= 10; i++){
    transaction = await exchange.connect(user2).makeOrder(ALT.address, tokens(10), mETH.address, tokens(10 * i))
    result = await transaction.wait()

    console.log(`Made order form ${user2.address}`)

     // Wait 1 second
     await wait(1)
  }

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
