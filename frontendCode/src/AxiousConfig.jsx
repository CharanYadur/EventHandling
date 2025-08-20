import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://eventhandling-w5tp.onrender.com/", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, 
});

export default axiosInstance;
