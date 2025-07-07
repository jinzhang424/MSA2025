import axios from "axios"

export interface UserModel {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export const register = async (user: UserModel) => {
    try {
        await axios.post("/api/Auth/RegisterUser", {
            Name: `${user.firstName} ${user.lastName}`,
            Email: user.email,
            Password: user.password
        });
    } catch (e) {
        return e
    }
}

export const login = async (email: String, password: String) => {
    try {
        return await axios.post("http://localhost:5152/Auth/Login", {
            Email: email,
            Password: password
        });
    } catch (e) {
        return e;
    }
}