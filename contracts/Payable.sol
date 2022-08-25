// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Payable {
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function deposit() public payable {}

    function notPayable() public {}

    function withdraw() public {
        uint amount = address(this).balance;
        
        (bool success,) = owner.call{value:amount }("");
        require(success,"failed to send ethers");
    }

    function transfer(address payable _to,uint _amount) public {
        //uint xc = 4 ether; 不带单位表示wei
        (bool success,) = _to.call{value:_amount}("");
        require(success,"failed to transfer ethers");
    }

}