import "./App.css";
import { ethers } from "ethers";
function App() {
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
  const readMessage = () => {
    console.log("readMessage");
  };
  return (
    <div className="App">
      <header className="App-header">
        测试
        <button onClick={connect}>Connect Wallet</button>
        <button onClick={readMessage}>readMessage</button>
      </header>
    </div>
  );
}

export default App;
