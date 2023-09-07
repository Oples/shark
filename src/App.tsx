import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Credits from './routes/credits'
import Home from './routes/home'
import Post from './routes/post'
import { isDark } from './utils/theme'

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home />,
            errorElement: <div>Something went wrong</div>,
        },
        {
            path: '/credits',
            element: <Credits />,
            errorElement: <ErrorBoundary fallback={<div>Something went wrong</div>} />,
        },
        {
            path: '/post/:id',
            element: <Post />,
        },
    ])

    useEffect(() => {
        isDark() ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    }, [])

    return (
        <>
            <main className="bg-main flex h-full items-center">
                <RouterProvider router={router} />
            </main>
        </>
    )
}

export default App
