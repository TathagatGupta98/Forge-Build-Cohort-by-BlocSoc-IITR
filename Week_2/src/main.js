import { ethers } from "ethers";

const themeSwitchButton = document.getElementById('theme-switch');
const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');
const connectWalletButton = document.getElementById('connect-wallet');
const htmlTag = document.documentElement;

themeSwitchButton.addEventListener('click', () => {

    htmlTag.classList.toggle('dark');

    moonIcon.classList.toggle('hidden');
    sunIcon.classList.toggle('hidden');
});

let signer = null;
let provider;

connectWalletButton.addEventListener('click', async () => {

    if (window.ethereum == null) {
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
    }
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
      
    updateWalletButton(true);
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
