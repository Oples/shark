import { None, Option } from 'oxide.ts'
import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { IoMdClose, IoMdCloudUpload } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { useClickAway } from 'react-use'
import { NewSharkPost } from '../../shark_back/entity/bindings/NewSharkPost'

export interface NewPostModalProps {
    opened?: boolean
    image?: Option<File>
    onClose: () => void
}

function NewPostModal({ opened = false, image = None, onClose = () => {} }: NewPostModalProps) {
    const [b64, setB64] = useState('')
    const [b64Error, setB64Error] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const changePictureRef = useRef<HTMLInputElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    useClickAway(modalRef, () => {
        onClose()
    })

    useEffect(() => {
        if (image.isSome()) {
            const reader = new FileReader()
            reader.onload = () => {
                setB64(reader.result as string)
            }
            reader.readAsDataURL(image.unwrap())
        }
    }, [image])

    /**
     * Creates the post on the backend.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    const onSubmit = async () => {
        // use fetch to upload the form to backend
        const formData: NewSharkPost = {
            title: title,
            description: description,
            // remove the data:image/png;base64, prefix
            img: b64.replace(/^data:image\/[a-z]+;base64,/, ''),
            user_id: '1',
        }

        const resp = await fetch(
            `${import.meta.env.VITE_BACKEND_SCHEMA}://${
                import.meta.env.VITE_BACKEND_ADDRESS
            }/new_post`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }
        )
        try {
            console.log(await resp.json())
        } catch (e) {
            console.error(e, resp)
        }

        if (resp.ok) {
            onClose()
        }
    }

    /**
     * Change/Upload the picture.
     */
    const openChangePicture = () => {
        if (changePictureRef.current) {
            changePictureRef.current.click()
        }
    }

    const changePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setB64(URL.createObjectURL(e.target.files[0]))
        }
    }

    const editTitleClass = 'px-3 text-sm font-bold opacity-70'

    return opened
        ? ReactDOM.createPortal(
              <div className="absolute left-0 top-0 flex h-screen min-w-full items-center bg-black/20 backdrop-blur dark:bg-black/40">
                  <div className="h-screen w-full cursor-pointer overflow-auto overscroll-contain py-10">
                      <div
                          ref={modalRef}
                          className="mx-auto flex w-4/5 cursor-default flex-col gap-3 rounded-lg bg-white p-3 text-cyan-900 dark:bg-zinc-900 dark:text-white"
                      >
                          <div className="flex w-full">
                              <div className="px-1 text-xl font-semibold">New post</div>
                              <button onClick={onClose} className="ml-auto">
                                  <IoMdClose className="h-6 w-6" />
                              </button>
                          </div>
                          <div className="flex flex-col gap-4">
                              <div
                                  style={{ backgroundImage: `url(${b64})` }}
                                  className="flex aspect-video w-full justify-end gap-2 rounded-lg bg-zinc-300 bg-contain bg-center bg-no-repeat p-2 shadow-[inset_0_0_2rem] shadow-black/30 dark:bg-black/40"
                              >
                                  <button className="self-end" onClick={openChangePicture}>
                                      <MdEdit className="h-5 w-5 text-cyan-500 drop-shadow-lg" />
                                  </button>
                                  <input
                                      id="hidden-input-change-picture"
                                      type="file"
                                      ref={changePictureRef}
                                      className="hidden"
                                      onChange={changePicture}
                                  />
                              </div>
                              <div>
                                  <div className={editTitleClass}>Title</div>
                                  <input
                                      onChange={(e) => {
                                          setTitle(e.target.value)
                                      }}
                                      className="mt-1 h-12 w-full rounded-lg bg-white/20 p-1 px-2 text-zinc-900 shadow-[inset_0_0_1rem] shadow-black/10 outline-[.18rem] outline-cyan-600/40 focus:outline dark:bg-black/40 dark:text-white"
                                  />
                              </div>
                              <div>
                                  <div className={editTitleClass}>Description</div>
                                  <textarea
                                      onChange={(e) => setDescription(e.target.value)}
                                      className="mt-1 h-28 w-full rounded-lg bg-white/20 p-1 px-2 text-zinc-900 shadow-[inset_0_0_1rem] shadow-black/10 outline-[.18rem] outline-cyan-600/40 focus:outline dark:bg-black/40 dark:text-white"
                                  />
                              </div>
                          </div>
                          <div className="flex w-full justify-end pt-4">
                              <button
                                  onClick={onSubmit}
                                  className="flex flex-row gap-1 whitespace-pre-wrap rounded-lg bg-cyan-800 px-3 py-2 font-bold text-white shadow-md shadow-cyan-700/30 dark:bg-cyan-600"
                              >
                                  Post{' '}
                                  <IoMdCloudUpload className="inline-block h-6 w-6 drop-shadow-[0_0_.06rem_rgb(255,255,255)]" />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>,
              document.getElementById('modal-root')!
          )
        : null
}

export default NewPostModal
