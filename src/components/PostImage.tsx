import bgImage from '../assets/pic/20230522_170011-clear.webp'
import { SharkPostImage } from '../../shark_back/bindings/SharkPostImage'
import { useNavigate } from 'react-router-dom'

function PostImage(prop: { item: SharkPostImage & { horizontal?: boolean }; skeleton?: boolean }) {
    const post = prop.item
    const post_url = `/post/${post.id.toString()}`
    const navigate = useNavigate()

    return (
        <div
            className={`flex ${
                post?.horizontal === false ? 'w-1/2' : 'w-full'
            } sm:h-80 h-56 pr-4 pt-4`}
        >
            <a
                href={post_url}
                target="_blank"
                rel="noopener"
                className="w-full h-full rounded-md overflow-hidden"
                onClick={(ev) => {
                    ev.stopPropagation()
                    ev.preventDefault()
                    navigate(post_url)
                }}
            >
                <div
                    className={`${
                        prop.skeleton ? 'animate-pulse' : 'dark:bg-cyan-400/40 bg-cyan-900/80 '
                    } w-full h-full`}
                >
                    {prop.skeleton ? (
                        <div className="h-full w-full dark:bg-white/20 bg-cyan-900/20 max-h-full aspect-auto"></div>
                    ) : null}
                    {
                        <img
                            src={post.img_url ? post.img_url : bgImage}
                            className="max-h-full aspect-auto m-auto"
                        />
                    }
                </div>
            </a>
        </div>
    )
}

export default PostImage