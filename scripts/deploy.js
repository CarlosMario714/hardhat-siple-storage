//imports
const { ethers, run, network } = require("hardhat")

//async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`deployed contract to: ${simpleStorage.address}`)
    // what happens when deploy to our hardhat network?
    //console.log(network.config)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for block txes...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    //interactuar con el contrato

    const currentValue = await simpleStorage.retrieve()
    console.log(`current value is: ${currentValue}`)

    //actualizar current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updateValue = await simpleStorage.retrieve()
    console.log(`update value is: ${updateValue}`)
}

async function verify(contractAdress, args) {
    console.log("verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAdress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified")
        } else {
            console.log(e)
        }
    }
}

//main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

//0x0abB89fF0a1571756489B25D1a30C2a9bF9392Dd
