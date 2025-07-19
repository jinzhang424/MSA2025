import axios from "axios"
import type { User } from "../types/dashboard";
import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface RegisterParams {
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string
}

export const register = async (user: RegisterParams) => {
    // Generate avatar SVG using user's name as seed for consistency
    const profileSvg = createAvatar(funEmoji, {
        seed: `${user.FirstName} ${user.LastName}`
    });

    // Convert to data uri for database storage
    const profileImageSvg = profileSvg.toDataUri();

    const res = await axios.post(`${API_BASE_URL}/api/Auth/RegisterUser`, {
        ...user, 
        ProfileImage: profileImageSvg
    });
    
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