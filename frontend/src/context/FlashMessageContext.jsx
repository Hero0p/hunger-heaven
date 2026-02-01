import React, { createContext, useContext, useState, useCallback } from 'react';

const FlashMessageContext = createContext();

export const useFlashMessage = () => {
    const context = useContext(FlashMessageContext);
    if (!context) {
        throw new Error('useFlashMessage must be used within a FlashMessageProvider');
    }
    return context;
};

export const FlashMessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const showMessage = useCallback((text, type = 'info', duration = 3000) => {
        const id = Date.now();
        setMessages((prev) => [...prev, { id, text, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeMessage(id);
            }, duration);
        }
    }, []);

    const removeMessage = useCallback((id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, []);

    return (
        <FlashMessageContext.Provider value={{ messages, showMessage, removeMessage }}>
            {children}
        </FlashMessageContext.Provider>
    );
};
