import './style.css';
import { ethers } from "ethers";

const htmlTag = document.documentElement;
const themeSwitchButton = document.getElementById('theme-switch');
const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');
const connectWalletButton = document.getElementById('connect-wallet');

sunIcon.style.display = 'none';

themeSwitchButton.addEventListener('click', () => {
    htmlTag.classList.toggle('dark');
    
    if (sunIcon.style.display === 'none') {
        sunIcon.style.display = '';
        moonIcon.style.display = 'none';
    }
    else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = '';
    }
});

let signer = null;
let provider;

connectWalletButton.addEventListener('click', async () => {

    if (window.ethereum == null) {
     console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()

    } else {    
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
    }
    connectWalletButton.textContent = "Connected!";
});

