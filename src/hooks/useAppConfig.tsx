import React, { useEffect, useState } from 'react';
import { useSocket } from '../SocketContext';

export function useAppConfig(): [
    { socketUri: string; apiUri: string; tour: string; empty: boolean; },
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    () => void
] {
    const [config, setConfig] = useState({
        socketUri: '',
        apiUri: '',
        tour: '',
        empty: true,
    });

    const socket = useSocket();

    // Fetch and save the LocalStorage
    useEffect(() => {
        const savedConfig = localStorage.getItem('appConfig');
        if (savedConfig) {
            console.log("Found some existing config: " + savedConfig);
            let conf = JSON.parse(savedConfig);
            setConfig(conf);
        } else {
            setConfig({
                socketUri: 'https://mcttemisocket.azurewebsites.net',
                apiUri: 'https://temiapi.azurewebsites.net',
                tour: 'Howest MCT',
                empty: false
            });
        }
    }, []);

    // Save LocalStorage config
    useEffect(() => {
        if (config.tour !== "") {
            localStorage.setItem('appConfig', JSON.stringify(config));
        }
    }, [config]);

    const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({
            ...config,
            [event.target.name]: event.target.value,
        });
    };

    const saveConfig = () => {
        // Update socket and API URIs
        socket.connect(config.socketUri);
        // Do similar thing for API URI
    };

    return [config, handleConfigChange, saveConfig];
}