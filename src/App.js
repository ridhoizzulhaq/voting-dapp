import React, { Component } from 'react';
import Web3 from 'web3'; // Import Web3.js
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      option1Votes: 0,
      option2Votes: 0,
      hasVoted: false,
    };

    this.web3 = null;
    this.contract = null;
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected.');
    }
  }

  async loadBlockchainData() {
    // Load the user's Ethereum account
    const accounts = await this.web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Load the smart contract
    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
    const contractAbi = [] // Replace with your contract ABI
    this.contract = new this.web3.eth.Contract(contractAbi, contractAddress);

    // Fetch data from the contract
    const option1Votes = await this.contract.methods.option1Votes().call();
    const option2Votes = await this.contract.methods.option2Votes().call();
    const hasVoted = await this.contract.methods.voters(this.state.account).call();

    this.setState({ option1Votes, option2Votes, hasVoted });
  }

  voteForOption1 = async () => {
    await this.contract.methods.voteForOption1().send({ from: this.state.account });
    this.setState({ hasVoted: true });
  }

  voteForOption2 = async () => {
    await this.contract.methods.voteForOption2().send({ from: this.state.account });
    this.setState({ hasVoted: true });
  }

  render() {
    return (
      <div className="App">
        <h1>Simple Voting dApp</h1>
        <p>Your Ethereum account: {this.state.account}</p>
        <p>Option 1 Votes: {this.state.option1Votes}</p>
        <p>Option 2 Votes: {this.state.option2Votes}</p>
        {this.state.hasVoted ? (
          <p>You have already voted.</p>
        ) : (
          <div>
            <button onClick={this.voteForOption1}>Vote for Option 1</button>
            <button onClick={this.voteForOption2}>Vote for Option 2</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
