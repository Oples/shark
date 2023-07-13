import bgImage from '../assets/pic/20230522_170011-clear.webp'
import { SharkPost } from '../../shark_back/bindings/SharkPost'
import { useNavigate } from 'react-router-dom'

type PostImageParams =
    | {
          item: SharkPost & { horizontal?: boolean }
          skeleton?: false
      }
    | {
          skeleton: true
      }

function PostImage(prop: PostImageParams) {
    const navigate = useNavigate()

    let post
    let post_url = ''
    if (!prop.skeleton) {
        post = prop.item
        post_url = `/post/${post.id.toString()}`
    }
    let post_image_style
    if (!prop.skeleton) {
        post_image_style = {
            backgroundImage: `url(${post?.img_url ? post.img_url : bgImage})`,
        }
    }

    return (
        <div
            id={!prop.skeleton ? String(post?.id) : 'post-skeleton'}
            className={`flex ${
                post?.horizontal === false ? 'w-1/2' : 'w-full'
            } sm:h-80 h-56 pr-4 pt-4`}
        >
            <a
                target="_blank"
                rel="noopener"
                className="w-full h-full rounded-md overflow-hidden shadow-lg shadow-black/20 dark:shadow-black/60"
                onClick={() => {
                    if (!prop.skeleton) navigate(post_url)
                }}
            >
                <div
                    className={`${
                        prop.skeleton ? 'animate-pulse' : ''
                    } dark:bg-cyan-400/40 bg-cyan-900/80  w-full h-full`}
                >
                    <div
                        style={post_image_style}
                        className="w-full h-full max-h-full aspect-auto m-auto bg-cover bg-center bg-no-repeat"
                    />
                </div>
            </a>
        </div>
    )
}

export default PostImage
