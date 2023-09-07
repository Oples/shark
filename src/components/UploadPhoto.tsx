import { None, Option, Some } from 'oxide.ts'
import { DragEvent, useCallback, useState } from 'react'
import Dropzone, { DropEvent, FileError, FileRejection } from 'react-dropzone'
import { BsCamera } from 'react-icons/bs'
import NewPostModal from './NewPostModal'

function Upload() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(None as Option<File>)

    const onDrop = useCallback(
        (acceptedFiles: unknown, _fileRej: FileRejection[], _ev: DropEvent) => {
            // TODO: Do something with the files
            console.log(acceptedFiles, _fileRej, _ev)
        },
        []
    )

    const onDragEnter = (e: DragEvent<HTMLElement>) => {
        console.debug('onDragEnter', e)
    }

    const onDropRejected = (e: FileRejection[]) => {
        console.debug('onDropRejected', e)
    }

    const validator = (file: File): FileError | null => {
        console.debug('validator', file)

        if (!file.type.startsWith('image/')) {
            return { code: 'type', message: 'File type not supported' }
        }

        return null
    }

    const onDropAccepted = (files: File[]) => {
        console.log('onDropAccepted', files)
        setIsModalOpen(true)
        setUploadedImage(Some(files[0]))
    }

    return (
        <>
            <Dropzone
                onDrop={onDrop}
                onDragEnter={onDragEnter}
                // getFilesFromEvent={getFilesFromEvent}
                onDropAccepted={onDropAccepted}
                onDropRejected={onDropRejected}
                validator={validator}
                maxFiles={1}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        className={`mx-auto flex h-full cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border-4 text-center text-3xl outline-0 transition ${
                            isDragActive
                                ? 'border-dashed border-cyan-800/60 dark:border-cyan-200/50'
                                : 'border-dashed border-transparent hover:border-cyan-800/20 hover:dark:border-cyan-200/30'
                        }`}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <div className="font-semibold">Post your sightings</div>
                        <BsCamera className="text-7xl" />
                    </div>
                )}
            </Dropzone>
            <NewPostModal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                image={uploadedImage}
            />
        </>
    )
}

export default Upload
