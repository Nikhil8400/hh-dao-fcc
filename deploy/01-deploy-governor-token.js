
const {ethers} = require("hardhat")

module.exports = async ({getNamedAccounts, deployments})=>{
    const {deploy,log} = deployments
    const {deployer} = await getNamedAccounts()
    log("Deploying Governance Token....")
    const governanceToken = await deploy("GovernanceToken",{
        from:deployer,
        args:[],
        log:true,
    })
    log(`Deployed Governance token to address ${governanceToken.address}`)

    await delegate(governanceToken.address, deployer)
    log("Delegated..")
}

//Till deploying we are not giving voting power to anyone so we are  going to make a function to give voting power 
//This function is giving authority to someone else for giving votes


const delegate = async(governanceTokenAddress, delegatedAccount )=>{
    const governanceToken = await ethers.getContractAt("GovernanceToken",governanceTokenAddress);
    const tx = await governanceToken.delegate(delegatedAccount)
    await tx.wait(1)
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}


module.exports.tags = ["governorToken", "all"]
