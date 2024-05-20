import React from "react";
import {
    useNavigate
} from "react-router-dom";
import styles from './Dropdown.module.css';

function Dropdown({ cursorMenu }) {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.dropdownWrapper}>
                {cursorMenu === 1 && (
                    <div className={styles.menu}>
                        <li className={styles.menuText} onClick={() => {navigate('/ManagerPage'); window.location.reload(); window.scrollTo({ top: 0 });}}>관리자 관리</li>
                        <li className={styles.menuText} onClick={() => {navigate('/ManagerPwChangePage'); window.location.reload(); window.scrollTo({ top: 0 });}}>비밀번호 변경</li>
                    </div>
                )}
                {cursorMenu === 2 && (
                    <div className={styles.menu}>
                        <li className={styles.menuText} onClick={() => {navigate('/UserManagePage'); window.location.reload(); window.scrollTo({ top: 0 });}}>사용자 정보 관리</li>
                    </div>
                )}
                {cursorMenu === 3 && (
                    <div className={styles.menu}>
                        <li className={styles.menuText} onClick={() => {navigate('/UserRecordManagePage'); window.location.reload(); window.scrollTo({ top: 0 });}}>진단 기록 관리</li>
                    </div>
                )}
                {cursorMenu === 4 && (
                    <div className={styles.menu}>
                        <li className={styles.menuText} onClick={() => {navigate('/AdManagePage'); window.location.reload(); window.scrollTo({ top: 0 });}}>광고 관리</li>
                    </div>
                )}

                {cursorMenu === 5 && (
                    <div className={styles.menu}>
                        <li className={styles.menuText} onClick={() => {navigate('/NoticeManagePage'); window.location.reload(); window.scrollTo({ top: 0 });}}>공지사항 관리</li>
                        <li className={styles.menuText} onClick={() => {navigate('/TermsManagePage'); window.location.reload(); window.scrollTo({ top: 0 });}}>이용약관 관리</li>
                        <li className={styles.menuText} onClick={() => {navigate('/QnaManagePage'); window.location.reload(); window.scrollTo({ top: 0 });}}>Q&A 관리</li>
                    </div>
                )}

                {cursorMenu === 6 && (
                    <div className={styles.menu}>
                        <li className={styles.menuText} onClick={() => {navigate('/AiClassificationPage'); window.location.reload(); window.scrollTo({ top: 0 });}}>여드름 분류 모델</li>
                        <li className={styles.menuText} onClick={() => {navigate('/AiImprovementPage'); window.location.reload(); window.scrollTo({ top: 0 });}}>여드름 호전도 개선 모델</li>
                    </div>
                )}

            </div>
        </>
    );
}

export default Dropdown;