
import NftCard from "./NftCard"
import type {Nft} from "../../service/types"

import styles from './NftBrowser.module.css'


function NftBrowser({nfts}:{nfts: Nft[]}) {


  return (

      <div className={styles.main}>
      
        {
          nfts.map((nft, i) => {
            return (
              <NftCard nft={nft} />
            );
          })

        }
    
    </div>
  )
}
export default NftBrowser