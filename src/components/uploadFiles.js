import React, { Component } from "react";
import ipfs from "./ipfs";
      // "address": "0xf30C7cD00E700Fe85D662fafd011c7a839e645C2",


export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //   account: "",
    //   productCount: 0,
    //   products: [],
    //   loading: true,
    //   buffer: null,
    //   ipfsHash: "",
    };

    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  btn = () => {
    console.log("ipfsHash", this.state.ipfsHash);
    };


  render() {
    return (
      <div>
        <button onClick={this.btn}>check</button>
          <input type="file" id="file_picker_btn" onChange={this.captureFile} />
          <input type="submit" className="btn btn-primary" placeholder="UploadFile" onClick={this.onSubmit} />
      </div>
    );
  }
}
