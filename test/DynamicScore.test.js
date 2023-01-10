const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("DynamicScore", () => {
  let contract;
  let mainAddress;
  let accounts = []

  beforeEach(async () => {

    accounts = await ethers.getSigners();

    mainAddress = accounts[0].address

    const DynamicScore = await ethers.getContractFactory("DynamicScore");

    contract = await DynamicScore.deploy();
  });

  describe("updateUserNFT", () => {
    it("should update the metadata for the specified NFT", async () => {
      await contract.createUserNFT();
      
      const tokenId = parseInt(await contract.userIndex(mainAddress))
      const score = 100;
      const enthusiast = true;
      const blueship = false;

      await contract.updateUserNFT(mainAddress, score, enthusiast, blueship);

      const user = await contract.getUser(tokenId);
      expect(user.score).to.equal(score);
      expect(user.enthusiast).to.equal(enthusiast);
      expect(user.blueship).to.equal(blueship);
    });

    it("should emit the MetadataUpdated event", async () => {
      await contract.createUserNFT();

      const score = 100;
      const enthusiast = true;
      const blueship = false;

      const result = await contract.updateUserNFT(
        mainAddress,
        score,
        enthusiast,
        blueship
      );
      const receipt =  await result.wait()

      expect(receipt.logs.length).to.equal(1);
    });

    it("should revert if the caller is not the owner of the NFT", async () => {
      await contract.createUserNFT();

      const score = 100;
      const enthusiast = true;
      const blueship = false;

      await expect(
        contract.connect(accounts[1]).updateUserNFT(mainAddress, score, enthusiast, blueship)
      ).to.be.revertedWith("Sender is not the owner of this NFT");
    });
  });

  describe("createUserNFT", () => {
    it("should create a new NFT and assign ownership to the caller", async () => {
      await contract.createUserNFT();

      const tokenId = await contract.userIndex(accounts[0].address);
      const owner = await contract.ownerOf(tokenId);

      expect(owner).to.equal(accounts[0].address);
    });

    it("should emit the NftReturned event", async () => {
      const result = await contract.createUserNFT();

      const receipt =  await result.wait()

      expect(receipt.events[1].event).to.equal("NftReturned");
    });

    it.only("should revert if the user already has an NFT", async () => {
        await contract.connect(accounts[3]).createUserNFT({from: accounts[3].address});
        await contract.createUserNFT();
  
        await expect(contract.createUserNFT()).to.be.revertedWith("User already has an NFT");
      });
    });
  
    describe("userIndex", () => {
      it("should update the mapping when the metadata for an NFT is updated", async () => {
        await contract.createUserNFT();
  
        const tokenId = await contract.userIndex(accounts[0].address);
        const score = 100;
        const enthusiast = true;
        const blueship = false;
  
        await contract.updateUserNFT(tokenId, score, enthusiast, blueship);
  
        const updatedTokenId = await contract.userIndex(accounts[0].address);
        expect(updatedTokenId).to.equal(tokenId);
      });
  
      it("should be correct for users with multiple NFTs", async () => {
        await contract.createUserNFT();
        await contract.createUserNFT();
  
        const firstTokenId = await contract.userIndex(accounts[0].address);
        const secondTokenId = await contract.userIndex(accounts[0].address);
  
        expect(firstTokenId).to.not.equal(secondTokenId);
      });
    });
  
    describe("ownerOf", () => {
  it("should return the correct owner for a given NFT", async () => {
        await contract.createUserNFT();
  
        const tokenId = await contract.userIndex(accounts[0].address);
        const owner = await contract.ownerOf(tokenId);
  
        expect(owner).to.equal(accounts[0]);
      });
  
      it("should return the correct owner for multiple NFTs owned by different users", async () => {
        await contract.createUserNFT();
        await contract.createUserNFT({ from: accounts[1] });
  
        const firstTokenId = await contract.userIndex(accounts[0].address);
        const secondTokenId = await contract.userIndex(accounts[1].address);
  
        expect(await contract.ownerOf(firstTokenId)).to.equal(accounts[0]);
        expect(await contract.ownerOf(secondTokenId)).to.equal(accounts[1]);
      });
    });
  
    describe("balanceOf", () => {
      it("should return the correct balance for a given user", async () => {
        await contract.createUserNFT();
  
        const balance = await contract.balanceOf(accounts[0]);
        expect(balance.toNumber()).to.equal(1);
      });
  
      it("should return the correct balance for multiple users with different NFT balances", async () => {
        await contract.createUserNFT();
        await contract.createUserNFT({ from: accounts[1] });
        await contract.createUserNFT({ from: accounts[1] });
  
        expect(await contract.balanceOf(accounts[0])).to.be.bignumber.equal("1");
        expect(await contract.balanceOf(accounts[1])).to.be.bignumber.equal("2");
      });
    });
  });
  
  
  
  