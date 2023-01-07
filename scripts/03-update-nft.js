require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()

    const DynamicScore = await ethers.getContractAt("DynamicScore", process.env.DEPLOYED_NFT_ADDRESS)
    const updateTx = await DynamicScore.updateUserNFT(
        deployer,
        5,
        true,
        true)
    await updateTx.wait(1)

    console.log("updated nft tx: ", basicMintTx)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
