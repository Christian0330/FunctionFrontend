import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance);
    }
  };

  const deposit = async () => {
    if (atm) {
      let amount = ethers.utils.parseEther(depositAmount.toString());
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let amount = ethers.utils.parseEther(withdrawAmount.toString());
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button className="button" onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="account-section">
        <p><strong>Your Account:</strong> {account}</p>
        <p><strong>Your Balance:</strong> {balance && ethers.utils.formatEther(balance)} ETH</p>

        <div className="action-section">
          <div className="input-group">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter deposit amount"
              className="input"
            />
            <button className="button" onClick={deposit}>Deposit</button>
          </div>

          <div className="input-group">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter withdraw amount"
              className="input"
            />
            <button className="button" onClick={withdraw}>Withdraw</button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Mini ATM!</h1>
      </header>
      {initUser()}
      <footer>
        <p>&copy; 2024 Metacrafters. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .container {
          text-align: center;
          background-color: #FFDAB9;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
        }
        header {
          margin-bottom: 20px;
        }
        .account-section {
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          width: 300px;
        }
        .action-section {
          margin-top: 20px;
        }
        .input-group {
          margin-bottom: 15px;
        }
        .input {
          width: 70%;
          padding: 8px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .button {
          padding: 8px 12px;
          background-color: #FF7F50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .button:hover {
          background-color: #FF4500;
        }
        footer {
          margin-top: 20px;
          font-size: 0.8rem;
        }
      `}</style>
    </main>
  );
}
