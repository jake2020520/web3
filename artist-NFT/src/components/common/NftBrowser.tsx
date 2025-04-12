import NftCard from "./NftCard";
import type { Nft } from "../../service/types";

import styles from "./NftBrowser.module.css";

function NftBrowser({ nfts }: { nfts: Nft[] }) {
  return (
    <div className={styles.main}>
      {nfts.map((nft, i) => {
        return (
          <div key={nft.tokenId} style={{ margin: "0px 20px 20px 0" }}>
            <NftCard nft={nft} />
          </div>
        );
      })}
    </div>
  );
}
export default NftBrowser;
