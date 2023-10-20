const fs = require("fs");
const { network, ethers } = require("hardhat");
const {
  proposalsFile,
  developmentChains,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const index = 0;

async function main(proposalIndex) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId][proposalIndex];
  // For voting 0=Against, 1= For, 2=Abstain
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "I liked the proposal";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voting donne!!!!!!!..");
}

main(index)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
