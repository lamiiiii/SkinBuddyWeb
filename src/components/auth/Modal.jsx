import React from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, imageSrc, children }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {imageSrc ? <img src={imageSrc} alt="Modal content" className={styles.modalImage} /> : children}
                <button className={styles.closeButton} onClick={onClose}>X</button>
            </div>
        </div>
    );
}

export default Modal;
