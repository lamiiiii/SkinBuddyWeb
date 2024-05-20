// Modal.js
import React from 'react';
import styles from './Modal.module.css'; // Modal 관련 스타일 import

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
