const hre = require("hardhat");

async function main() {
  const amountIn = 10n ** 16n;  // just added
  const amountInMaximum = 10n ** 16n;   // just added

  console.log("deploying...");
  const SwapExamples = await hre.ethers.getContractFactory("SwapExamples");
  // const swapExamples = await SwapExamples.deploy(0xE592427A0AEce92De3Edee1F18E0157C05861564);
  const swapExamples = await SwapExamples.deploy();

  await swapExamples.deployed();

  console.log("SwapExamples contract deployed: ", swapExamples.address);

  await swapExamples.swapExactInputSingle(amountIn);   // just added
  // await swapExamples.swapExactInputSingle(swapExamples.amountOut, amountInMaximum);   // just added
  await swapExamples.swapExactOutputSingle(swapExamples.amountOut, amountInMaximum);   // just added


  const deployContract = await swapExamples.swapExactInputSingle(amountIn)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});