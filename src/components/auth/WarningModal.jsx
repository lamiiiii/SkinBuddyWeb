import React, { useState, useEffect, useRef } from "react";
import styles from "./Modal.module.css"; // Modal.css 파일 import

function WarningModal({ message, onClose }) {
    const [modalOpen, setModalOpen] = useState(true); // 모달 열기 상태를 관리합니다.
    const timerRef = useRef(null); // 타이머를 저장하기 위한 ref

    useEffect(() => {
        // 모달이 열릴 때 타이머를 설정합니다.
        timerRef.current = setTimeout(() => {
            setModalOpen(false); // 일정 시간이 지난 후 모달을 닫습니다.
        }, 2000); // 3초 후에 모달을 닫습니다.

        // 컴포넌트가 언마운트될 때 타이머를 클리어합니다.
        return () => {
            clearTimeout(timerRef.current);
        };
    }, []);

    // 모달이 열려 있을 때만 렌더링합니다.
    return (
        <>
            {modalOpen && (
                <div className={styles.warningModal}>
                    <p className={styles.message}>{message}</p>
                </div>
            )}
        </>
    );
}

export default WarningModal;
