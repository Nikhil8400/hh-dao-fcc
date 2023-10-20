//Here we are goint to setup the value to box.sol
const { ethers, network } = require("hardhat");
const fs = require("fs")
const {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

async function propose(args, functionToCall, proposalDescription) {
  const governor = await ethers.getContract("GovernorContract")
  const box = await ethers.getContract("Box")
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
  console.log(`Proposal Description:\n  ${proposalDescription}`)
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )
  // If working on a development chain, we will push forward till we get to the voting period.
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }
  const proposeReceipt = await proposeTx.wait(1)
  const proposalId = proposeReceipt.events[0].args.proposalId
  console.log(`Proposed with proposal ID:\n  ${proposalId}`)

  const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)
  // save the proposalId
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
  if (!proposals[network.config.chainId.toString()]) {
    proposals[network.config.chainId.toString()] = [];
  }
  proposals[network.config.chainId.toString()].push(proposalId.toString())
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
  if (developmentChains.includes(network.name)) {
    await moveBlocks(3)
  }
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })