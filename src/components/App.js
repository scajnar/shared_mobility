import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
import Marketplace from '../abis/Marketplace.json'
import Main from './Main'


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
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    //const accounts = web3.eth.requestAccounts()

    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    // const networkId = "5777"
    console.log(networkId)
    const networkData = Marketplace.networks[networkId]
    console.log(networkData)
    if(networkData) {
      console.log("pred marketplace.abi")
      const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      console.log("pred marketplace.methods")
      const stevilo_vozil = await marketplace.methods.stevilo_vozil().call()
      console.log("po marketplace.methods")

      console.log(stevilo_vozil.toString())
      this.setState({ loading: false})
      this.setState({ stevilo_vozil })
    // Load products
      console.log("stevilo vozil je", stevilo_vozil)
      for (var i = 1; i <= stevilo_vozil; i++) {
        const vozilo = await marketplace.methods.vozila(i).call()
        if (vozilo.na_voljo==true){
          this.setState({
            vozila: [...this.state.vozila, vozilo]
          })
        }else if(vozilo.na_voljo==false){
          this.setState({
            sposojenaVozila: [...this.state.sposojenaVozila, vozilo]
          })
        }
      }
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      stevilo_vozil: 0,
      vozila: [],
      loading: true,
      sposojenaVozila: []
    }
    this.dodaj_vozilo = this.dodaj_vozilo.bind(this);
    //console.log("this.dodaj_vozilo je", this.dodaj_vozilo);
    this.sposodi_vozilo = this.sposodi_vozilo.bind(this);
    this.vrni_vozilo = this.vrni_vozilo.bind(this);
  }


  dodaj_vozilo(ime, cena, lokacija) {
    this.setState({ loading: true })
    console.log("this state account je", this.state.account)
    this.state.marketplace.methods.dodaj_vozilo(ime, cena, lokacija).send({from: this.state.account}).once('receipt', (receipt) => {this.setState({ loading: false })})
  }

  sposodi_vozilo(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.sposodi_vozilo(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  vrni_vozilo(id, lokacija) {
    this.setState({ loading: true })
    this.state.marketplace.methods.vrni_vozilo(id, lokacija).send({ from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            Shared Mobility App
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <Main
                vozila={this.state.vozila}
                dodaj_vozilo={this.dodaj_vozilo}
                sposodi_vozilo={this.sposodi_vozilo}
                vrni_vozilo={this.vrni_vozilo}
                sposojenaVozila={this.state.sposojenaVozila} />
            }
          </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
