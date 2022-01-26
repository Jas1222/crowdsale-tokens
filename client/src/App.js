import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";

import "./App.css";

class App extends Component {
  state = { loading: false, kycAddress: "", tokenSaleAddress: "" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();


      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId].address,
      );
        

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId].address,
      );

        this.setState({loading: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address })
    
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.child : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  onButtonPress = async () => {
    
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]})
    alert(`KYC for: ${this.state.kycAddress} completed`)
  }

  render() {
    if (!this.state.loading) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Shuggy Coin available now!</p>
        <h2>Get your imaginary coins today! Address: </h2>
        <input text={"Text"} name={"kycAddress"} value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.onButtonPress}>Submit KYC</button>
        <p> If you want to buy tokens, send Wei to this address: {this.state.tokenSaleAddress}</p>
      </div>
    );
  }
}

export default App;
