// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    constructor(
        //minDelay: How Long  you have to wait before executing  ..once proposal passes we got the min deplay
        //proposers is the list of the addresses that can propose
        //executers: Who can execute when a proposal passes{everybody}
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors) {}
}

//We want to wait for a new vote to be executed
//Give time to users to "get Out" if they don't liike a governance update
