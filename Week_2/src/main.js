import { ethers } from "ethers";
import ContractArtifact from "../out/Ledger.sol/Ledger.json";

const themeSwitchButton = document.getElementById('theme-switch');
const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');
const connectWalletButton = document.getElementById('connect-wallet');
const htmlTag = document.documentElement;
const depositButton = document.getElementById('deposit-button');
const inputAmount = document.getElementById('input-amount');
const balanceDisplay = document.getElementById('balance-display');

themeSwitchButton.addEventListener('click', () => {

    htmlTag.classList.toggle('dark');

    moonIcon.classList.toggle('hidden');
    sunIcon.classList.toggle('hidden');
});

let signer = null;
let provider;
let contract;

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const contractAbi = ContractArtifact.abi;

connectWalletButton.addEventListener('click', async () => {

    if (window.ethereum == null) {
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
      
    updateWalletButton(true);
    contract = new ethers.Contract(contractAddress, contractAbi, signer);
    await updateBalanceDisplay();
});

function updateWalletButton(connected) {
    if (connected == true) {
        connectWalletButton.textContent = "Connected!";
    } else {
        connectWalletButton.textContent = "Connect Wallet";
    }
}

window.ethereum.on("accountsChanged", (accounts) => {
  if (accounts.length === 0) {
    updateWalletButton(false);
  } else {
    updateWalletButton(true);
  }
});

depositButton.addEventListener('click', async () => {

  if (signer == null) {
        alert("Please connect your wallet first.");
        return;
    }
  const amountInRupees = BigInt(inputAmount.value);

  if(amountInRupees === '') {
        alert("Please enter some amount to deposit.");
        return;
    }
    if(amountInRupees < 0) {
        alert("Please enter a non-negative amount.");
        return;
    }
    try {
        const tx = await contract.deposit(amountInRupees);
        await tx.wait();
        alert("Deposit successful!");
        await updateBalanceDisplay();

    } catch (error) {
        console.error("Error during deposit:", error);
        alert("Deposit failed. See console for details.");
    }
});

async function updateBalanceDisplay() {
    if (signer == null) {
        balanceDisplay.textContent = "$0.00";
        return;
    }
    const currentBalance = await contract.getBalance();
    balanceDisplay.textContent = `$${currentBalance}`;
}
