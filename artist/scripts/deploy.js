const { ethers } = require("hardhat");

async function main() {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const lockTime = currentTimestamp + 60 * 60 * 24 * 365; // 1 year in seconds
  const ArtistNFT = await ethers.getContractFactory("Lock");
  const nft = await ArtistNFT.deploy(lockTime, {
    value: ethers.parseEther("0.01"),
  });

  await nft.waitForDeployment();

  console.log(`ArtistNFT   deployed to ${nft.target} `);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
