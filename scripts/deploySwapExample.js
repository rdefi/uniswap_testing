const hre = require("hardhat");

async function main() {
  const amountIn = 10n ** 16n;  
  const amountInMaximum = 10n ** 16n;   

  console.log("deploying...");
  const SwapExamplesFactory = await hre.ethers.getContractFactory("SwapExamples");

  const swapExamplesFactory = await SwapExamplesFactory.deploy();

  await swapExamplesFactory.deployed();

  console.log("SwapExamples contract deployed: ", swapExamplesFactory.address);

  await swapExamplesFactory.swapExactInputSingle(amountIn);   

  await swapExamplesFactory.swapExactOutputSingle(swapExamplesFactory.amountOut, amountInMaximum);   

  const deployContract = await swapExamplesFactory.swapExactInputSingle(amountIn)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// When I run this code, the error I get is "invalid BigNumber value"
