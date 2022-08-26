// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Ownable {
    address public owner;
    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender==owner,"not owener");
        _;
    }
    function setOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0),"invalid address");
        owner = _newOwner;
    }
}