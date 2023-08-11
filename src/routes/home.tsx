import { useEffect, useState } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'
import Scroller from '../components/Scroller'
import Upload from '../components/UploadPhoto'
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
        <div className="relative flex min-h-screen w-full flex-col self-start overflow-auto bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
            <div className="absolute right-0 top-0 p-4 text-3xl">
                <div onClick={toggleTheme}>
                    {theme ? (
                        <BsMoon className="text-cyan-200/80" />
                    ) : (
                        <BsSun className="text-cyan-700" />
                    )}
                </div>
            </div>
            <div className="mx-auto h-[80vh] w-full max-w-screen-lg py-9 portrait:max-h-[24rem] landscape:max-h-[42rem]">
                <div className="mx-auto aspect-square max-h-full p-5">
                    <Upload />
                </div>
            </div>
            <div className="mx-auto w-full max-w-screen-md grow">
                <Scroller />
            </div>
        </div>
    )
}

export default Home
