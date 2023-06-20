import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { AppState, SubState } from '../interfaces/interfaces';

interface StateContextProps {
    appState: AppState;
    setAppState: Dispatch<SetStateAction<AppState>>;
    subState: SubState;
    setSubState: Dispatch<SetStateAction<SubState>>;
    navbarOpen: boolean;
    setNavbarOpen: Dispatch<SetStateAction<boolean>>;
  }

// Define your context's shape
export const StateContext = createContext<StateContextProps>({
    appState: AppState.Loading,
    setAppState: () => { },
    subState: SubState.Idle,
    setSubState: () => { },
    navbarOpen: false,
    setNavbarOpen: () => { },
});

export const StateProvider = ({ children }) => {
    const [appState, setAppState] = useState(AppState.Loading);
    const [subState, setSubState] = useState(SubState.Idle);
    const [navbarOpen, setNavbarOpen] = useState(false);


    return (
        <StateContext.Provider value={{ appState, setAppState, subState, setSubState, navbarOpen, setNavbarOpen }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => {
    return useContext(StateContext);
};