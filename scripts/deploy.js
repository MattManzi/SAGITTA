const { ethers } = require("hardhat");

async function main() {
  const SoulboundToken = await ethers.getContractFactory("SoulboundToken");
  const deployTransaction = await SoulboundToken.getDeployTransaction();
  const signer = (await ethers.getSigners())[0];
  
  const deployment = await signer.sendTransaction(deployTransaction);
  const receipt = await deployment.wait();

  if (receipt.status === 1) {
    console.log("SoulboundToken deployed to:", receipt.contractAddress);
  } else {
    console.error("Failed to deploy SoulboundToken");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
