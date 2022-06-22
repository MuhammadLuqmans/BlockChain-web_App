import React, { Component } from "react";
import { saveAs } from "file-saver";
import ipfs from "./ipfs";
import { db } from "./../firebase/firebase-config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import FirebaseDb from "./firebaseDb";
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   account: "",
      //   productCount: 0,
      //   products: [],
      //   loading: true,
      //   buffer: null,
      checkPurchasedProduct: "",
      ipfsHash: "",
      adminAddress: "0x4A9cd4C3a793893d03d8cEB4015CCb0DEE3d9dFF",
    };
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }

  onSubmit(event) {
    event.preventDefault();
    let fileBtn = document.getElementById("file_picker_btn");
    if (fileBtn.value.length === 0) {
      alert("please chose any file");
    } else if (fileBtn.value.length !== 0) {
      ipfs.files.add(this.state.buffer, (error, result) => {
        if (error) {
          console.error(error);
          return;
        }
        this.setState({ ipfsHash: result[0].hash });
        console.log("ipfsHash", this.state.ipfsHash);
      });
    }
  }
  // QmectcQMd6DNTMTRcc7N9yJxtJd3gt91eBreRDWbDDQYC3
  onDownload = async (fileLink) => {
    const image = `${fileLink}`;
    console.log(fileLink);
    console.log("download start");
    let fileBtn = document.getElementById("file_picker_btn");
    const downloadResult = await fetch(image);
    const blob = await downloadResult.blob();
    saveAs(blob, fileBtn.value);
  };

  handleFirebaseFile = async () => {
    const fileUrl = `https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}`;
    try {
      await addDoc(collection(db, "web3File_Urls"), {
        fileUrl,
        completed: false,
        created: Timestamp.now(),
      });
      console.log("fileUrls", fileUrl);
    } catch (err) {
      alert(err);
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.handleFirebaseFile();
    let fileBtn = document.getElementById("file_picker_btn");
    if (fileBtn.value.length === 0) {
      alert("please chose any file");
    } else if (fileBtn.value.length !== 0) {
      const name = this.productName.value;
      const price = window.web3.utils.toWei(
        this.productPrice.value.toString(),
        "Ether"
      );
      this.props.createProduct(name, price);
      console.log(name, price);
    }
  };

  render() {
    // const adminAddress = '0x4A9cd4C3a793893d03d8cEB4015CCb0DEE3d9dFF';
    return (
      <div
        id="content"
        style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "2px 3px 6px gray",
          width: "fit-content",
          height: "fit-content",
          padding: "20px",
          maxWidth: "760px",
          // width:'100%',
          overflow: "hidden",
        }}
      >
        <h3>Add Product</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group mr-sm-0">
            <input
              id="productName"
              type="text"
              ref={(input) => {
                this.productName = input;
              }}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="form-group mr-sm-0">
            <input
              id="productPrice"
              type="number"
              ref={(input) => {
                this.productPrice = input;
              }}
              className="form-control"
              placeholder="Product Price"
              required
            />
          </div>
          {/* upload files */}
          <input
            type="file"
            id="file_picker_btn"
            onChange={this.captureFile}
            placeholder="Upload File"
            className="btn-btn-primary"
            label="none"
            style={{ marginBottom: "10px" }}
          />
          <input
            type="submit"
            className="btn btn-primary"
            placeholder="UploadFile"
            onClick={this.onSubmit}
          />

          {/* complete upload */}

          <br />
          {this.state.ipfsHash === "" ? (
            <button type="submit" disabled className="btn btn-primary mt-4">
              Add Product
            </button>
          ) : (
            <button type="submit" className="btn btn-primary mt-4">
              Add Product
            </button>
          )}
        </form>
        <p>&nbsp;</p>
        <h3>Buy Product</h3>
        <div
          className="d-flex"
          style={{
            border: "3px solid rgb(222 226 230)",
            borderRadius: "10px",
            // boxShadow: "2px 3px 6px gray",
            overflow: "auto",
          }}
        >
          <table
            className="table"
            style={{ minWidth: "500px", overflow: "auto" }}
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Owner</th>
              </tr>
            </thead>
            <tbody id="productList">
              {console.log(this.props.products)}

              {this.props.products.map((product, idx) => {
                this.setState({ checkPurchasedProduct: product.purchased });
                return (
                  <tr key={idx}>
                    <th scope="row">{product.id.toString()}</th>
                    <td>{product.name}</td>
                    <td>
                      {window.web3.utils.fromWei(
                        product.price.toString(),
                        "Ether"
                      )}{" "}
                      ETH
                    </td>
                    <td>{product.owner}</td>
                    <td>
                      {!product.purchased ? (
                        <button
                          name={product.id}
                          value={product.price}
                          className='btn btn-primary'
                          onClick={(event) => {
                            this.props.purchaseProduct(
                              event.target.name,
                              event.target.value
                            );
                          }}
                        >
                          Buy
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table
            className="table"
            style={{ minWidth: "200px", overflow: "auto" }}
          >
            <thead>
              <tr>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <FirebaseDb
                onDownload={this.onDownload}
                admin={this.state.adminAddress}
                UserAddress={this.props.account}
                product={this.state.checkPurchasedProduct}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Main;
