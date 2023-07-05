import bgImage from '/src/assets/pic/20230522_170011-clear.webp'
import './App.css'

function App() {
    return (
        <>
            <main className="h-full flex items-center bg-main text-white">
                <div className="text-2xl text-center bg-black/30 rounded-md max-w-md px-4 py-8 w-full mx-auto backdrop-blur-sm">
                    Soon... 🦈
                </div>
            </main>
            <div className="overflow-hidden absolute max-w-3xl bottom-0 right-0 pointer-events-none">
                <img src={bgImage} className="bg-pic-anim" />
            </div>
        </>
    )
}

export default App
