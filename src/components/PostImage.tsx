import bgImage from '../assets/pic/20230522_170011-clear.webp'
import { BlahajPost } from './Scroller'

function PostImage(prop: { item: BlahajPost; skeleton?: boolean }) {
    const post = prop.item

    return (
        <div
            className={`flex ${
                post?.horizontal === false ? 'w-1/2' : 'w-full'
            } sm:h-80 h-56 rounded-md overflow-hidden`}
        >
            <a href={post.href} target="_blank" rel="noopener" className="w-full h-full">
                <div
                    className={`${
                        prop.skeleton ? 'animate-pulse' : 'dark:bg-cyan-400/40 bg-cyan-900/80 '
                    } w-full h-full`}
                >
                    {prop.skeleton ? (
                        <div className="h-full w-full dark:bg-white/20 bg-cyan-900/20 max-h-full aspect-auto"></div>
                    ) : null}
                    {<img src={post.src ?? bgImage} className="max-h-full aspect-auto m-auto" />}
                </div>
            </a>
        </div>
    )
}

export default PostImage
