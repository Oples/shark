import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './routes/home'
import Credits from './routes/credits'
import { ErrorBoundary } from 'react-error-boundary'
import Post from './routes/post'
import { useEffect } from 'react'
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
