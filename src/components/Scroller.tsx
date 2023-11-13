import { useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useEffectOnce } from 'react-use'
import { SerializedSharkPost } from '../../shark_back/entity/bindings/SerializedSharkPost'
import PostImage from './PostImage'

interface ScrollerProps {
    parentRef?: React.RefObject<HTMLElement>
}

export type ScrollerSharkPost = SerializedSharkPost & { horizontal?: boolean }

/**
 * Retrieves a range of SerializedSharkPost items from the backend.
 *
 * @param {number} from - The starting index of the range.
 * @param {number} to - The ending index of the range.
 * @return {Promise<ScrollerSharkPost[]>} - A promise that resolves to an array of SerializedSharkPost items.
 */
function Scroller({ parentRef, ...props }: ScrollerProps) {
    const [items, setItems] = useState([] as ScrollerSharkPost[])
    const step = 20
    const [from, setFrom] = useState(0)
    const [to, setTo] = useState(step)
    const [storeCursor, setStoreCursor] = useState(0)
    let fetching = false // HACK: For infinite scroll (React doesn't update the state)
    const [more, setMore] = useState(false)

    /**
     * Retrieves a range of SerializedSharkPost items from the backend.
     *
     * @param {number} from - The starting index of the range.
     * @param {number} to - The ending index of the range.
     * @return {Promise<SerializedSharkPost[]>} - A promise that resolves to an array of SerializedSharkPost items.
     */
    const loadItems = async (from: number, to: number): Promise<SerializedSharkPost[]> => {
        try {
            const resp = await fetch(
                `${import.meta.env.VITE_BACKEND_SCHEMA}://${
                    import.meta.env.VITE_BACKEND_ADDRESS
                }/posts/${from}/${to - from}`
            )
            return await resp.json()
        } catch (e) {
            console.error(e)
            // Wait before fetching again
            await new Promise((resolve) => setTimeout(resolve, 3 * 1000 + Math.random() * 20))
            return []
        }
    }

    function setFromTo(from: number, to: number) {
        setFrom(from)
        setTo(to)
    }

    /**
     * Fetches images asynchronously.
     *
     * @return {Promise<void>} - A Promise that resolves when the images are fetched.
     */
    const fetchImages = useCallback(async () => {
        // Check if fetching is already in progress
        if (fetching) {
            return
        }

        // Set fetching flag to true
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetching = true

        try {
            // Load items from 'from' to 'to'
            const issues = await loadItems(from, to)

            if (issues.length === 0) {
                setMore(false)
                return
            }
            setFromTo(to, to + step)

            let column_cursor = storeCursor
            const newItems = issues.map((item, index) => {
                // Generate a random boolean value for 'randHorizontal'
                const rand_is_horizontal = Math.random() > 0.7 && column_cursor % 2 === 0

                const result = {
                    ...item,
                    horizontal: rand_is_horizontal,
                    nextCursor: index,
                    cursor: column_cursor,
                }
                // Update 'columnCursor' based on the value of 'randHorizontal'
                column_cursor = rand_is_horizontal ? 0 : column_cursor + 1
                // Ensure 'columnCursor' is within the range of 0 to 1
                column_cursor %= 2

                return result
            })

            setStoreCursor(column_cursor)

            // Append the new items to the 'prevItems' array
            setItems((prevItems) => [...prevItems, ...newItems])
        } finally {
            // Set fetching flag to false
            fetching = false
        }
    }, [fetching, from, to, storeCursor])

    useEffectOnce(() => {
        // fetchImages()
        setMore(true)
    })

    const loader = (
        <div key="loader" className="flex w-full max-w-full px-4 pb-6" {...props}>
            <PostImage skeleton className="flex h-56 w-full pr-4 pt-4 sm:h-80" />
        </div>
    )

    return (
        <InfiniteScroll
            loadMore={fetchImages}
            hasMore={more}
            loader={loader}
            threshold={500}
            className="h-full w-full pb-14 pl-4"
            useWindow={!parentRef?.current}
            getScrollParent={() => parentRef?.current ?? null}
            {...props}
        >
            <div className="mx-4 flex flex-row flex-wrap">
                {items.length > 0
                    ? items.map((item, index) => (
                          <PostImage
                              key={item.id.toString()}
                              item={item}
                              data-index={index}
                              className={`flex ${
                                  item?.horizontal === false ? 'w-1/2' : 'w-full'
                              } h-56 pr-4 pt-4 sm:h-80`}
                          />
                      ))
                    : null}
            </div>
        </InfiniteScroll>
    )
}

export default Scroller
