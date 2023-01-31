// SPDX-License-Identifier: GPL-2.0-or-later
// pragma solidity >=0.7.6 <=0.8.6;
pragma solidity >=0.7.6 <=0.8.6;
pragma abicoder v2;
import "hardhat/console.sol";
// import "web3";
// import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol
// always need to eliminate "/blob/master" from the url
// import "@openzeppelin/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
///////////////////////////////////////
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract SwapExamples {
    // It should be noted that for the sake of these examples, we purposefully pass in the swap router instead of inherit the swap router for simplicity.
    // More advanced example contracts will detail how to inherit the swap router safely.
    ISwapRouter public swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    
    address public constant DAI = 0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60;
    address public constant WETH9 = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;  // FROM METAMASK verified twice (second time 1/30)
    // address public constant USDC = 0x07865c6e87b9f70255377e024ace6630c1eaa37f;  // from Circle webpage
    address public constant USDC = 0x07865c6E87B9F70255377e024ace6630C1Eaa37F;  // => took Circle address and google searched. Found this on etherscan

    ///// My additions
    // uint amountIn = 0.0;
    // address public constant msg.sender = 0xb43c53FB758b972b1B4801d4792c9d33d741322C;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    // / @notice swapExactInputSingle swaps a fixed amount of DAI for a maximum possible amount of WETH9
    // / using the DAI/WETH9 0.3% pool by calling `exactInputSingle` in the swap router.
    // / @dev The calling address must approve this contract to spend at least `amountIn` worth of its DAI for this function to succeed.
    // / @param amountIn The exact amount of DAI that will be swapped for WETH9.
    // / @return amountOut The amount of WETH9 received.
    function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {

        console.log(address(this));
        console.log("address",msg.sender);

        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);
        // TransferHelper.safeTransferFrom(WETH9, msg.sender, msg.sender, amountIn);

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: poolFee,
                recipient: msg.sender,
                // recipient: address(this),                
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    /// @notice swapExactOutputSingle swaps a minimum possible amount of DAI for a fixed amount of WETH.
    /// @dev The calling address must approve this contract to spend its DAI for this function to succeed. As the amount of input DAI is variable,
    /// the calling address will need to approve for a slightly higher amount, anticipating some variance.
    /// @param amountOut The exact amount of WETH9 to receive from the swap.
    /// @param amountInMaximum The amount of DAI we are willing to spend to receive the specified amount of WETH9.
    /// @return amountIn The amount of DAI actually spent in the swap.
    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {
        // Transfer the specified amount of DAI to this contract.
        console.log("to the address: ", msg.sender);

        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountInMaximum);
        // TransferHelper.safeTransferFrom(WETH9, msg.sender, msg.sender, amountInMaximum);

        // Approve the router to spend the specifed `amountInMaximum` of DAI.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: poolFee,
                recipient: msg.sender,
                // recipient: address(this),
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(WETH9, address(swapRouter), 0);
            TransferHelper.safeTransfer(WETH9, msg.sender, amountInMaximum - amountIn);
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


// interface IERC20 {
//     function balanceOf(address account) external view returns (uint256);

//     function transfer(address recipient, uint256 amount)
//         external
//         returns (bool);

//     function approve(address spender, uint256 amount) external returns (bool);
// }

// contract SingleSwap {
//     address public constant routerAddress =
//         0xE592427A0AEce92De3Edee1F18E0157C05861564;
//     ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

//     address public constant LINK = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
//     address public constant WETH = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;

//     IERC20 public linkToken = IERC20(LINK);

//     // For this example, we will set the pool fee to 0.3%.
//     uint24 public constant poolFee = 3000;

//     constructor() {}

//     function swapExactInputSingle(uint256 amountIn)
//         external
//         returns (uint256 amountOut)
//     {
//         linkToken.approve(address(swapRouter), amountIn);

//         ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
//             .ExactInputSingleParams({
//                 tokenIn: LINK,
//                 tokenOut: WETH,
//                 fee: poolFee,
//                 recipient: address(this),
//                 deadline: block.timestamp,
//                 amountIn: amountIn,
//                 amountOutMinimum: 0,
//                 sqrtPriceLimitX96: 0
//             });

//         amountOut = swapRouter.exactInputSingle(params);
//     }

//     function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum)
//         external
//         returns (uint256 amountIn)
//     {
//         linkToken.approve(address(swapRouter), amountInMaximum);

//         ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
//             .ExactOutputSingleParams({
//                 tokenIn: LINK,
//                 tokenOut: WETH,
//                 fee: poolFee,
//                 recipient: address(this),
//                 deadline: block.timestamp,
//                 amountOut: amountOut,
//                 amountInMaximum: amountInMaximum,
//                 sqrtPriceLimitX96: 0
//             });

//         amountIn = swapRouter.exactOutputSingle(params);

//         if (amountIn < amountInMaximum) {
//             linkToken.approve(address(swapRouter), 0);
//             linkToken.transfer(address(this), amountInMaximum - amountIn);
//         }
//     }
// }




/////// OLD CODE WETH to DAI ///////

// contract SwapExamples {
//     // For the scope of these swap examples,
//     // we will detail the design considerations when using
//     // `exactInput`, `exactInputSingle`, `exactOutput`, and  `exactOutputSingle`.

//     // It should be noted that for the sake of these examples, we purposefully pass in the swap router instead of inherit the swap router for simplicity.
//     // More advanced example contracts will detail how to inherit the swap router safely.
//     ISwapRouter public swapRouter =
//         ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    
//     // This example swaps DAI/WETH9 for single path swaps and DAI/USDC/WETH9 for multi path swaps.

//     // address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
//     // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
//     // address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

//     // new tries:
//     // address public constant DAI = 0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844; 
    
//     address public constant DAI = 0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60;
//     address public constant WETH9 = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;  // FROM METAMASK verified twice (second time 1/30)
//     address public constant USDC = 0x07865c6e87b9f70255377e024ace6630c1eaa37f;
//     // address public constant WETH9 = 0x7af963cF6D228E564e2A0aA0DdBF06210B38615D;

//     ///// My additions
//     // uint amountIn = 0.0;
//     // address public constant msg.sender = 0xb43c53FB758b972b1B4801d4792c9d33d741322C;

//     // For this example, we will set the pool fee to 0.3%.
//     uint24 public constant poolFee = 3000;

//     // constructor(ISwapRouter _swapRouter) {
//     //     swapRouter = _swapRouter;
//     // }

//     /// @notice swapExactInputSingle swaps a fixed amount of DAI for a maximum possible amount of WETH9
//     /// using the DAI/WETH9 0.3% pool by calling `exactInputSingle` in the swap router.
//     /// @dev The calling address must approve this contract to spend at least `amountIn` worth of its DAI for this function to succeed.
//     /// @param amountIn The exact amount of DAI that will be swapped for WETH9.
//     /// @return amountOut The amount of WETH9 received.
//     function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {
//         // msg.sender must approve this contract
//         // console.log("Amount In: ");     // ADDED FROM STACKOVERFLOW ADVICE
//         // console.log(amountIn); 
//         console.log(address(this));
//         console.log("address",msg.sender);


//         // testNum = amountIn * 2;

//         // Transfer the specified amount of DAI to this contract.
//         TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);
//         // TransferHelper.safeTransferFrom(WETH9, msg.sender, msg.sender, amountIn);

//         // Approve the router to spend DAI.
//         TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);

//         // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
//         // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
//         ISwapRouter.ExactInputSingleParams memory params =
//             ISwapRouter.ExactInputSingleParams({
//                 tokenIn: WETH9,
//                 tokenOut: DAI,
//                 fee: poolFee,
//                 recipient: msg.sender,
//                 // recipient: address(this),                
//                 deadline: block.timestamp,
//                 amountIn: amountIn,
//                 amountOutMinimum: 0,
//                 sqrtPriceLimitX96: 0
//             });

//         // The call to `exactInputSingle` executes the swap.
//         amountOut = swapRouter.exactInputSingle(params);
//     }

//     /// @notice swapExactOutputSingle swaps a minimum possible amount of DAI for a fixed amount of WETH.
//     /// @dev The calling address must approve this contract to spend its DAI for this function to succeed. As the amount of input DAI is variable,
//     /// the calling address will need to approve for a slightly higher amount, anticipating some variance.
//     /// @param amountOut The exact amount of WETH9 to receive from the swap.
//     /// @param amountInMaximum The amount of DAI we are willing to spend to receive the specified amount of WETH9.
//     /// @return amountIn The amount of DAI actually spent in the swap.
//     function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {
//         // Transfer the specified amount of DAI to this contract.
//         console.log("to the address: ", msg.sender);

//         TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountInMaximum);
//         // TransferHelper.safeTransferFrom(WETH9, msg.sender, msg.sender, amountInMaximum);

//         // Approve the router to spend the specifed `amountInMaximum` of DAI.
//         // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
//         TransferHelper.safeApprove(WETH9, address(swapRouter), amountInMaximum);

//         ISwapRouter.ExactOutputSingleParams memory params =
//             ISwapRouter.ExactOutputSingleParams({
//                 tokenIn: WETH9,
//                 tokenOut: DAI,
//                 fee: poolFee,
//                 recipient: msg.sender,
//                 // recipient: address(this),
//                 deadline: block.timestamp,
//                 amountOut: amountOut,
//                 amountInMaximum: amountInMaximum,
//                 sqrtPriceLimitX96: 0
//             });

//         // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
//         amountIn = swapRouter.exactOutputSingle(params);

//         // For exact output swaps, the amountInMaximum may not have all been spent.
//         // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
//         if (amountIn < amountInMaximum) {
//             TransferHelper.safeApprove(WETH9, address(swapRouter), 0);
//             TransferHelper.safeTransfer(WETH9, msg.sender, amountInMaximum - amountIn);
//         }
//     }
// }