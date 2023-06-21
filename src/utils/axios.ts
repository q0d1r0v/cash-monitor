// imports
import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_BASE_URL

const http = axios.create({
    baseURL: baseURL,
    headers: {
        Accept: 'application/json'
    }
})

http.interceptors.request.use((config) => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
        config.headers.Authorization = `JWT ${access_token}`
    }
    return config
})

http.interceptors.response.use(
    (conf) => conf,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token')
            window.location.reload()
        }
        return Promise.reject(error)
    }
)

export default http