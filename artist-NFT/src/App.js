import React, { useState, useRef, useEffect } from "react";

import "./App.css";
import { ethers } from "ethers";
import Lock from "./artifacts/contracts/Lock.sol/Lock.json";

function App() {
  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const addr = await signer.getAddress();
  };

  const readMessage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const lock = new ethers.Contract(
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      Lock.abi,
      provider
    );
    const message = await lock.message();
    alert(message);
  };

  const setMessage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    let lock = new ethers.Contract(
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      Lock.abi,
      signer
    );

    let transaction = await lock.connect(signer).setMessage("world hello!");
    let tx = await transaction.wait(1);
    debugger;
    let event = tx.events[0];
    let value = event.args[0];

    let message = value.toString();
    alert(message);
  };
  return (
    <div className="App">
      <button onClick={connect}>connect wallet</button>
      <button onClick={readMessage}>readMessage</button>
      <button onClick={setMessage}>setMessage</button>
    </div>
  );
}

export default App;
