import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCallback, useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { Result } from 'ts-results'
import { SharkPost } from '../../shark_back/bindings/SharkPost'

function Section({ title, children, ...props }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex w-full flex-col gap-4" {...props}>
            <h1 className="rounded-md bg-white/95 p-2 px-3 text-3xl font-bold leading-none text-cyan-700 shadow-lg shadow-black/30 dark:bg-zinc-900 dark:text-white">
                {title}
            </h1>
            <div className="h-full w-full px-2">
                <div className="h-full w-full overflow-hidden rounded-md shadow-lg">{children}</div>
            </div>
        </section>
    )
}

function Post() {
    const { id } = useParams()
    const [post, setPost] = useState<SharkPost>()
    const [postLocation, setPostLocation] = useState({ lat: 0, lng: 0 })
    const [icon, setIcon] = useState<L.Icon>()

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
        const fetchPostData = async () => {
            const post = await (await fetchPost()).unwrap()

            setPost(post)
            setPostLocation({
                lat: post.location_latitude,
                lng: post.location_longitude,
            })
        }
        fetchPostData()

        setIcon(
            L.icon({
                iconUrl: '/shark-green.png',
                iconSize: [41, 25],
                iconAnchor: [20, 25],
            })
        )
    })

    return (
        <div className="bg-main h-screen w-full overflow-auto">
            <div className="min-h-full bg-cyan-500/20 backdrop-brightness-125 backdrop-contrast-75 dark:bg-zinc-950/80 dark:backdrop-brightness-50 dark:backdrop-contrast-100 dark:backdrop-saturate-50">
                <div
                    className="relative aspect-square max-h-96 w-full bg-white bg-cover bg-center bg-no-repeat text-zinc-900 shadow-xl shadow-black/20 dark:bg-zinc-900 dark:text-white"
                    style={{
                        backgroundImage: `url(${post?.img_url || ''})`,
                    }}
                >
                    <div className="pointer-events-none absolute h-0 w-0 -translate-x-1/2 -translate-y-1/2 bg-radial-dot p-32" />
                    <div
                        className="inline-flex p-2 text-white drop-shadow"
                        onClick={() => history.back()}
                    >
                        <IoMdArrowRoundBack className="text-4xl font-bold drop-shadow" />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-4 p-4">
                    <div className="mx-auto w-full max-w-screen-md">
                        <Section title={`Post ${id}`}>
                            <div className="flex aspect-video h-full w-full items-center justify-center bg-white/80 text-zinc-900 backdrop-blur-[4px] dark:bg-zinc-900/90 dark:text-white">
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
                                        <Marker
                                            draggable={false}
                                            icon={icon}
                                            position={postLocation}
                                        ></Marker>
                                    </MapContainer>
                                ) : (
                                    <h3>No coordinates provided</h3>
                                )}
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
