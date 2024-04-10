const { ethers } = require("hardhat")

async function main() {
    console.log(`Preparing deployment...\n`)
    // Fetch contract to deploy
    const Token = await ethers.getContractFactory('Token')
    const Exchange = await ethers.getContractFactory('Exchange')
    // Getting the accounts 
    const accounts = await ethers.getSigners()
    console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`)
    
    // Deploy contracts (ERC-20 Tokens) 
    const altonio = await Token.deploy('Altonio', 'ALT', '1000000')
    await altonio.deployed()
    console.log(`ALT Deployed to: ${altonio.address}`)

    const mETH = await Token.deploy('mEther','mETH', '1000000')
    await mETH.deployed()
    console.log(`mETH Deployed to: ${mETH.address}`)

    const mDAI = await Token.deploy('mDAI','mDAI', '1000000')
    await mDAI.deployed()
    console.log(`mDAI Deployed to: ${mDAI.address}`)

    // Deploy exchange
    const exchange = await Exchange.deploy(accounts[1].address, 10)
    await exchange.deployed()
    console.log(`exchange Deployed to: ${exchange.address}`)

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
