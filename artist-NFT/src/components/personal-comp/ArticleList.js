/*
 * @Author: LAPTOP-6SK38UP6\65736 desong
 * @Date: 2025-04-03 22:40:48
 * @LastEditors: LAPTOP-6SK38UP6\65736 desong
 * @LastEditTime: 2025-04-11 22:38:12
 * @FilePath: \reack_sol\sol\web3\artist-NFT\src\components\personal-comp\ArticleList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from "react";
import { Table } from "antd";
import { readArticle } from "../../service/ipfs-service";
import { useNavigate } from "react-router-dom";
import { ownedTypedNFT } from "../../service/nft-service";
function ArticleList() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const columns = [
    {
      title: "标题",
      dataIndex: "name",
      width: 500,
      render: (text) => (
        <a href="javascript: void(0)" target="_self">
          {text}
        </a>
      ),
    },

    {
      title: "阅读",
      dataIndex: "entity",
      width: 500,
      render: (entity) => (
        <a
          href="javascript: void(0)"
          target="_self"
          onClick={(e) => view(entity, e)}
        >
          阅读
        </a>
      ),
    },
  ];
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    debugger;
    let { success, data } = await ownedTypedNFT("article");
    let rdata = data.map((e, i) => ({ index: i, entity: e, ...e }));
    setArticles(rdata);
    console.log("mounted!");
  };
  const view = async (entity, event) => {
    debugger;
    let content = await readArticle(entity.uri);
    navigate("/personal/article-read", {
      state: { title: entity.name, content },
    });
  };
  return (
    <div>
      <Table
        onRow={(record) => {
          return {
            onClick: (event) => {
              console.log(record);
            }, // 点击行
            onDoubleClick: (event) => {},
            onContextMenu: (event) => {},
            onMouseEnter: (event) => {}, // 鼠标移入行
            onMouseLeave: (event) => {},
          };
        }}
        columns={columns}
        dataSource={articles}
        bordered
      ></Table>
    </div>
  );
}
export default ArticleList;
