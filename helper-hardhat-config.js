const MIN_DELAY = 3600; //1 hours
const VOTING_PERIOD = 5; //5 blocks
const VOTING_DELAY = 1; //1 BLOCK
const QUORUM_PERCENTAGE = 4; //4% of voters need to be vote to pass the vote
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const NEW_STORE_VALUE = 77;
const FUNC = "store";
const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box";

const developmentChains = ["hardhat", "localhost"];
const proposalsFile = "proposals.json"

module.exports = {
  MIN_DELAY,
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  proposalsFile
};
