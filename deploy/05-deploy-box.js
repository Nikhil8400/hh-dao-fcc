const { ethers } = require("hardhat");
const { ADDRESS_ZERO } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  log("deploying box.....");
  const box = await deploy("Box", {       
    from: deployer,
    args: [],
    log: true,      //Here the deployer deployed this box so the owner is deployer..... we want  give owner ship of box to governance process
  });

  const timelock = await ethers.getContract("TimeLock")
  //Transferring the ownership of this block to timelock
  //const box = await deploy ... this is the block deployment object we need to get the block contract to have access to the functions
  const boxContract = await ethers.getContractAt("Box", box.address)
  const transferOwnerTX = await boxContract.transferOwnership(timelock.address)
  await transferOwnerTX.wait(1)
  log("Transfer Completed")
};


module.exports.tags = ["all", "boxDeploy"]