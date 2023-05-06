export default async function notify(message: string, type: ToastNotif) {
    let toast = await import('@/lib/toasts/toast').then(mod => mod.default)
    return toast[type](message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    })
}
