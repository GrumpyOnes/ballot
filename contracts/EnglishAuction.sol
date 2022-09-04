// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IERC721 {
    function transferFrom (
        address _from,
        address _to,
        uint _nftId
     ) external;
}

contract EnglishAuction {
    event Start();
    event End();
    event Bid(address indexed sender,uint amount);
    event Withdraw(address sender,uint amount);


    address payable public immutable seller;

    IERC721 public immutable nft;
    uint public immutable nftId;

    uint32 public endAt;

    bool public started;
    bool public ended;

    uint public hightestBid;
    address public hightestBider;
    mapping(address=>uint) public bids;

    constructor(address _nft,uint _nftId,uint _startBid){
        
        seller = payable(msg.sender);
        nft = IERC721(_nft);
        nftId = _nftId;
        hightestBid = _startBid;
    
    }
    function start() external {
        require(msg.sender == seller,"owner can start.");
        started = true;
        endAt = uint32(block.timestamp + 60);

        nft.transferFrom(seller, address(this), nftId);
        emit Start();
    }
    function bid() external payable {
        require(started,"need started.");
        require(block.timestamp < endAt,"has ended.");
        require(msg.value>hightestBid,"should > hightestBid");
        if(hightestBider!= address(0)){
            bids[hightestBider]+= hightestBid;
        }
        hightestBid = msg.value;
        hightestBider = msg.sender;
        emit Bid(msg.sender,msg.value);
    }
    function withdraw() external {
        uint  bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);
        emit Withdraw(msg.sender,bal);
     }
     function end() external {
        require(!ended,"has ended..");
        require(started,"not start..");
        require(block.timestamp>=endAt,"time not out.");

        ended = true;
        if(hightestBider!=address(0)){
            payable(seller).transfer(hightestBid);
            nft.transferFrom(address(this), hightestBider, nftId);
        }else{
            nft.transferFrom(address(this), seller, nftId);
        }
        
        emit End(); 
     }
}