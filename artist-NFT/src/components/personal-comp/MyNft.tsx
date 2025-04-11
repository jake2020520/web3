import { useEffect, useState } from "react"
import NftBrowser from "../common/NftBrowser"
import { ownedTypedNFT } from "../../service/nft-service"
import type{ Nft} from "../../service/types" 
function MyNft() {
  const [nfts, setNfts] = useState<Nft[]>([])

  useEffect(() => {
    loadNfts();

  }, []);

  const loadNfts = async () => {
    const ns = await ownedTypedNFT("image");
    if (ns.success)
      setNfts(ns.data)
    console.log("mounted!")
  }
  return (
    <div className="main">
      <NftBrowser nfts={nfts} />
    </div>
  )
}
export default MyNft