export const isDark = () => {
    let theme = localStorage.getItem('theme')
    if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    return theme === 'dark'
}
