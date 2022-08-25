import {ethers} from "hardhat";
import {utils} from "ethers";

async function main() {
    const Ballot = await ethers.getContractFactory("Payable");
    
    const ballot = await Ballot.deploy({value:15});
    await ballot.deployed();

    console.log('deployed payable @',ballot.address)
}

main().catch(error =>{
    console.error(error);
    process.exitCode = 1;
})