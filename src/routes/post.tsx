import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Result } from 'oxide.ts'
import { useCallback, useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { SerializedSharkPost } from '../../shark_back/entity/bindings/SerializedSharkPost'
import PostImage from '../components/PostImage'

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
    const [post, setPost] = useState<SerializedSharkPost>({
        id: BigInt(0),
        title: '',
        images: [],
        description: '',
        user_id: '',
        created_at: new Date().toISOString(),
    })
    const [postLocation, setPostLocation] = useState({ lat: 0, lng: 0 })
    const [icon, setIcon] = useState<L.Icon>()

    /**
     * Fetches a post from the backend server.
     */
    const fetchPost: () => Promise<Result<SerializedSharkPost, never>> = useCallback(async () => {
        async function fetchPostCall() {
            const resp = await fetch(
                `${import.meta.env.VITE_BACKEND_SCHEMA}://${
                    import.meta.env.VITE_BACKEND_ADDRESS
                }/post/${id}`
            )
            return resp.json()
        }
        return Result((await fetchPostCall()) as SerializedSharkPost)
    }, [id])

    useEffectOnce(() => {
        const fetchPostData = async () => {
            const post = (await fetchPost()).unwrap()

            setPost(post)
            setPostLocation({
                lat: post.location_latitude ?? 0,
                lng: post.location_longitude ?? 0,
            })

            console.debug(`Fetched post ${id}`, post)
        }
        fetchPostData()

        setIcon(
            L.icon({
                iconUrl: '/shark-green.png',
                iconSize: [41, 25],
                iconAnchor: [20, 25],
            })
        )
        console.debug(`Fetching post ${id}`)
    })

    return (
        <div className="bg-main flex h-full max-h-screen w-full flex-col overflow-auto">
            <div className="relative h-3/5 min-h-[25rem] w-full shrink-0 bg-white bg-cover bg-center bg-no-repeat text-zinc-900 shadow-xl shadow-black/20 transition-[height] dark:bg-zinc-900 dark:text-white sm:h-3/5 sm:min-h-[35rem] md:h-1/2">
                <PostImage skeleton={false} link={false} item={post} className="h-full w-full" />
                <div className="pointer-events-none absolute h-0 w-0 -translate-x-1/2 -translate-y-1/2 bg-radial-dot p-32" />
                <div
                    className="absolute left-0 top-0 inline-flex p-2 text-white drop-shadow"
                    onClick={() => history.back()}
                >
                    <IoMdArrowRoundBack className="text-4xl font-bold drop-shadow" />
                </div>
            </div>
            <div className="flex-1 bg-cyan-500/20 backdrop-brightness-125 backdrop-contrast-75 dark:bg-zinc-950/80 dark:backdrop-brightness-50 dark:backdrop-contrast-100 dark:backdrop-saturate-50">
                <div className="flex w-full flex-col gap-4 p-4">
                    <div className="mx-auto flex w-full max-w-screen-md flex-col gap-6 py-4">
                        <Section title={`${post?.title}`}>
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
                        <Section title="Description">
                            <div className="flex aspect-video h-full w-full items-center justify-center bg-white/80 text-zinc-900 backdrop-blur-[4px] dark:bg-zinc-900/90 dark:text-white">
                                {post?.description}
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
