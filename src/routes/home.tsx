import { BsMoon, BsSun } from 'react-icons/bs'
import Scroller from '../components/Scroller'
import Upload from '../components/UploadPhoto'
import { useEffect, useState } from 'react'
import { isDark } from '../utils/theme'

function Home() {
    const [theme, setTheme] = useState(isDark())

    const toggleTheme = () => {
        const newTheme = !theme
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    }

    useEffect(() => {
        theme ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    }, [theme])

    return (
        <div className="w-full relative h-screen overflow-auto scroll-auto flex flex-col bg-white text-black dark:bg-zinc-900 dark:text-white">
            <div className="absolute right-0 top-0 p-4">
                <div onClick={toggleTheme}>
                    {theme ? (
                        <BsMoon className="text-3xl text-indigo-400" />
                    ) : (
                        <BsSun className="text-3xl text-cyan-700" />
                    )}
                </div>
            </div>
            <div className="landscape:max-h-[42rem] portrait:max-h-[24rem] py-9 h-screen flex-shrink-0">
                <Upload />
            </div>
            <div className="max-w-screen-md mx-auto flex-grow">
                <Scroller />
            </div>
        </div>
    )
}

export default Home
