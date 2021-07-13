# playground-uniswap-v2

The main purpose is to test Uniswap v2 API and swap some tokens.
I've used [Alchemy](http://alchemy.com/) in order to connect to the Ethereum Rinkeby testnet.

## Getting started
Generate a wallet on the Rinkeby Ethereum testnet and make sure that you have ETH on your wallet, you can get some here: https://faucet.rinkeby.io
Also Node.js and NPM required (```brew install node``` on macOS).

### Initial Configuration
After cloning the repo, create ```.env``` file with the next environment variables:
- PLAYGROUND_NODE_URL (ex.: "wss://eth-rinkeby.ws.alchemyapi.io/v2/something")
- PLAYGROUND_PRIVATE_KEY (private key string of your wallet)

### Install requirements
Install all requirements with ```npm install```
   
### Run the swap
Swap ETH for USDT:
```
❯ npm run swapExactETHForTokens

Execution price: $11.8263
Price impact: 2.10739 %
Initial balance: 141.423613
https://rinkeby.etherscan.io/tx/0x5478e9989f55ee872d127db9ac345fe0eaf0e1ce97c7af6ddaf5b852f9cad228
Transaction receipt

...

Final balance: 142.606244
```
Swap USDT for ETH - currently not working, need to investigate why (TODO):
```
❯ npm run swapExactTokensForETH        
            
Execution price: $0.000000000055002
Price impact: 100 %
Initial balance: 142.606244
https://rinkeby.etherscan.io/tx/0xb06c234fbb77404d9fd15392f6a8497fbb659b8e171692ee8ae995ebb46eb576

Error: transaction failed
```
