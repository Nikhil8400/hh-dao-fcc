const { ethers } = require("hardhat");
const { MIN_DELAY } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying time lock");

  const args = [MIN_DELAY, [], []];

  const timelock = await deploy("TimeLock", {
    from: deployer,
    args: args,
    log: true,
  });
  log(`Deployed timelock to address ${timelock.address}`);
};

module.exports.tags = ["timeLock","all" ]