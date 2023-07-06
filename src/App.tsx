import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './routes/home'
import Credits from './routes/credits'
import { ErrorBoundary } from 'react-error-boundary'
import Post from './routes/post'

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

    return (
        <>
            <main className="h-full flex items-center bg-main">
                <RouterProvider router={router} />
            </main>
        </>
    )
}

export default App
