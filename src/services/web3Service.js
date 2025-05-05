import { ethers } from 'ethers';
import KanaGameJSON from '../contracts/KanaGame.json';

class Web3Service {
    constructor() {
        this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        this.gamePrice = ethers.parseEther("0.01");
        this.contractABI = KanaGameJSON.abi;
    }

    async getProvider() {
        // Wait for ethereum object to be injected
        let retries = 0;
        while (typeof window.ethereum === 'undefined' && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }

        if (typeof window.ethereum === 'undefined') {
            throw new Error("Please install MetaMask!");
        }

        return new ethers.BrowserProvider(window.ethereum);
    }

    async getContract() {
        const provider = await this.getProvider();
        const signer = await provider.getSigner();
        return new ethers.Contract(this.contractAddress, this.contractABI, signer);
    }

    async startGame(gameType) {
        try {
            const contract = await this.getContract();
            
            // gameType should be 0 for HIRAGANA, 1 for KATAKANA
            const tx = await contract.startGame(gameType, {
                value: this.gamePrice
            });

            // Wait for transaction to be mined
            await tx.wait();
            
            return true;
        } catch (error) {
            console.error("Error starting game:", error);
            throw error;
        }
    }

    async getContractBalance() {
        try {
            const contract = await this.getContract();
            const balance = await contract.getBalance();
            return ethers.formatEther(balance);
        } catch (error) {
            console.error("Error getting contract balance:", error);
            throw error;
        }
    }
}

export const web3Service = new Web3Service(); 