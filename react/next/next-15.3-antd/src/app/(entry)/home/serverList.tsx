import { Suspense } from 'react'
import Link from 'next/link'
// import { Card } from 'antd'
import Loading from '@/components/loading'
import { apiReqs } from '@/api/server'
import styles from './serverList.module.scss'

type ItemType = {
    id: number
    title: string
}

export default function ServerList() {
    const List = async () => {
        const res = await apiReqs.getArticleList()
        if (res.success) {
            return res.data.list.map((item: ItemType, index: number) => {
                return (<div className={styles['item-con']} key={index}>
                    <div className={styles['col-id']}>{item.id}</div>
                    <div className={styles['col-title']}>
                        <Link
                            href={{
                                pathname: '/detail/' + item.id,
                            }}
                        >
                            {item.title}
                        </Link>
                    </div>
                </div>)
            })
        }
        return res.message;
    }
    return (
        <div className={styles['M-serverList']}>
            <Suspense fallback={<Loading />}>
                <List />
                <div style={{ color: 'red',backgroundColor: 'gray' }}>测试颜色</div>
            </Suspense>
        </div>
    )
}