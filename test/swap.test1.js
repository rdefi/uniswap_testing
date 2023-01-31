const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAI = "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60";    // Goerli
const WETH9 = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";  // Goerli
const USDC = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";   // Goerli

// let swapExamples; 
let accounts;   
let weth;    
let dai;   
let swapExamplesFactory;

describe("SwapExamples", () => {
    // let swapExamples;
    // let accounts;
    // let weth;
    // let dai;
    
    // before(async () => {  
    beforeEach(async () => {  
        accounts = await ethers.getSigners();

        weth = await ethers.getContractAt("IWETH", WETH9);
        dai = await ethers.getContractAt("IERC20", DAI);
        const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
        const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
        await swapExamplesFactory.deployed(accounts);  // checks out
    })

    it("swapExactInputSingle", async function () {
        // const swapConst = console.log(swapExamples.address)
        const amountIn = 10n ** 18n;

        // I duplicated the next three lines from the before section. This is the only way the ".address" works below
        const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); // checks out
        const swapExamplesFactory = await SwapExamplesFactory.deploy();  // checks out
        await swapExamplesFactory.deployed(accounts);  // checks out

        await weth.connect(accounts[0]).deposit({ value: amountIn });
        await weth.connect(accounts[0]).approve(swapExamplesFactory.address, amountIn);

        // PROBLEM: Error Transaction reverted: function call to a non-contract amount
        // error references the following in SwapExamples.sol:  amountOut = swapRouter.exactInputSingle(params);
        await swapExamplesFactory.swapExactInputSingle(amountIn);               // PROBLEM

        console.log("DAI balance", await dai.balanceOf(accounts[0].address));   // PROBLEM
    });

    it("swapExactOutputSingle", async function () {
        const wethAmountInMax = 10n ** 18n;
        const daiAmountOut = 100n * 10n ** 18n;

        // I duplicated the next three lines from the before section. This is the only way the ".address" works below
        const SwapExamplesFactory = await ethers.getContractFactory("SwapExamples"); 
        const swapExamplesFactory = await SwapExamplesFactory.deploy(); 
        await swapExamplesFactory.deployed(accounts); 

        await weth.connect(accounts[0]).deposit({ value: wethAmountInMax });

        // PROBLEM: The line below only works when I put SwapExamplesFactory above within this "it".
        // When I only put const SwapExamplesFactory code in the before section and not here, it does not work 
        await weth.connect(accounts[0]).approve(swapExamplesFactory.address, wethAmountInMax); // PROBLEM

        // PROBLEM: Error Transaction reverted: function call to a non-contract amount
        // error references the following in SwapExamples.sol:  amountIn = swapRouter.exactOutputSingle(params);
        await swapExamplesFactory.swapExactOutputSingle(daiAmountOut, wethAmountInMax);     // PROBLEM
        console.log("DAI balance", await dai.balanceOf(accounts[0].address));               // PROBLEM
    });
});   

