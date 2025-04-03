import React, { useState, useRef, useEffect } from "react";

import "./App.css";
import { ethers } from "ethers";
import Lock from "./artifacts/contracts/Lock.sol/Lock.json";
// import Lock from "./abi/Lock.json";
function App() {
  const [content, setContent] = useState("");
  const [signer, setSigner] = useState("");
  const connect = async () => {
    console.log("connect");
    let signer = null;
    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      console.log("MetaMask signer", signer);
    }
  };
  const readMessage = async () => {
    console.log("readMessage");
    // 请求用户连接钱包
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 请求已经链接的 账号
    const accounts = await provider.send("eth_requestAccounts", []);
    const lock = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3", //部署成功的合约地址
      Lock.abi,
      provider
    );
    // const accounts = await provider.accounts;
    console.log("已连接账户:", accounts);
    const message = await lock.message();
    setContent(message);
    // alert(message);
  };
  const setMessage = async () => {
    // 请求用户连接钱包
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("signer ", signer);
    setSigner(signer.address);
    // 请求已经链接的 账号
    const accounts = await provider.send("eth_requestAccounts", []);

    let lock = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      Lock.abi,
      signer
    );
    // 链接一个账号，并且执行方法
    let transaction = await lock.connect(signer).setMessage("我是中国人!");
    let tx = await transaction.wait(1);
    debugger;
    let logs = tx.logs[0];
    let value = logs.args;

    console.log("value ", value);
    let message = value.toString();
    setContent(message);
    // alert(message);
  };
  return (
    <div className="App">
      <header className="App-header">
        测试
        <button onClick={connect}>Connect Wallet</button>
        <button onClick={readMessage}>readMessage</button>
        <button onClick={setMessage}>setMessage</button>
        <div>message: {content}</div>
        <div>signer: {signer}</div>
      </header>
    </div>
  );
}

export default App;
