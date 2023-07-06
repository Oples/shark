import { useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

function Scroller({ ...props }) {
    const [items, setItems] = useState([])
    const [nextPageUrl, setNextPageUrl] = useState(
        'https://api.github.com/repos/facebook/react/issues'
    )
    const [fetching, setFetching] = useState(false)

    const fetchItems = useCallback(async () => {
        if (fetching) {
            return
        }

        setFetching(true)

        try {
            const { issues, links } = {
                issues: [],
                links: {
                    next: null,
                },
            }

            setItems([...items, ...issues])

            if (links.next) {
                setNextPageUrl('')
            } else {
                setNextPageUrl('')
            }
        } finally {
            setFetching(false)
        }
    }, [items, fetching])

    const hasMoreItems = !!nextPageUrl

    const loader = (
        <div key="loader" className="loader">
            Loading ...
        </div>
    )

    return (
        <InfiniteScroll loadMore={fetchItems} hasMore={hasMoreItems} loader={loader}>
            <ul>
                {items.map((item, key) => (
                    <li key={key}>
                        <a href={item} target="_blank" rel="noopener">
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </InfiniteScroll>
    )
}

export default Scroller
