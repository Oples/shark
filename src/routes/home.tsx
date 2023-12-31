import { useEffect, useRef, useState } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'
import Upload from '../components/DropZonePhoto'
import Scroller from '../components/Scroller'
import { isDark } from '../utils/theme'

function Home() {
    const [theme, setTheme] = useState(isDark())
    const homeRef = useRef<HTMLDivElement>(null)

    const toggleTheme = () => {
        const newTheme = !theme
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    }

    useEffect(() => {
        theme ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    }, [theme])

    return (
        <div
            ref={homeRef}
            className="relative flex h-screen w-full flex-col self-start overflow-y-scroll bg-white text-cyan-900 transition-colors dark:bg-zinc-900 dark:text-cyan-200"
        >
            <div className="absolute right-0 top-0 p-4 text-3xl">
                <div onClick={toggleTheme}>{theme ? <BsMoon /> : <BsSun />}</div>
            </div>
            <div className="mx-auto h-[80vh] min-h-[20rem] w-full max-w-screen-lg py-4 sm:py-9 portrait:max-h-[24rem] landscape:max-h-[42rem]">
                <div className="mx-auto aspect-square max-h-full p-5">
                    <Upload />
                </div>
            </div>
            <div className="mx-auto w-full max-w-screen-md grow">
                <Scroller parentRef={homeRef} />
            </div>
        </div>
    )
}

export default Home
