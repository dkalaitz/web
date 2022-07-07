import logo from './logo.svg';
import './stylesheet.css';
import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';
import car from './car.png';
import smartphone from './smartphone.jpg';
import computer from './computer.jpg';
import Web3 from 'web3';
import { toBeEnabled } from '@testing-library/jest-dom/dist/matchers';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('You should install Metamask!')
    }
  }


  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.state.currentAccount = accounts[0]
    window.ethereum.on("accountsChanged", accounts => { this.setState({ currentAccount: accounts[0] }) })
    console.log(this.state.currentAccount)
  }


  state = {
    manager: '',
    bidders: [],
    currentAccount: '',
    carTokens: '0',
    smartTokens: '0',
    computerTokens: '0',
    balance: '',
    value: '',
    message: ''
  };


  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, balance });
  }

  onSubmitCar = async event => {
    
    event.preventDefault();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.bid(0).send({
      from: this.state.currentAccount,
      value: web3.utils.toWei('0.01', 'ether')
    });

    this.setState({ message: 'You have been entered!' });

    alert('You have bidded for car!')

  };

  onSubmitSmart = async event => {
    event.preventDefault();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.bid(1).send({
      from: this.state.currentAccount,
      value: web3.utils.toWei('0.01', 'ether')
    });

    this.setState({ message: 'You have been entered!' });

    alert('You have bidded for smartphone!')

  };

  onSubmitComputer = async event => {
    event.preventDefault();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.bid(2).send({
      from: this.state.currentAccount,
      value: web3.utils.toWei('0.01', 'ether')
    });

    this.setState({ message: 'You have been entered!' });

    alert('You have bidded for computer!')

  };

  onReveal = async event => {
    event.preventDefault();

    this.setState({ carTokens: await lottery.methods.getNumberOfTokens(0).call() })
    console.log(this.state.carTokens)

    this.setState({ smartTokens: await lottery.methods.getNumberOfTokens(1).call() })

    this.setState({ computerTokens: await lottery.methods.getNumberOfTokens(2).call() })

    this.setState({ balance: await lottery.methods.getBalance().call() })

  }


  onDeclareWinners = async () => {

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.declareWinners().send({
      from: this.state.currentAccount
    });
    this.setState({ message: 'Winners have been picked!' });

    alert('Winners have been picked!');
  }

  onAmIwinner = async () => {

    const items = await lottery.methods.winnerQuery().call({
      from: this.state.currentAccount
    })

    const itemsNames = []
    const winningitems = items.filter(item => item > 0)
    if (winningitems.length > 0) {
      for (let i = 0; i < winningitems.length; i++) {
        if (winningitems[i] === 1) {
          itemsNames.push('car')
        } else if (winningitems[i] === 2) {
          itemsNames.push('smartphone')
        } else if (winningitems[i] === 3) {
          itemsNames.push('computer')
        }
      }
      alert('You have won ' + itemsNames + '!')
    } else {
      alert('You have not won any items')
    }
  }

  onWithdraw = async () => {
    await lottery.methods.withdraw().send({
      from: this.state.currentAccount
    })
  }

  onChangeManager = async () => {
    const new_manager = prompt('Enter new address: ')
    await lottery.methods.transfer_contract(new_manager).send({
      from: this.state.currentAccount
    })
  }

  onContractDestruction = async () => {
    if (window.confirm('Are you sure you want to destroy contract?')) {
      await lottery.methods.destroy().send({
        from: this.state.currentAccount
      })
    }
  }

  render() {
    return (
      <div id="container">
        <div id="header">
          <div id="banner"></div>
        </div>

        <div id="content">
          <h2>Welcome to our Lottery - Ballot!</h2>
          <hr />

          <div className="row">
            <div className="column">
              <h3>Car</h3>
              <img src={car} alt="car" />
              <label type='text' id='car_bids' className="bids">Car Tokens:  {this.state.carTokens}</label>
            </div>
            <div className="column">
              <h3>Smartphone</h3>
              <img src={smartphone} alt="smartphone"></img>
              <label type='text' id='smartphone_bids' className="bids">Smartphone Tokens: {this.state.smartTokens}</label>
            </div>
            <div className="column">
              <h3>Computer</h3>
              <img src={computer} alt="computer"></img>
              <label type='text' id='computer_bids' className="bids">Computer tokens: {this.state.computerTokens}</label>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <button className="button" onClick={this.onSubmitCar}>Bid</button>
              <label id='car_label'></label>
            </div>
            <div className="column">
              <button className="button" onClick={this.onSubmitSmart}>Bid</button>
              <label id='smartphone_label'></label>
            </div>
            <div className="column">
              <button className="button" onClick={this.onSubmitComputer}>Bid</button>
              <label id='computer_label'></label>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <p>Current Account: {this.state.currentAccount}</p>
              <label type='text' className='bids'></label>
            </div>
            <div className="column">
            </div>
            <div className="column">
              <p>Owner's Account: {this.state.manager}</p>
              <label type='text' className='bids'></label>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <button className="button leftButton" onClick={this.onReveal}>Reveal</button>
            </div>
            <div className="column">
            </div>
            <div className="column">
              <button className="button rightButton" onClick={this.onWithdraw}>Withdraw</button>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <button className="button leftButton" onClick={this.onAmIwinner}>Am I Winner</button>
            </div>
            <div className="column">
            </div>
            <div className="column">
              <button className="button rightButton" onClick={this.onDeclareWinners}>Declare Winner</button>
            </div>
          </div>

          <div className='row'>
            <div className='column'>
              <button className='button leftButton' onClick={this.onChangeManager}>Change Manager</button>
            </div>
            <div className='column'></div>
            <div className='column'>
              <button className='button rightButton' onClick={this.onContractDestruction}>Contract Destruction</button>
            </div>
          </div>

          <div className='row'>
            <div className='column'>
              <label>Contract Balance: {web3.utils.fromWei(this.state.balance, 'ether')} ether</label>
            </div>
          </div>

          <footer>Copyright &copy; 2022 Designs by Dimitris Kalaitzidis</footer>
        </div>
      </div >

    );
  }
}


export default App;
