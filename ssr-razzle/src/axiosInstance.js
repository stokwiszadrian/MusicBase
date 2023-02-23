import axios from "axios";

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
    config => {
        const token = typeof window !== 'undefined' && typeof window.accessToken !== undefined ? window.accessToken : 'dummy_token';
        config.headers['Authorization'] = 'Bearer ' + token
        return config
    },
    error => {
        Promise.reject(error)
    })

axiosInstance.interceptors.response.use((response) => {
    return response
}, (error) => {
    return Promise.reject(error)
})

export default axiosInstance