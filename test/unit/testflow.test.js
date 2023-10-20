const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const {
  NEW_STORE_VALUE,
  FUNC,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY
} = require("../../helper-hardhat-config");
const { moveBlocks } = require("../../utils/move-blocks");
const { moveTime } = require("../../utils/move-time");

describe("Governor Flow", async () => {
  let governor, governorToken, timeLock, box;
  const voteway = 1;
  const reason = "I liked the proposal";
  beforeEach(async () => {
    await deployments.fixture(["all"]);
    governor = await ethers.getContract("GovernorContract");
    governorToken = await ethers.getContract("GovernanceToken");
    timeLock = await ethers.getContract("TimeLock");
    box = await ethers.getContract("Box");
  });
  it("can only be change through governance ", async () => {
    await expect(box.store(55)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
  it("propose, votes, wait, queues, and then executes", async () => {
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [
      NEW_STORE_VALUE,
    ]);
    const proposeTx = await governor.propose(
      [box.address],
      [0],
      [encodedFunctionCall],
      reason
    );

    const boxStartingValue = await box.retrieve();
    console.log(`Box starting Value is ${boxStartingValue}`);
    const newTx = await proposeTx.wait(1);
    const proposalId = await newTx.events[0].args.proposalId;
    let proposalState = await governor.state(proposalId);
    assert.equal(proposalState.toString(), "0");
    console.log(
      `Current proposal State is ${proposalState} with the proposal id as ${proposalId}`
    );

    await moveBlocks(VOTING_DELAY + 3);

    const voteTx = await governor.castVoteWithReason(
      proposalId,
      voteway,
      reason
    );
    await voteTx.wait(1);
    proposalState = await governor.state(proposalId);
    assert.equal(proposalState.toString(),"1")
    await moveBlocks(VOTING_PERIOD+1)

    const descriptionHash = ethers.utils.id(reason)
    const queTx = await governor.queue([box.address],[0],[encodedFunctionCall],descriptionHash)
    await queTx.wait(1)
    await moveTime(MIN_DELAY +1)
    await moveBlocks(1)

    proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)

    console.log("Executing")
    const exTx = await governor.execute([box.address],[0],[encodedFunctionCall], descriptionHash)
    await exTx.wait(1)
    const boxEndingValue = await box.retrieve()
    assert.equal(boxEndingValue,NEW_STORE_VALUE)
  });
});
