import axios from "axios"
import type { User } from "../types/dashboard";

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
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }

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
    } catch (e) {
        console.error(e)
        return null;
    }
}