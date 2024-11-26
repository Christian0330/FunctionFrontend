# FunctionFrontend

A decentralized ATM built on Ethereum, enabling users to deposit and withdraw Ether (ETH) directly from their MetaMask wallets. This application connects to a deployed Ethereum contract and allows interaction with it using web3.js or ethers.js, allowing users to manage their balance with a smooth frontend interface.

## Installation

    Install the dependencies by running npm install.
    Start the local blockchain using Hardhat by running npx hardhat node.
    Open new terminal and deploy the Bank contract npx hardhat run --network localhost scripts/deploy.js.
    Start the development server by running npm run dev.

## Configure MetaMask to use the Hardhat node

    Open the MetaMask extension in your browser.
    Click on the account icon in the top right corner and select "Settings".
    In the "Networks" tab, click on "Add Network".
    Fill in the following details:
        Network Name: hardhat-test-network
        RPC URL: http://localhost:3000
        Chain ID: 31337
        Currency Symbol: GO or ETH
    Click on "Save" to add the Hardhat network to MetaMask.

    If you need detailed instructions or visual guidance, you can refer to this step-by-step guide on how to use MetaMask with a Hardhat node.


## Functionality

- **Connect to MetaMask Wallet**: Allows users to connect their MetaMask wallet to the application.
- **Deposit ETH**: Users can deposit Ether into the ATM contract using the "Deposit Funds" feature.
- **Withdraw ETH**: Users can withdraw Ether from the ATM contract using the "Withdraw Funds" feature.
- **Balance View**: Displays the current balance of the connected wallet in the contract.
  
### Features:
- Simple user interface to manage deposits and withdrawals.
- Real-time interaction with Ethereum smart contract using `ethers.js`.
- Uses MetaMask for easy Ethereum wallet integration.

## Authors
Metacrafter Chris_Narumi.

## License
This project is licensed under the MIT License. See the LICENSE.md file for details.
