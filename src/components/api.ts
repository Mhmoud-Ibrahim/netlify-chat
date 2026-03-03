import axios from "axios";

const api = axios.create({
    baseURL: "https://m2dd-chatserver.hf.space",
    withCredentials: true // لو لسه عايز تجرب الكوكيز
});

// ده هيخلي التوكن يتبعت في كل الطلبات لو موجود
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
