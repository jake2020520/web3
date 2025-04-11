import { ethers } from "hardhat";

async function main() {

  const ArtistNFT = await ethers.getContractFactory("ArtistNFT");
  const nft = await ArtistNFT.deploy();

  await nft.deployed();

  console.log(
    `ArtistNFT   deployed to ${nft.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
