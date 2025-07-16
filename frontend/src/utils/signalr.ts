import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5152';

export const createSignalRConnection = (token: string) =>
  new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/chathub`, {
        accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();