import { useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import PostImage from './PostImage'

export type BlahajPost = { href: string; horizontal?: boolean; src?: string }

function Scroller({ ...props }) {
    const [items, setItems] = useState([] as BlahajPost[])
    const [fetching, setFetching] = useState(false)
    const step = 20
    const [from, setFrom] = useState(0)
    const [to, setTo] = useState(step)

    const loadItems = async (from: number, to: number): Promise<BlahajPost[]> => {
        return await new Promise((res) =>
            setTimeout(() => {
                res(
                    new Array(to - from)
                        .fill(null)
                        .map((_, index) => ({ href: '/post/' + (index + from) }))
                )
            }, 10000)
        )
    }

    const fetchItems = useCallback(async () => {
        if (fetching) {
            return
        }

        setFetching(true)

        try {
            const { issues } = {
                issues: await loadItems(from, to),
            }
            setFrom(to)
            setTo(to + step)

            let allItems = [...items, ...issues]
            let columnCursor = 0
            allItems = allItems.map((item) => {
                const randHorizontal = Math.random() > 0.7 && columnCursor % 2 === 0
                columnCursor = randHorizontal ? 0 : columnCursor + 1

                return { ...item, horizontal: true } // TODO: fix the horizontal split view
            })

            setItems(allItems)
        } finally {
            setFetching(false)
        }
    }, [items, fetching, from, to])

    const loader = (
        <div key="loader" className="flex px-9 py-6 w-screen max-w-full" {...props}>
            <PostImage item={{ href: '', src: '' }} skeleton={true} />
        </div>
    )

    return (
        <InfiniteScroll
            loadMore={fetchItems}
            hasMore={true}
            loader={loader}
            className="w-full h-full pb-14"
            {...props}
        >
            <div className="flex flex-row flex-wrap gap-6 px-9">
                {items.length > 0
                    ? items.map((item) => <PostImage key={item.href} item={item} />)
                    : null}
            </div>
        </InfiniteScroll>
    )
}

export default Scroller
