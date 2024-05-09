import React, { useState, useRef, useEffect } from "react";
import {
    Link, /* 페이지 이동을 위해 */
    useNavigate
} from "react-router-dom";
import styles from './Dropdown.module.css';

function Dropdown() {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.menu1}>
                <li className={styles.menuText} onClick={() => navigate('/ManagerPage')}>관리자 관리</li>
                <li className={styles.menuText} onClick={() => navigate('/ManagerPwChangePage')}>비밀번호 변경</li>
            </div>

            <li className={styles.menuText} onClick={() => navigate('/UserManagePage')}>사용자 정보 관리</li>

            <li className={styles.menuText} onClick={() => navigate('/UserRecordManagePage')}>진단 기록 관리</li>

            <li className={styles.menuText} onClick={() => navigate('/AdManagePage')}>광고 관리</li>

            <div className={styles.menu5}>
                <li className={styles.menuText} onClick={() => navigate('/NoticeManagePage')}>공지사항 관리</li>
                <li className={styles.menuText} onClick={() => navigate('/TermsManagePage')}>이용약관 관리</li>
                <li className={styles.menuText} onClick={() => navigate('/QnaManagePage')}>Q&A 관리</li>
            </div>

            <div className={styles.menu6}>
                <li className={styles.menuText} onClick={() => navigate('/AiClassificationPage')}>여드름 분류 모델</li>
                <li className={styles.menuText} onClick={() => navigate('/AiImprovementPage')}>여드름 호전도 개선 모델</li>
            </div>

        </>
    );
}

export default Dropdown;