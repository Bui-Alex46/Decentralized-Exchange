const { ethers } = require("hardhat")
const { expect } = require("chai");

const tokens = (n) =>{
    return ethers.utils.parseUnits(n.toString(), 'ether')
}


describe('Token', () => {
    // Defining scope of token for global use
    let token;
    beforeEach(async () => {
        // Fetch token from blockchain
        const Token = await ethers.getContractFactory('Token')
        // Deploy contract to the test network
        token = await Token.deploy('Altonio', 'ALT', '1000000')
    })
    
    // Deployment Block for this token 
    describe('Deployment', () => {
        const name = 'Altonio';
        const symbol = 'ALT';
        const decimals = '18';
        const totalSupply = tokens('1000000');
        // Check name is correct
        it('has correct name', async () => {
            expect(await token.name()).to.equal(name)
        })
        // Check name is correct
        it('has correct symbol', async () => {
            expect(await token.symbol()).to.equal(symbol)
        })
        it('has correct decimals', async () => {
            expect(await token.decimals()).to.equal(decimals)
        })
        it('has correct total supply', async () => {
            expect(await token.totalSupply()).to.equal(totalSupply)
        })
    })
    
})