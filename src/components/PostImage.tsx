import { useNavigate } from 'react-router-dom'
import { ScrollerSharkPost } from './Scroller'

interface PostImageParams {
    item?: ScrollerSharkPost
    link?: boolean
    skeleton?: boolean
}

function PostImage({
    skeleton,
    item,
    link = true,
    ...prop
}: JSX.IntrinsicElements['div'] & PostImageParams) {
    const navigate = useNavigate()

    const post = skeleton ? null : item
    const post_url = skeleton ? '' : `/post/${post?.id.toString()}`

    const post_image_style = skeleton
        ? {}
        : {
              backgroundImage: `url(${
                  post?.images?.[0]
                      ? `${import.meta.env.VITE_BACKEND_SCHEMA}://${
                            import.meta.env.VITE_BACKEND_ADDRESS
                        }/image/${post.images[0]}`
                      : 'unknown'
              })`,
          }

    const post_image_body = (
        <div
            className={`${
                skeleton ? 'animate-pulse' : ''
            } h-full w-full bg-cyan-900/80 dark:bg-cyan-400/40`}
        >
            <div
                style={post_image_style}
                data-post-id={!skeleton ? String(post?.id) : 'post-skeleton'}
                data-post-title={post?.title}
                className="m-auto aspect-auto h-full max-h-full w-full bg-cover bg-center bg-no-repeat"
            />
        </div>
    )

    return (
        <div
            key={!skeleton ? String(post?.id) : 'post-skeleton'}
            data-post-id={!skeleton ? String(post?.id) : 'post-skeleton'}
            className="flex h-full w-full"
            {...prop}
        >
            {link ? (
                <a
                    target="_blank"
                    rel="noopener"
                    className="h-full w-full overflow-hidden rounded-md shadow-lg shadow-black/30 dark:shadow-black/60"
                    onClick={() => {
                        if (!skeleton) navigate(post_url, { preventScrollReset: true })
                    }}
                >
                    {post_image_body}
                </a>
            ) : (
                post_image_body
            )}
        </div>
    )
}

export default PostImage
