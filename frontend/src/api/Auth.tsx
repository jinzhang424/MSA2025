import axios from "axios"
import type { User } from "../types/dashboard";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface UserModel {
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string
}

export const register = async (user: UserModel) => {
    console.log(user)
    try {
        await axios.post(`${API_BASE_URL}/api/Auth/RegisterUser`, {
            ...user
        });

        toast.success("Successfully registered account")
    } catch (e: any) {
        console.log("Error while registering", e)
        toast.error(e.response?.data || "Unknown error occurred while registering.")
        return null;
    }
}

export const login = async (email: String, password: String) : Promise<User | null> => {
    try {
        const res =  await axios.post(`${API_BASE_URL}/api/Auth/Login`, {
            Email: email,
            Password: password
        });

        return res.data as User
    } catch (e: any) {
        console.error("Error while signing in", e);
        toast.error(e.response?.data || "Unknown error occurred while logging in");
        return null;
    }
}