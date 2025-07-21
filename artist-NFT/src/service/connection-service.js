import { ethers } from "ethers";
import { messageBox } from "../service/message-service";
import { configuration } from "../config";

export const connectOnce = async () => {
  // debugger;
    console.log("connectOnce 00 ");
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("connectOnce 11 ", provider);
  await provider.send("eth_requestAccounts", []);

  let signer = provider.getSigner();
  let network = await provider.getNetwork();
  let address = await signer.getAddress();
      console.log("connectOnce 22 ",network);
  return { chainId: network.chainId, address: address, provider, signer };
};
export const trying = async () => {
  const { chainId, address, provider, signer } = await connectOnce();

  const supported = configuration().chainId.toString();
    console.log("trying 22 ",chainId , supported);
  if (chainId == supported) {
    messageBox(
      "success",
      "",
      "chainId: " + chainId + "      account: " + address.substring(0, 5) + ".."
    );
    console.log("connect success", chainId, address, provider, signer);
    return { success: true, provider, signer };
  }
  messageBox(
    "warning",
    "",
    "chainId: " + chainId + "      account: " + address.substring(0, 5) + ".."
  );

  return { success: false };
};
export const connect = async () => {
  let { success } = await trying();
  if (success) return;
  const conf = configuration();
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: conf.params,
  });
  await trying();
};
