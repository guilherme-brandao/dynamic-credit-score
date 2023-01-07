require("hardhat");

async function main() {
    const DynamicScore = await ethers.getContractFactory("DynamicScore")
    const dynamicScore = await DynamicScore.deploy()

    await dynamicScore.deployed();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
