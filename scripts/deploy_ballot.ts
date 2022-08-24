import {ethers} from "hardhat";
import {utils} from "ethers";

async function main() {
    const Ballot = await ethers.getContractFactory("Ballot");
    const format = utils.formatBytes32String;
    
    const ballot = await Ballot.deploy([format('oneee'),format('twooo'),format('threee')]);
    await ballot.deployed();

    console.log('deployed @',ballot.address)
}

main().catch(error =>{
    console.error(error);
    process.exitCode = 1;
})