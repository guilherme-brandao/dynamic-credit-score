require("dotenv").config()

module.exports = async function (hre) {
    const { getNamedAccounts, deployments } = hre
    const { deployer } = await getNamedAccounts()
    const { deploy } = deployments

    args = []

    const dynamicScoreNFT = await deploy("DynamicScore", {
        from: deployer,
        args: args, 
        logs: true,
    })

    console.log(dynamicScoreNFT.address)
}
