const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");
var chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale", async function(accounts) {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    it("there shouldnt be any coins in my account", async () => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf.call(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should in the tokensale smart contract", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf.call(TokenSale.address);
        let totalSupply = await instance.totalSupply();
    
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it('should be possible to buy tokens', async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let kycInstance = await KycContract.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(initialHolder);
        await kycInstance.setKycCompleted(recipient, {from: initialHolder});

        await expect(tokenSaleInstance.sendTransaction( {from: recipient, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled;
        return expect(tokenInstance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceBeforeAccount);
    })
});