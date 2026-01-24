import axios from "axios";

export const requestAddress = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_ADDRESS || "https://countriesnow.space/api/v0.1",
  headers: {
    "Content-Type": "application/json",
  },
});
