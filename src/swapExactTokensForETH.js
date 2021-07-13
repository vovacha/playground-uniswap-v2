const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');
const configs = require('./configs');

const uniswapV2ExchangeAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const usdtAddress = '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'; // USDT

const chainId = ChainId.RINKEBY;
const weth = WETH[chainId];

const provider = new ethers.providers.WebSocketProvider(configs.nodeUrl);

const signer = new ethers.Wallet(configs.privateKey);
const account = signer.connect(provider);

const usdtContract = new ethers.Contract(
    usdtAddress,
    ['function balanceOf(address _owner) external view returns (uint256)',
        'function decimals() external view returns (uint8)'],
    account
  );

const swap = async (amount) => {
    const usdt = await Fetcher.fetchTokenData(chainId, usdtAddress, provider, "USDT", "Usdt Stablecoin");
    const pair = await Fetcher.fetchPairData(usdt, weth, provider);

    const route = new Route([pair], usdt);

    const trade = new Trade(route, new TokenAmount(usdt, amount), TradeType.EXACT_INPUT);
    console.log("Execution price: $" + trade.executionPrice.toSignificant(6));
    console.log("Price impact: " + trade.priceImpact.toSignificant(6) + " %"); // > 0.3%

    const slippageTolerance = new Percent('50', '10000'); // 0.5 %
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();

    const path = [usdt.address, weth.address];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const inputAmount = trade.inputAmount.raw;
    const inputAmountHex = ethers.BigNumber.from(inputAmount.toString()).toHexString();

    let balance = await usdtContract.balanceOf(account.address);
    const decimals = await usdtContract.decimals();
    console.log("Initial balance: " + ethers.utils.formatUnits(balance.toString(), decimals));

    const uniswap = new ethers.Contract(
        uniswapV2ExchangeAddress,
        ['function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)\n' +
        '  external\n' +
        '  returns (uint[] memory amounts)'],
        account
      );

    const gasPrice = await provider.getGasPrice();

    const tx = await uniswap.swapExactTokensForETH(
        inputAmountHex,
        // amountOutMinHex,
        ethers.BigNumber.from(0).toHexString(),
        path,
        account.address,
        deadline,
        {
            // value: inputAmountHex,
            gasPrice: gasPrice.toHexString(),
            gasLimit: ethers.BigNumber.from(500000).toHexString()
        }
    );

    console.log("https://rinkeby.etherscan.io/tx/" + tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction receipt");
    console.log(receipt);

    balance = await usdtContract.balanceOf(account.address);
    console.log("Final balance: " + ethers.utils.formatUnits(balance.toString(), decimals));
}

swap(ethers.utils.parseEther("0.1"))
