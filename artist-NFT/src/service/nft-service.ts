import { ethers } from "ethers";
import { rpcUrl } from "../config";
import { trying } from "./connection-service";

import { configuration } from "../config";
import NFT from "../artifacts/contracts/ArtistNFT.sol/ArtistNFT.json";
import type { Nft } from "./types";
import axios from "axios";

export const owned = async (): Promise<{ success: boolean; data: Nft[] }> => {
  const { success, provider, signer } = await trying();
  if (!success) {
    // NotificationManager.warning('', "network not right!", 6000);
    return { success: false, data: [] };
  }

  const address = await signer?.getAddress();

  const nft = new ethers.Contract(
    configuration().nftAddress,
    NFT.abi,
    provider
  );

  const count = await nft.balanceOf(address);
  const amount = count.toNumber();

  const rst = await Promise.all(
    Array.from({ length: amount }, async (v, i) => {
      debugger;
      const tokenId = await nft.tokenOfOwnerByIndex(address, i);
      const tokenUri = await nft.tokenURI(tokenId);
      const meta = await axios.get(tokenUri);
      return { ...meta.data, tokenId, tokenUri };
    })
  );
  return { success: true, data: rst };
};
export const totalsupply = async (): Promise<number> => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl());

  const nft = new ethers.Contract(
    configuration().nftAddress,
    NFT.abi,
    provider
  );
  const total = await nft.totalSupply();
  return total;
};

export const mintNFT = async (
  tokenUri: String
): Promise<{ success: boolean; tokenId?: number }> => {
  const { success, provider, signer } = await trying();
  console.log("mintNFT connet", success, provider, signer);
  if (!success || !signer) {
    // NotificationManager.warning('', "network not right!", 6000);
    return { success: false };
  }

  let nft = new ethers.Contract(configuration().nftAddress, NFT.abi, signer);
  const address = await signer.getAddress();
  let transaction = await nft.connect(signer).mint(address, tokenUri);
  let tx = await transaction.wait(1);
  console.log("mintNFT mint", tx);
  debugger;
  let event = tx.events[0];
  let value = event.args[2];
  console.log(value);
  let tokenId = value.toNumber();
  alert(tokenId);
  return { success: true, tokenId };
};
export const ownedTypedNFT = async (
  type: string
): Promise<{ success: boolean; data: Nft[] }> => {
  let { success, data } = await owned();
  if (!success) return { success, data };
  let rst = data.filter((e: Nft) => e.type === type);
  return { success: true, data: rst };
};
