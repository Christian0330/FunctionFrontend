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
      alert("Please install MetaMask to connect to the ATM.");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, get reference to our deployed contract
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
      alert(`Successfully deposited ${depositAmount} ETH!`);
    }
  };

  const withdraw = async () => {
    if (atm) {
      let amount = ethers.utils.parseEther(withdrawAmount.toString());
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
      alert(`Successfully withdrew ${withdrawAmount} ETH!`);
    }
  };

  const initUser = () => {
    // Check if the user has MetaMask
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM service.</p>;
    }

    // Check if the user is connected
    if (!account) {
      return <button className="btn-connect" onClick={connectAccount}>Connect to MetaMask</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="user-info">
        <p><strong>Connected Wallet:</strong> {account}</p>

        {/* Highlight the balance section */}
        <div className="balance-container">
          <p className="bold-balance">
            <strong>Your Current Balance:</strong> {balance && ethers.utils.formatEther(balance)} ETH
          </p>
        </div>

        {/* Deposit section */}
        <div className="input-section">
          <input
            className="input-field"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter deposit amount"
          />
          <button className="btn-action" onClick={deposit}><strong>Deposit Funds</strong></button>
        </div>

        {/* Withdraw section */}
        <div className="input-section">
          <input
            className="input-field"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter withdraw amount"
          />
          <button className="btn-action" onClick={withdraw}><strong>Withdraw Funds</strong></button>
        </div>

        {/* Optionally, add a logout or disconnect button */}
        <button className="btn-disconnect" onClick={() => setAccount(undefined)}>Disconnect</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM</h1>
        <p>Manage your Ethereum balance directly from your wallet.</p>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: 'Arial', sans-serif;
          background-color: #ffccbc; /* Peach Background */
          min-height: 100vh;
          padding: 20px;
        }

        h1 {
          font-size: 3rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        p {
          font-size: 1.2rem;
          color: #34495e;
          margin-bottom: 20px;
        }

        .user-info {
          margin-top: 20px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
        }

        .balance-container {
          background-color: #ecf0f1; /* Light grey highlight */
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 25px;
        }

        .bold-balance {
          font-size: 1.7rem;
          font-weight: bold;
          color: #e74c3c; /* Red for emphasis */
        }

        .input-section {
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
        }

        .input-field:focus {
          border-color: #3498db;
          outline: none;
        }

        .btn-action {
          width: 100%;
          padding: 12px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-action:hover {
          background-color: #2980b9;
        }

        .btn-connect {
          padding: 12px;
          background-color: #2ecc71;
          color: white;
          font-size: 1.2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-connect:hover {
          background-color: #27ae60;
        }

        .btn-disconnect {
          padding: 12px;
          background-color: #e74c3c;
          color: white;
          font-size: 1.2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 15px;
        }

        .btn-disconnect:hover {
          background-color: #c0392b;
        }

        .footer {
          margin-top: 40px;
          color: #888;
          font-size: 0.9rem;
        }

        .footer a {
          color: #3498db;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
