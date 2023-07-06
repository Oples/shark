import { useParams } from 'react-router-dom'

function Post() {
    const { id } = useParams()

    return (
        <div className="w-full h-screen bg-main overflow-auto">
            <div className="aspect-square shadow-md bg-white"></div>
            {new Array(20).fill(null).map((_, key) => (
                <section key={key} className="p-4 flex flex-col gap-4">
                    <h1 className="bg-white text-cyan-800 font-bold text-3xl p-2 leading-none">
                        Post {id}
                    </h1>
                    <div className="px-1">
                        <div className="bg-white/80 text-black p-6 aspect-video">MAP</div>
                    </div>
                </section>
            ))}
        </div>
    )
}

export default Post
