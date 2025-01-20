import axios, { AxiosInstance, AxiosResponse } from 'axios'
import load from './load'

const service: AxiosInstance = axios.create({
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    load.show()
    return config
  },
  (error: any) => {
    load.hide()
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    load.hide()
    return response
  },
  (error: any) => {
    load.hide()
    return Promise.reject(error)
  }
)

export default service
