import Arweave from "arweave";
import { ARWEAVE } from "../config";
const arweave = Arweave.init({
    host: ARWEAVE.domain,
    port: ARWEAVE.port,
    protocol: ARWEAVE.protocol
});
export const toArweave = async (entity, tags) => {
    let tx = await arweave.createTransaction({
        data: entity,
    });
    Object.keys(tags).map(k => {
        tx.addTag(k, tags[k]);
    })
    tx.addTag("Content-Type", "text/json");
    await arweave.transactions.sign(tx);
    const response = await arweave.transactions.post(tx);

    const url = ARWEAVE.url_prefix + tx.id;
    alert(url)
    return url;
}
export const storeNftImage = async (file) => {
    const data = await readImageFile(file);
    const tags = { "Content-Type": "image/jpeg", "Domain-Type": "nft-image" };
    return await toArweave(data, tags);
}
const readImageFile = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => {
            resolve(event.target.result);
        }
        reader.onerror = event=>{
            reject(event);
        }
        reader.readAsArrayBuffer(file);
    })
}
export const storeMeta = async (meta) => {
    const tags = { "Content-Type": "text/json", "Domain-Type": "meta" };
    return await toArweave(meta, tags);

}

export const storeArticle = async (file) => {
    const tags = { "Content-Type": "text/html", "Domain-Type": "article" };
    return await toArweave(file, tags);
}