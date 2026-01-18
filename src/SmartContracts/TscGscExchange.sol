//SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.30;

import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract TscGscExchange is ReentrancyGuard, Ownable {
    
    uint256 public tscReserve;
    uint256 public gscReserve;

    address public constant TSC_TOKEN_ADDRESS = 0x14316A96B35817CA74f772153C61Ba7e71119AA9;
    address public constant GSC_TOKEN_ADDRESS = 0xA220B7aBe686D7b3FbcAE4CE5105B715EAD14Cc6;

    IERC20 tscToken = IERC20(TSC_TOKEN_ADDRESS);
    IERC20 gscToken = IERC20(GSC_TOKEN_ADDRESS); 

    constructor() Ownable(msg.sender) {}

    function intializingLiquidityPool(uint256 amountOfTsc, uint256 amountOfGsc) external onlyOwner { 

        bool successForTsc = tscToken.transferFrom(msg.sender, address(this), amountOfTsc);
        require(successForTsc, "Tsc Transfer failed");
        bool successforGsc = gscToken.transferFrom(msg.sender, address(this), amountOfGsc);
        require(successforGsc, "Gsc Transfer failed");

        tscReserve += amountOfTsc;
        gscReserve += amountOfGsc;
    }

    function swapTscForGsc(uint256 amountIn) public {
        require(amountIn > 0, "Not Enough Tsc given");

        uint256 reserveIn = tscReserve;
        uint256 reserveOut = gscReserve;

        uint256 productOfReserves = reserveIn * reserveOut;
        uint256 newReserveIn = reserveIn + amountIn;
        uint256 newReserveOut = productOfReserves / newReserveIn; 
        uint256 amountOut = reserveOut - newReserveOut;
        
        require(amountOut < reserveOut, "Insufficient liquidity");

        bool successForTsc = tscToken.transferFrom(msg.sender, address(this), amountIn);
        require(successForTsc, "Tsc Transfer failed");

        tscReserve += amountIn;
        gscReserve -= amountOut;

        bool successForGsc = gscToken.transfer(msg.sender, amountOut);
        require(successForGsc, "Gsc Transfer Failed");
    }

    function swapGscForTsc(uint256 amountIn) public {
        require(amountIn > 0, "Not Enough Gsc given");

        uint256 reserveIn = gscReserve;
        uint256 reserveOut = tscReserve;

        uint256 productOfReserves = reserveIn * reserveOut;
        uint256 newReserveIn = reserveIn + amountIn;
        uint256 newReserveOut = productOfReserves / newReserveIn; 
        uint256 amountOut = reserveOut - newReserveOut;
        
        require(amountOut < reserveOut, "Insufficient liquidity");


        bool successForGsc = gscToken.transferFrom(msg.sender, address(this), amountIn);
        require(successForGsc, "Gsc Transfer failed");

        tscReserve -= amountOut;
        gscReserve += amountIn;

        bool successForTsc = tscToken.transfer(msg.sender, amountOut);
        require(successForTsc, "Tsc Transfer Failed");
    }
}