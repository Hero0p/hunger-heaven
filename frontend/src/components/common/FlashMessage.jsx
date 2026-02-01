import React, { useEffect, useState } from 'react';
import { useFlashMessage } from '../../context/FlashMessageContext';
import styles from './FlashMessage.module.css';

const FlashMessage = () => {
    const { messages, removeMessage } = useFlashMessage();

    if (messages.length === 0) return null;

    return (
        <div className={styles.container}>
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`${styles.toast} ${styles[msg.type]}`}
                    role="alert"
                >
                    <div className={styles.icon}>
                        {msg.type === 'success' && '✓'}
                        {msg.type === 'error' && '✕'}
                        {msg.type === 'warning' && '!'}
                        {msg.type === 'info' && 'i'}
                    </div>
                    <span className={styles.text}>{msg.text}</span>
                    <button
                        onClick={() => removeMessage(msg.id)}
                        className={styles.closeBtn}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FlashMessage;
