import { Table} from 'antd'
import { useEffect, useState } from "react"
import { articles as getArticles, getArticle, removeArticle} from '../../service/storage-service'
import { useNavigate } from "react-router-dom"
function ArticleScratch() {
    const navigate = useNavigate()
    const [articles, setArticles] = useState([])
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 80,
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 500,
            render: (text) => <a href="javascript: void(0)" target="_self" onClick={e =>edit(text,e)}>{text}</a>
        },
        {
            title: '操作',
            dataIndex: 'title',
            width: 500,
            render: (text) => <a href="javascript: void(0)" target="_self" onClick={e =>remove(text,e)}>删除</a>
        },

    ]
    useEffect(() => {
        loadArticles();

    }, []);
    const edit = async (title, e)=>{
        debugger
        let content = await getArticle(title)
        navigate("/personal/article-write", { state: { title,content}})
    }
    const remove = async (title, e)=>{
        debugger
        let content = await removeArticle(title)
        loadArticles()
    }
    const loadArticles = async () => {
        debugger
        let as= await getArticles() ;
 
     
        setArticles(as)
        console.log("mounted!")
    }

    return (

        <div>


            <Table
                onRow={record => {
                    return {
                        onClick: event => { console.log(record) }, // 点击行
                        onDoubleClick: event => { },
                        onContextMenu: event => { },
                        onMouseEnter: event => { }, // 鼠标移入行
                        onMouseLeave: event => { },
                    };
                }}

                columns={columns}
                dataSource={articles}

                bordered
            >
            </Table>
        </div>
    )
}
export default ArticleScratch
