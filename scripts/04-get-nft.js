require("hardhat")

async function main() {
    const DynamicScore = await ethers.getContractAt("DynamicScore", process.env.DEPLOYED_NFT_ADDRESS)
    const userOverview = await DynamicScore.getUser(0)

    console.log("user overview:", userOverview)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
