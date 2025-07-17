import axios from "axios"
import type { User } from "../types/dashboard";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface UserParams {
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string
}

export const register = async (user: UserParams) => {
    const res = await axios.post(`${API_BASE_URL}/api/Auth/RegisterUser`, {...user});
    return res.data;
}

export interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({email, password}: LoginParams) : Promise<User> => {
    const res =  await axios.post(`${API_BASE_URL}/api/Auth/Login`, {
        Email: email,
        Password: password
    });

    return res.data as User
}