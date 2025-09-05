import { ethers } from "hardhat";
import styles from "./bank.module.scss";

export default async function Home() {
  const [signer, buyer] = await ethers.getSigners();
  return (
    <div className={styles["P-bank"]}>
      <div>bank</div>
    </div>
  );
}
