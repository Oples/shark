import { useCallback } from 'react'
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone'
import { BsCamera } from 'react-icons/bs'

function Upload() {
    const onDrop = useCallback(
        (acceptedFiles: unknown, _fileRej: FileRejection[], _ev: DropEvent) => {
            // TODO: Do something with the files
            console.log(acceptedFiles, _fileRej, _ev)
        },
        []
    )

    return (
        <Dropzone
            onDrop={(acceptedFiles, fileRej, ev) => onDrop(acceptedFiles, fileRej, ev)}
            onDragEnter={(e) => console.log(e)}
            getFilesFromEvent={(e) => {
                console.log('file', e)
                return Promise.resolve([])
            }}
        >
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                    className={`mx-auto flex h-full cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border-4 text-center text-3xl text-cyan-900 outline-0 transition dark:text-cyan-200 ${
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
    )
}

export default Upload
