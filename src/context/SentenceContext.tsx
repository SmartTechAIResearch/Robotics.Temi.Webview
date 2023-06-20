import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

interface SentenceContextProps {
    sentenceCounter: number;
    setSentenceCounter: Dispatch<SetStateAction<number>>;
    currentSentence: string;
    setCurrentSentence: Dispatch<SetStateAction<string>>;
}

// Define your context's shape
export const SentenceContext = createContext<SentenceContextProps>({
    sentenceCounter: -1,
    setSentenceCounter: () => { },
    currentSentence: "",
    setCurrentSentence: () => { },
});

export const SentenceProvider = ({ children }) => {
    const [sentenceCounter, setSentenceCounter] = useState(-1);
    const [currentSentence, setCurrentSentence] = useState<string>("");

    return (
        <SentenceContext.Provider value={{ sentenceCounter, setSentenceCounter, currentSentence, setCurrentSentence }}>
            {children}
        </SentenceContext.Provider>
    );
};

export const useSentenceContext = () => {
    return useContext(SentenceContext);
};
