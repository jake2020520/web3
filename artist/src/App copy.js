import "./App.css";
const { ethers } = require("hardhat");

function App() {
  const connect = async () => {
    let signer = null;
    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connect}>connect wallet</button>
      </header>
    </div>
  );
}

export default App;
