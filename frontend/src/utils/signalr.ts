import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export const createSignalRConnection = (token: string) =>
  new HubConnectionBuilder()
    .withUrl('http://localhost:5152/chathub', {
        accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();