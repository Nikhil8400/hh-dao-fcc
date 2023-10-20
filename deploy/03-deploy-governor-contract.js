const { ethers } = require("hardhat");
const {
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");
  log("Deploying governor contract....");

  const args = [
    governanceToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: args,
    log: true,
  });
};

module.exports.tags = ["governorContract", "all"]