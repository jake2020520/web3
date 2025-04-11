//localStorage
import { Axios } from "axios"; 
export const getArticle = async (title) => {
    let aid = "article-" + title;
    return localStorage.getItem(aid);
}
export const saveArticle = async (title, content) => {
    let aid = "article-" + title;
    localStorage.setItem(aid, content);
}
export const removeArticle = async (title) => {
    let aid = "article-" + title;
    localStorage.removeItem(aid);
    return articles();
}
export const articles = async () => {
    let length = localStorage.length;
    let rst = new Array();
    let index = 0;
    for(let i = 0; i < length; i++){
        let aid = localStorage.key(i);
        if(aid.startsWith("article")){
            let title = aid.split("-")[1];
            index++;
            rst.push({index, title, content: localStorage.getItem(aid)})
        }
    }
    return rst;
}