import {loadFixture} from "@nomicfoundation/hardhat-network-helpers"
import {expect} from "chai"
import {ethers} from "hardhat"
import {utils} from "ethers"

describe("payable test",function(){
    async function deployPayable(){
        const [account0,account1,account2] = await ethers.getSigners();
        const Payable =await  ethers.getContractFactory("Payable");
        const payable = await Payable.deploy({value:utils.parseEther('10')});
        await payable.deployed();
        console.log("Payable contract has been deployed..");

        return {payable,account0,account1,account2}
    }

    it("should test1",async ()=>{
        const {payable,account0,account1,account2} = await loadFixture(deployPayable);
        const payable1 = await payable.connect(account1);
        await payable1.deposit({value:utils.parseEther('18')});
        expect(await ethers.provider.getBalance(payable.address)).to.be.equal(utils.parseEther('28'))
        await payable1.transfer(account2.address,utils.parseEther('11.3'));
        await payable1.transfer2(account2.address,utils.parseEther('1'));
        await payable1.transfer3(account2.address,utils.parseEther('2'));
        //此次花费的gas 来自account1
        expect(await ethers.provider.getBalance(payable.address)).to.be.equal(utils.parseEther('13.7'))
        console.log('!!!!',await ethers.provider.getBalance(account2.address))
    })
})

//对小数的处理 :TODO
//计算gas用量
/**
 * 
 * utils.parseEther('1.08')
 * utils.formatEther("12340000000")
 * utils.parseUnits("1.234",5) = 123400
 * utils.formatUnits("1234000",6) = 1.234
 * ethers.utils.commify('1235554') = 1,234,54
*/
