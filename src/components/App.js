import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Marketplace from "../abis/Marketplace.json";
import Navbar from "./Navbar";
import Main from "./main";
import ipfs from "./ipfs";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    
    if (networkData) {
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      this.setState({ marketplace });
      const productCount = await marketplace.methods.productCount().call();
      this.setState({ productCount });
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product],
        });
        console.log('Products' ,this.state.products)
      }
      this.setState({ loading: false });
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
      buffer: null,
      ipfsHash: "",
    };

    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  createProduct(name, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .createProduct(name, price )
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .purchaseProduct(id)
      .send({ from: this.state.account, value: price })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }


  render() {
    console.log('products',this.state.products)
    return (
      <div style={{  background:'#007fdb' }}>
        <Navbar account={this.state.account} />

        <div className="container-fluid w-100 ">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center align-items-center" style={{ height:'100vh' }}>
              {this.state.loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : (
                <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}
                  hashToken= {this.state.ipfsHash}
                  account={this.state.account}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


// import React, { Component } from 'react';
// import Web3 from 'web3'
// import './App.css';
// import Marketplace from '../abis/Marketplace.json'
// import Navbar from './Navbar'
// import Main from './main'
// import ipfs from './ipfs'

// class App extends Component {


//   async componentWillMount() {
//     await this.loadWeb3()
//     await this.loadBlockchainData()
//   }

//   async loadWeb3() {
//     if (window.ethereum) {
//       window.web3 = new Web3(window.ethereum)
//       await window.ethereum.enable()
//     }
//     else if (window.web3) {
//       window.web3 = new Web3(window.web3.currentProvider)
//     }
//     else {
//       window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
//     }
//   }

//   async loadBlockchainData() {
//     const web3 = window.web3
//     // Load account
//     const accounts = await web3.eth.getAccounts()
//     this.setState({ account: accounts[0] })
//     const networkId = await web3.eth.net.getId()
//     const networkData = Marketplace.networks[networkId]
//     if(networkData) {
//       const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
//       this.setState({ marketplace })
//       const productCount = await marketplace.methods.productCount().call()
//       this.setState({ productCount })
//       // Load products
//       for (var i = 1; i <= productCount; i++) {
//         const product = await marketplace.methods.products(i).call()
//         this.setState({
//           products: [...this.state.products, product]
//         })
//       }
//       this.setState({ loading: false})
//     } else {
//       window.alert('Marketplace contract not deployed to detected network.')
//     }
//   }

//   constructor(props) {
//     super(props)
//     this.state = {
//       account: '',
//       productCount: 0,
//       products: [],
//       loading: true,
//       buffer: null,
//       ipfsHash: ''
//     }

//     this.createProduct = this.createProduct.bind(this)
//     this.purchaseProduct = this.purchaseProduct.bind(this)

//     this.captureFile = this.captureFile.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);

//   }

//   createProduct(name, price) {
//     this.setState({ loading: true })
//     this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
//     .once('receipt', (receipt) => {
//       this.setState({ loading: false })
//     })
//   }

//   purchaseProduct(id, price) {
//     this.setState({ loading: true })
//     this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
//     .once('receipt', (receipt) => {
//       this.setState({ loading: false })
//     })
//   }

//   captureFile(event) {
//     event.preventDefault()
//     const file = event.target.files[0]
//     const reader = new window.FileReader()
//     reader.readAsArrayBuffer(file)
//     reader.onloadend = () => {
//       this.setState({ buffer: Buffer(reader.result)})
//       console.log('buffer', this.state.buffer)
//     }
//   }

//   onSubmit(event) {
//     event.preventDefault()
//     ipfs.files.add(this.state.buffer, (error, result) => {
//       if(error){
//         console.error(error)
//         return
//       }
//       this.setState({ ipfsHash: result[0].hash })
//       console.log('ipfsHash', this.state.ipfsHash)
//     })
//   }

  

//   render() {
//     return (
//       <div>
//         <h3>Upload Data</h3>
//           <form onSubmit={this.onSubmit}>
//           <input type= 'file' onChange={this.captureFile}  />
//           <input type= 'submit' />
//           </form>
//         <Navbar account={this.state.account} />
//         <div className="container-fluid mt-5">
//           <div className="row">
//             <main role="main" className="col-lg-12 d-flex">
//               { this.state.loading
//                 ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
//                 : <Main
//                   products={this.state.products}
//                   createProduct={this.createProduct}
//                   purchaseProduct={this.purchaseProduct} />
                  
//               }
//             </main>
//           </div>
//         </div>
//       </div>
//     );
//   }

  
// }

// export default App;