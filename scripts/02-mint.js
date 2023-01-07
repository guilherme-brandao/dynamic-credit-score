require("hardhat")

async function main() {
    const DynamicScore = await ethers.getContractAt("DynamicScore", process.env.DEPLOYED_NFT_ADDRESS)
    const mintTx = await DynamicScore.createUserNFT()
    await mintTx.wait(1)

    console.log("minted nft: ", mintTx)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
