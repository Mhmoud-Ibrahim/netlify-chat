import axios from "axios";

const api = axios.create({
    baseURL:"https://m2dd-serverchatapp.hf.space",
    withCredentials: true 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            // الأفضل التأكد من وجود كائن headers لتجنب الأخطاء
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
