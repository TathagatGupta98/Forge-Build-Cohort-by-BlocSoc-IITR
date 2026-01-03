import './style.css';
import { ethers } from "ethers";
import ContractArtifact from '/home/tathagat/Forge-Build-Cohort-by-BlocSoc-IITR/out/SimpleStorage.sol/SimpleStorage.json';

const htmlTag = document.documentElement;
const themeSwitchButton = document.getElementById('theme-switch');
const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');
const connectWalletButton = document.getElementById('connect-wallet');
const inputNumber = document.getElementById('storage-input');
const storeButton = document.getElementById('store-button');
const retrieveButton = document.getElementById('retrieve-button');
const displayPlace = document.getElementById('display');

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
let contract;

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
console.log("Address:", contractAddress); 
const contractABI = ContractArtifact.abi;

connectWalletButton.addEventListener('click', async () => {

    if (window.ethereum == null) {
     console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()

    } else {    
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
    }
    connectWalletButton.textContent = "Connected!";
    contract = new ethers.Contract(contractAddress, contractABI, signer);

});

storeButton.addEventListener('click', async () => {
    if (signer == null) {
        alert("Please connect your wallet first.");
        return;
    }
    const numberToStore = inputNumber.value;

    if(numberToStore === '') {
        alert("Please enter a number to store.");
        return;
    }
    if(numberToStore < 0) {
        alert("Please enter a non-negative number.");
        return;
    }
    try{
        const store = await contract.set(numberToStore);
        await store.wait();
        alert(`Number ${numberToStore} stored successfully!`);
    }
    catch(error){
        console.error("Error storing number:", error);
        alert("Failed: See console for details.");
    }
})

retrieveButton.addEventListener('click', async () => {
    if (signer == null) {
        alert("Please connect your wallet first.");
        return;
    }
    try{
        const retrievedNumber = await contract.get();
        displayPlace.textContent = retrievedNumber;
        alert(`Number retrieved successfully!`);
    }
    catch(error){
        console.error("Error retrieving number:", error);
        alert("Failed: See console for details.");
    }
})