import {loadFixture} from "@nomicfoundation/hardhat-network-helpers"
import {expect} from "chai"
import {ethers} from "hardhat"
import {utils} from "ethers"

const formatByte = utils.formatBytes32String;
const parseByte = utils.parseBytes32String;
describe("ballot",function(){
    async function deployBeforeIt() {
        const [account0,account1,account2,account3,account4] = await ethers.getSigners()
        const Ballot = await ethers.getContractFactory("Ballot")
        const ballot0 = await Ballot.deploy([
            formatByte('oneee'),
            formatByte('twooo'),
            formatByte('threee')]);
            ballot0.giveRightToVote(account1.address)
            ballot0.giveRightToVote(account2.address)
            ballot0.giveRightToVote(account3.address)
        const ballot1 = await ballot0.connect(account1);
        const ballot2 = await ballot0.connect(account2)
        const ballot3 = await ballot0.connect(account3)
        const ballot4 = await ballot0.connect(account4) 

        return {
            account0,account1,account2,account3,account4,
            ballot0,ballot1,ballot2,ballot3,ballot4
        }
        
    }

    it("Should ballot test1",async function (){
        const {ballot0,ballot1,ballot2,ballot3,ballot4} = await loadFixture(deployBeforeIt)
        await ballot0.vote(1);
        expect(await ballot0.winningProposal()).to.be.equal(1)
        expect(await ballot0.winnerName()).to.be.equal(formatByte('twooo'))
    })

    it("Should ballot test2",async function (){
        const {account0,account1,account2,account3,account4,ballot0,ballot1,ballot2,ballot3,ballot4} = await loadFixture(deployBeforeIt)
        await ballot0.vote(1);
        await ballot1.delegate(account2.address);
        await ballot2.vote(2);
        await ballot3.delegate(account2.address);
        //expect(await ballot4.winningProposal()).to.be.equal(2)
        expect(await ballot0.winnerName()).to.be.equal(formatByte('threee'))
    })
    it("Should ballot test3",async function (){
        const {account0,account1,account2,account3,account4,ballot0,ballot1,ballot2,ballot3,ballot4} = await loadFixture(deployBeforeIt)
        await ballot2.vote(1)
        await expect(ballot2.vote(1)).to.revertedWith("Already voted...")
    })
    it("Should ballot test3",async function (){
        const {account0,account1,account2,account3,account4,ballot0,ballot1,ballot2,ballot3,ballot4} = await loadFixture(deployBeforeIt)
        await expect(ballot4.vote(2)).to.be.revertedWith("not allowed");
        
    })
})