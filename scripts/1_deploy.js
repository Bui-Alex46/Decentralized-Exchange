
async function main() {
    // Fetch contract to deploy
    const Token = await ethers.getContractFactory("Token")
    
    
    // Deploy contract
    const token = await Token.deploy()
    // 
    await token.deployed()
    // Get the token address formatted as a string
    console.log(`Token Deployed to: ${token.address}`)

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
