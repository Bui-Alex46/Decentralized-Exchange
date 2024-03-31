const { ethers } = require("hardhat")
const { expect } = require("chai");


describe('Token', () => {
    // Defining scope of token for global use
    let token;
    beforeEach(async () => {
        // Fetch token from blockchain
        const Token = await ethers.getContractFactory('Token')
        // Deploy contract to the test network
        token = await Token.deploy()
    })
     // Check name is correct
    it('has correct name', async () => {
       
        expect(await token.name()).to.equal('Altonio')
    })
     // Check name is correct
    it('has correct symbol', async () => {
       
        expect(await token.symbol()).to.equal('ALT')
    })
})