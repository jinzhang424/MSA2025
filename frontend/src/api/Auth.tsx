import axios from "axios"
import type { User } from "../types/dashboard";
import { toast } from "react-toastify";

export interface UserModel {
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string
}

export const register = async (user: UserModel) => {
    console.log(user)
    try {
        await axios.post("/api/Auth/RegisterUser", {
            ...user
        });

        toast.success("Successfully registered account")
    } catch (e: any) {
        console.log("Error while registering", e)
        toast.error(e.response?.data)
        return null;
    }
}

export const login = async (email: String, password: String) : Promise<User | null> => {
    try {
        const res =  await axios.post("/api/Auth/Login", {
            Email: email,
            Password: password
        });

        return res.data as User
    } catch (e: any) {
        console.error("Error while signing in", e);
        toast.error(e.response?.data);
        return null;
    }
}