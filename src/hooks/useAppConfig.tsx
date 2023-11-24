import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';


export interface iAppConfig {
    socketUri: string;
    apiUri: string;
    tour: string;
    empty: boolean;
}

export const defaultConfig: iAppConfig = {
    socketUri: 'https://mcttemisocket.azurewebsites.net',
    apiUri: 'https://temi.azurewebsites.net',
    tour: "Howest Penta -1 DVDW",
    empty: false
}

// Fetch from process env if available


export function useAppConfig(): [
    iAppConfig,
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    () => void
] {
    const [config, setConfig] = useState<iAppConfig>(defaultConfig);

    const socket = useSocket();

    // Fetch and save the LocalStorage
    useEffect(() => {
        let savedConfig: iAppConfig;
        let overrideLocalStorage = true;
        if (localStorage != null && !overrideLocalStorage) {
            const localConfig = localStorage.getItem('appConfig');
            if (localConfig) {
                console.log("Found some existing config: " + localConfig);
                savedConfig = JSON.parse(localConfig);
                setConfig(savedConfig);
            } else {
                console.log("No existing config found.")
                setConfig(defaultConfig); // If there is no localStorage item set, but localStorage exists
            }
        // What if LocalStorage isn't available, such as on the Android Webview?
        } else {
            console.log("LocalStorage wasn't available so using fallback.")
            setConfig(defaultConfig);
        }

    }, []);

    const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({
            ...config,
            [event.target.name]: event.target.value,
        });
    };

    const saveConfig = () => {
        // Update socket and API URIs
        socket.connect();
        // Do similar thing for API URI
        if (config.tour !== "" && localStorage != null) {
            localStorage.setItem('appConfig', JSON.stringify(config));
        }
    };

    return [config, handleConfigChange, saveConfig];
}