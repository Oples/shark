import 'leaflet/dist/leaflet.css'
import { useCallback, useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { Result } from 'ts-results'
import { SharkPost } from '../../shark_back/bindings/SharkPost'

function Post() {
    const { id } = useParams()
    const [post, setPost] = useState<SharkPost>()
    const [postLocation, setPostLocation] = useState({ lat: 0, lng: 0 })

    /**
     * Fetches a post from the backend server.
     *
     * @return {Promise<any>} A promise that resolves to the fetched post.
     */
    const fetchPost = useCallback(async () => {
        return Result.wrap(async (): Promise<SharkPost> => {
            const resp = await fetch(
                `${import.meta.env.VITE_BACKEND_SCHEMA}://${
                    import.meta.env.VITE_BACKEND_ADDRESS
                }/post/${id}`
            )
            return await resp.json()
        })
    }, [id])

    useEffectOnce(() => {
        const op = async () => {
            const post = await (await fetchPost()).unwrap()

            setPost(post)
            setPostLocation({
                lat: post.location_latitude,
                lng: post.location_longitude,
            })
        }
        op()
    })

    return (
        <div className="bg-main h-screen w-full overflow-auto">
            <div
                className="aspect-square max-h-96 w-full bg-white bg-cover bg-center bg-no-repeat text-zinc-900 shadow-xl shadow-black/20 dark:bg-zinc-900 dark:text-white"
                style={{
                    backgroundImage: `url(${post?.img_url || ''})`,
                }}
            >
                <div
                    className="inline-flex p-2 text-white drop-shadow"
                    onClick={() => {
                        history.back()
                    }}
                >
                    <IoMdArrowRoundBack className="text-4xl font-bold drop-shadow" />
                </div>
            </div>
            <section className="flex flex-col gap-4 p-4">
                <h1 className="rounded-md bg-white p-2 px-3 text-3xl font-bold leading-none text-cyan-800 dark:bg-zinc-900 dark:text-white">
                    Post {id}
                </h1>
                <div className="h-full w-full px-2">
                    <div className="flex aspect-video h-full w-full items-center justify-center overflow-hidden rounded-md bg-white/80 text-zinc-900 backdrop-blur-sm dark:bg-zinc-900/80 dark:text-white">
                        {post?.location_latitude && post?.location_longitude ? (
                            <MapContainer
                                center={postLocation}
                                zoom={7}
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%' }}
                                dragging={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={postLocation}></Marker>
                            </MapContainer>
                        ) : (
                            <h3>No coordinates provided</h3>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Post
