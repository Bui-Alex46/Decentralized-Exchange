const { ethers } = require("hardhat")
const { expect } = require("chai");

const tokens = (n) =>{
    // Converting value to wei, b/c there is no decimals
    // Wei is the unit amount of ETH
    return ethers.utils.parseUnits(n.toString(), 'ether')
}


describe('Token', () => {
    // Defining scope of token for global use
    let token, accounts, deployer, receiver, exchange;
   

    beforeEach(async () => {
        // Fetch token from blockchain
        const Token = await ethers.getContractFactory('Token')
        // Deploy contract to the test network
        token = await Token.deploy('Altonio', 'ALT', '1000000')
        // Fetch accounts
        // Signer = addresses
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
        exchange = accounts[2]
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
        it('assigns total supply to deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })

    })


    describe('Sending Tokens', () => {
        let amount, transaction, result;

        describe('Success', () => {
            beforeEach(async () => {
                amount = tokens(100)
                // Transfer Tokens
                // Connect deployer to the token contract
                transaction = await token.connect(deployer).transfer(receiver.address, amount)
                result = await transaction.wait()
            })
            it('transfers token balance', async () => {
                // Ensure tokens were transfered (Balanced change)
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            
            })
            it('emits a transfer event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')
                
                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects insufficient balances', async () => {
                // Transfer more tokens than deployer has
                const invalidAmount = tokens(100000000)
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
            })
            it('rejects invalid recipient', async () => {
                const amount = tokens(100)
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
            })
        })

    })
    
    describe('Approving Tokens', () => {
        let amount, transaction, result
        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {
            it('allocates an allowance for delegated token spending', async () => {
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)

            })
            it('emits an approval event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Approval')
                
                const args = event.args
                expect(args.owner).to.equal(deployer.address)
                expect(args.spender).to.equal(exchange.address)
                expect(args.value).to.equal(amount)
            })

        })

        describe('Failure', () => {
            it('rejects invalid spenders', async () => {
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000',amount)).to.be.reverted
            })
        })
    })

    describe('Delegated Token Transfers', () => {
        let amount, transaction, result

        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })
        
        describe('Success', () => {
            beforeEach(async () => {
                transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
                result = await transaction.wait()
            })

            it('transfers token balances', async () => {
                expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits('999900', 'ether'))
                expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
            })

            it('resets the allowance', async () => {
                expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
            })
            
            it('emits a transfer event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')
                
                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('Rejects insufficient amounts', async() => {
                const invalidAmount = tokens(100000000) //Greater than total supply 
                await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
            })
        })
    })
})