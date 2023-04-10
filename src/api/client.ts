import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLANNER_ENDPOINT || "http://localhost:3000/",
});

export default client;
