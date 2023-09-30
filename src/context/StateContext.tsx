import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { AppState, SubState } from '../interfaces/interfaces';

interface StateContextProps {
    appState: AppState;
    setAppState: Dispatch<SetStateAction<AppState>>;
    subState: SubState;
    setSubState: Dispatch<SetStateAction<SubState>>;
    navbarOpen: boolean;
    setNavbarOpen: Dispatch<SetStateAction<boolean>>;
    apiUrl: string;
    setApiUrl: Dispatch<SetStateAction<string>>;
    tour: string;
    setTour: Dispatch<SetStateAction<string>>;
  }

// Define your context's shape
export const StateContext = createContext<StateContextProps>({
    appState: AppState.Loading,
    setAppState: () => { },
    subState: SubState.Idle,
    setSubState: () => { },
    navbarOpen: false,
    setNavbarOpen: () => { },
    apiUrl: "",
    setApiUrl: () => {},
    tour: "",
    setTour: () => {}
});

export const StateProvider = ({ children }) => {
    const [appState, setAppState] = useState(AppState.Loading);
    const [subState, setSubState] = useState(SubState.Idle);
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [apiUrl, setApiUrl] = useState("");
    const [tour, setTour] = useState("");


    return (
        <StateContext.Provider value={{ appState, setAppState, subState, setSubState, navbarOpen, setNavbarOpen, apiUrl, setApiUrl, tour, setTour }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => {
    return useContext(StateContext);
};