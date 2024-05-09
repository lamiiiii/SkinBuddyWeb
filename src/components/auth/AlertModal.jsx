import React, { useState, useEffect, useRef } from "react";
import styles from "./Modal.module.css"; // Modal.css 파일 import

function AlertModal({ message, onClose }) {
    const [modalOpen, setModalOpen] = useState(true); // 모달 열기 상태를 관리합니다.
    const timerRef = useRef(null); // 외부 클릭 인식

    // 모달이 열려 있을 때만 렌더링합니다.
    return (
        <>
            {modalOpen && (
                <div className={styles.alertModal}>
                    <p className={styles.message}>{message}</p>
                </div>
            )}
        </>
    );
}

export default AlertModal;
