import { useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import PostImage from './PostImage'
import { SharkPostImage } from '../../shark_back/bindings/SharkPostImage'
import { useEffectOnce } from 'react-use'

function Scroller({ ...props }) {
    const [items, setItems] = useState([] as SharkPostImage[])
    const [fetching, setFetching] = useState(false)
    const step = 20
    const [from, setFrom] = useState(0)
    const [to, setTo] = useState(step)

    const loadItems = async (from: number, to: number): Promise<SharkPostImage[]> => {
        return await new Promise((res) =>
            setTimeout(() => {
                res(
                    new Array(to - from).fill(null).map((_, index) => ({
                        id: BigInt(from + index),
                        img_url: '',
                    }))
                )
            }, 1000)
        )
    }

    useEffectOnce(() => {
        fetchItems()
    })

    const fetchItems = useCallback(async () => {
        console.log('fetching', from, to, fetching)

        if (fetching) {
            return
        }

        setFetching(true)

        try {
            let { issues } = {
                issues: await loadItems(from, to),
            }
            setFrom(to)
            setTo(to + step)

            let columnCursor = 0
            issues = issues.map((item) => {
                const randHorizontal = Math.random() > 0.7 && columnCursor % 2 === 0
                columnCursor = randHorizontal ? 0 : columnCursor + 1

                return { ...item, horizontal: randHorizontal } // TODO: fix the horizontal split view
            })

            const allItems = [...items, ...issues]

            setItems(allItems)
        } finally {
            setFetching(false)
        }
    }, [items, fetching, from, to])

    const loader = (
        <div key="loader" className="flex py-6 w-full max-w-full" {...props}>
            <PostImage item={{ id: BigInt(from), img_url: '' }} skeleton={true} />
        </div>
    )

    return (
        <InfiniteScroll
            loadMore={fetchItems}
            hasMore={true}
            loader={loader}
            className="w-full h-full pb-14 pl-4"
            {...props}
        >
            <div className="flex flex-row flex-wrap mx-4">
                {items.length > 0
                    ? items.map((item) => <PostImage key={item.id.toString()} item={item} />)
                    : null}
            </div>
        </InfiniteScroll>
    )
}

export default Scroller
