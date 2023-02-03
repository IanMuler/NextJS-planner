import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
  baseURL: process.env.PLANNER_ENDPOINT || "http://localhost:3000/",
});

export default client;
