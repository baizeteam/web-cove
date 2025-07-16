import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: "/api", // 可根据实际情况修改
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可在此处添加 token 等操作
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

export default request;
