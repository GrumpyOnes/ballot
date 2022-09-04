// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IERC721 {
    function transferFrom (
        address _from,
        address _to,
        uint _nftId
     ) external;
}

contract DutchAuction {
    uint private constant DURATION = 7 days;
    IERC721 public immutable  nft;
    uint public immutable nftId;
    address payable public immutable nftIdOwner;

    address payable public immutable seller;
    uint public immutable startingPrice;
    uint public immutable startAt;
    uint public immutable expiresAt;
    uint public immutable discountRate; //每秒折扣率
    
    constructor (uint _startingPirce,uint _discountRate,address _nft,uint _nftId,address payable _nftIdOwner) {
        seller = payable(msg.sender);
        startingPrice = _startingPirce;
        discountRate = _discountRate;

        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;
        require(_startingPirce > _discountRate*DURATION);
        nft = IERC721(_nft);
        nftId = _nftId;
        nftIdOwner = _nftIdOwner;
        
    }

    function getPrice() public view returns (uint) {
        uint timeElapsed = block.timestamp-startAt;
        uint discount = discountRate*timeElapsed;
        return startingPrice - discount;

    }

    function buy() external payable {
        require(block.timestamp < expiresAt,'action expirese');
        uint price = getPrice();
        require(msg.value>=price,"Eth < price");
        nft.transferFrom(nftIdOwner, msg.sender, nftId);
        uint refund = msg.value - price;
        if(refund>0){
            payable(msg.sender).transfer(refund);
        }
        selfdestruct(seller);
    }
}