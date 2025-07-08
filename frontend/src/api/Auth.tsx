import axios from "axios"
import type { User } from "../types/dashboard";
import type { AxiosResponse } from "axios";

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

export const login = async (email: String, password: String) : Promise<AxiosResponse<User> | null> => {
    try {
        return await axios.post("/api/Auth/Login", {
            Email: email,
            Password: password
        });
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }

        return null;
    }
}