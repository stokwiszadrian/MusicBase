import axios from "axios";

const newAxios = (token) => {
    const axiosInstance = axios.create()
    axiosInstance.interceptors.request.use(
        config => {
            config.headers['Authorization'] = 'Bearer ' + token
            config.headers['Access-Control-Allow-Origin'] = '*'
            config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE'
            config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
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

    return axiosInstance
}

export default newAxios;
