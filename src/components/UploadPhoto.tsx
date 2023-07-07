import { BsCamera } from 'react-icons/bs'
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone'
import { useCallback } from 'react'

function Upload() {
    const onDrop = useCallback((acceptedFiles: any, fileRej: FileRejection[], ev: DropEvent) => {
        console.log(acceptedFiles)
    }, [])

    return (
        <Dropzone onDrop={(acceptedFiles, fileRej, ev) => onDrop(acceptedFiles, fileRej, ev)}>
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                    className={`w-2/3 border-4 dark:text-cyan-200 text-cyan-900 rounded-lg h-full mx-auto flex flex-col text-3xl text-center items-center justify-center gap-5 ${
                        isDragActive
                            ? 'border-cyan-800/60 dark:border-cyan-200/50 border-dashed'
                            : 'border-transparent border-solid '
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
