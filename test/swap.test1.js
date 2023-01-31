const { expect } = require("chai");
const { ethers } = require("hardhat");
// const Web3Utils = require('web3-utils');

const DAI = "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60";  // Jan 30
const WETH9 = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";  // Jan 30
const USDC = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";  // Jan 30

// let swapExamples;  // moved - Leoni
let accounts;   // moved - Leoni
let weth;    // moved - Leoni
let dai;    // moved - Leoni
// let usdc;
let swapExamplesFactory;

describe("SwapExamples", () => {
    // let swapExamples;
    // let accounts;
    // let weth;
    // let dai;
    const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
    const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
    await swapExamplesFactory.deployed(accounts);

    // before(async () => {  
    beforeEach(async () => {  
        accounts = await ethers.getSigners();

        // weth = await ethers.getContractAt("IWETH", Web3Utils.toChecksumAddress(WETH9));
        // dai = await ethers.getContractAt("IERC20", Web3Utils.toChecksumAddress(DAI));
        weth = await ethers.getContractAt("IWETH", WETH9);
        dai = await ethers.getContractAt("IERC20", DAI);
        // const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
        // const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
        // await swapExamplesFactory.deployed(accounts);  // checks out
    })
////////////////////////////////////////////////////////////////////////////////////////////////
    it("swapExactInputSingle", async function () {
        // const swapConst = console.log(swapExamples.address)
        const amountIn = 10n ** 18n;

        const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
        const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
        await swapExamplesFactory.deployed(accounts);  // checks out

        console.log("Ray testing swapExamples: ", swapExamplesFactory.address);

        await weth.connect(accounts[0]).deposit({ value: amountIn });
        // await weth.connect(accounts[0]).approve(swapExamples.address, amountIn);  // OLD
        await weth.connect(accounts[0]).approve(swapExamplesFactory.address, amountIn);
        // await weth.connect(accounts[0]).approve(swapConst, amountIn);
        // xx = await weth.connect(accounts[0]).approve(console.log(swapExamples.address), amountIn);
        // const xx = await weth.connect(accounts[0]).approve(swapExamples.address, amountIn);
        // console.log(xx);
        // console.log("input address works", await weth.connect(accounts[0]).approve(console.log(swapExamples.address), amountIn));  
        // await weth.connect(accounts[0]).approve(console.log(swapExamples.address), amountIn); // NEW - ADDED

        // await swapExamplesFactory.swapExactInputSingle(amountIn);

        // console.log("DAI balance", await dai.balanceOf(accounts[0].address));
    });

    it("swapExactOutputSingle", async function () {
        const wethAmountInMax = 10n ** 18n;
        const daiAmountOut = 100n * 10n ** 18n;

        // const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
        // const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
        // await swapExamplesFactory.deployed(accounts); 

        await weth.connect(accounts[0]).deposit({ value: wethAmountInMax });
        // await weth.connect(accounts[0]).approve(swapExamples.address, wethAmountInMax); // added
        // // await weth.connect(accounts[0]).approve(console.log(swapExamples.address), wethAmountInMax); // added

        await swapExamplesFactory.swapExactOutputSingle(daiAmountOut, wethAmountInMax);

        // console.log("DAI balance", await dai.balanceOf(accounts[0].address));
    });
});   // Do not comment this out

//////////////////////  NEW ATTEMPT USDC TO WETH9  /////////////////////////

// describe("SwapExamples", () => {

//     // before(async () => {  
//     before(async () => {   // help from Leoni
//         accounts = await ethers.getSigners();

//         weth = await ethers.getContractAt("IWETH", WETH9);
//         usdc = await ethers.getContractAt("IERC20", USDC);
//         // usdc = await ethers.getContractAt("IERC20", USDC);

//         // const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
//         // const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
//         // await swapExamplesFactory.deployed(accounts);  // checks out

//         // const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
//         // const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
//         // await swapExamplesFactory.deployed(accounts);  // checks out

//         // theAddress = console.log(swapExamplesFactory.address)

//     })
// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////
//     it("swapExactInputSingle", async function () {
//         // const swapConst = console.log(swapExamples.address)
//         const amountIn = 10n ** 18n;

//         const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
//         const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
//         await swapExamplesFactory.deployed(accounts);  // checks out

//         console.log("Ray testing swapExamples: ", swapExamplesFactory.address);
//         // weth = await ethers.getContractAt("IWETH", WETH9);


//         await weth.connect(accounts[0]).deposit({ value: amountIn });
//         // // await usdc.connect(accounts[0]).approve(swapExamples.address, amountIn);  // OLD
//         await weth.connect(accounts[0]).approve(swapExamplesFactory.address, amountIn);
//         // await usdc.connect(accounts[0]).approve(swapConst, amountIn);
//         // xx = await usdc.connect(accounts[0]).approve(console.log(swapExamples.address), amountIn);
//         // const xx = await usdc.connect(accounts[0]).approve(swapExamples.address, amountIn);
//         // console.log(xx);
//         // console.log("input address works", await usdc.connect(accounts[0]).approve(console.log(swapExamples.address), amountIn));  
//         // await usdc.connect(accounts[0]).approve(console.log(swapExamples.address), amountIn); // NEW - ADDED

//         // await swapExamplesFactory.swapExactInputSingle(amountIn);

//         // console.log("WETH balance", await weth.balanceOf(accounts[0].address));
//     });

//     // it("swapExactOutputSingle", async function () {
//     //     const usdcAmountInMax = 10n ** 18n;
//     //     const wethAmountOut = 100n * 10n ** 18n;

//     //     await usdc.connect(accounts[0]).deposit({ value: usdcAmountInMax });
//     //     // await usdc.connect(accounts[0]).approve(swapExamples.address, usdcAmountInMax); // added

//     //     // await swapExamples.swapExactOutputSingle(wethAmountOut, usdcAmountInMax);

//     //     // console.log("WETH balance", await weth.balanceOf(accounts[0].address));
//     // });
// });   // Do not comment this out!

    
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//     it("swapExactInputSingle", async function () {
//         const wethAmountInMax = 10n ** 18n;
//         // const usdcAmountInMax = 10n ** 18n;
//         const daiAmountOut = 100n * 10n ** 18n;

//         const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
//         const swapExamplesFactory = await SwapExamplesFactory.deploy(); 
//         console.log("Test - Ray print tests", swapExamplesFactory.block.timestamp);

//         // await weth.connect(accounts[0]).deposit({ value: wethAmountInMax });
//         // await weth.connect(accounts[0]).approve(console.log(swapExamples.address), wethAmountInMax); // added
//         // await swapExamples.swapExactOutputSingle(daiAmountOut, wethAmountInMax);

//         // console.log("DAI balance", await dai.balanceOf(accounts[0].address));
//     });






// const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = hre.ethers.utils.parseEther("1");

//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


