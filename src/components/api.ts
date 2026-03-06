import axios from "axios";

const api = axios.create({
    baseURL:"https://m2dd-serverchatapp.hf.space",
    withCredentials: true 
});



export default api;
