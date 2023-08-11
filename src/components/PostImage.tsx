import { useNavigate } from 'react-router-dom'
import { SharkPost } from '../../shark_back/bindings/SharkPost'
import bgImage from '../assets/pic/20230522_170011-clear.webp'

interface PostImageParams {
    item?: SharkPost & { horizontal?: boolean }
    skeleton?: boolean
}

function PostImage({ skeleton, item, ...prop }: PostImageParams) {
    const navigate = useNavigate()

    const post = skeleton ? null : item
    const post_url = skeleton ? '' : `/post/${post?.id.toString()}`

    const post_image_style = skeleton
        ? {}
        : {
              backgroundImage: `url(${post?.img_url ? post.img_url : bgImage})`,
          }

    return (
        <div
            key={!skeleton ? String(post?.id) : 'post-skeleton'}
            className={`flex ${
                post?.horizontal === false ? 'w-1/2' : 'w-full'
            } h-56 pr-4 pt-4 sm:h-80`}
            data-post-id={!skeleton ? String(post?.id) : 'post-skeleton'}
            {...prop}
        >
            <a
                target="_blank"
                rel="noopener"
                className="h-full w-full overflow-hidden rounded-md shadow-lg shadow-black/30 dark:shadow-black/60"
                onClick={() => {
                    if (!skeleton) navigate(post_url, { preventScrollReset: true })
                }}
            >
                <div
                    className={`${
                        skeleton ? 'animate-pulse' : ''
                    } h-full w-full bg-cyan-900/80 dark:bg-cyan-400/40`}
                >
                    <div
                        style={post_image_style}
                        className="m-auto aspect-auto h-full max-h-full w-full bg-cover bg-center bg-no-repeat"
                    />
                </div>
            </a>
        </div>
    )
}

export default PostImage
