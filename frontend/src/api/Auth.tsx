import axios from "axios"

export interface UserModel {
    fullName: string,
    email: string,
    password: string
}

export const register = async (user: UserModel) => {
    try {
        await axios.post("/api/Auth/RegisterUser", {
            Name: user.fullName,
            Email: user.email,
            Password: user.password
        });
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }

        return null;
    }
}

export const login = async (email: String, password: String) => {
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