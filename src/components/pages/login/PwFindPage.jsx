import React, { useState, useRef, useEffect } from "react";
import {
    Link, /* 페이지 이동을 위해 */
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./PwFindPage.module.css"; // PwFindPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function PwFindPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ managerId: "", telNumber: "" }); // 전화번호 입력 정보
    const [findPwd, setFindPwd] = useState(); // 임시 비밀번호
    const [noticeMessage, setNoticeMessage] = useState([]); // 알림 메세지
    const [modalOpen, setModalOpen] = useState(false); // 모달창 오픈을 위함
    const modalBackground = useRef(); // 모달창 바깥에 클릭 시 닫기를 위함
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/MainPage');
        } 
    }, []);

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickPwFind = () => {
        if(form.managerId == "root"){ // 루트 계정 접근 제한
            alert("해당 아이디는 접근 불가능합니다.");
            window.location.reload();
        } else {

        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickPwFind();
        }
    };

    return (
        <>
            <div className={styles.pwFindWrapper}>
                <Navbar></Navbar>
                <div className={styles.pwFindContainer}>
                    <p className={styles.mainText}>비밀번호 찾기</p>
                    <div className={styles.contentBox}>
                        <div className={styles.telContent}>
                            <p className={styles.telText}>아이디</p>
                            <input className={styles.telInput} type="text" name="managerId" value={form.managerId} onChange={onChange} placeholder="아이디 입력" onKeyDown={handleKeyDown}  autoFocus ></input>
                        </div>
                        <div className={styles.telContent}>
                            <p className={styles.telText}>휴대폰 번호</p>
                            <input className={styles.telInput} type="text" name="telNumber" value={form.telNumber} onChange={onChange} placeholder="'-'빼고 숫자만 입력" onKeyDown={handleKeyDown} ></input>
                        </div>
                        <p className={styles.noticeText}>{noticeMessage}</p>
                        <button className={styles.checkButton} onClick={onClickPwFind}>확인</button>
                        {
                            findPwd && modalOpen &&
                            <div className={styles.modalContainer} ref={modalBackground} onClick={e => {
                                if (e.target === modalBackground.current) {
                                    setModalOpen(false);
                                }
                            }}>
                                <div className={styles.modalContent}>
                                    <p>관리자님의 임시 비밀번호는 <span style={{ fontWeight: '600', color: 'blue' }}>{findPwd}</span>입니다.</p>
                                    <Link to="/LoginPage"><button className={styles.modalCloseButton} onClick={() => setModalOpen(false)}>로그인하러 가기</button></Link>
                                    <p className={styles.informText}>!! 로그인 후 새로운 비밀번호로 변경하여 사용해주세요!!</p>
                                </div>
                            </div>
                        }
                        <p className={styles.informText}>비밀번호를 찾고자 하는 아이디와 휴대폰 번호를 입력해주세요.</p>

                    </div>
                    <p className={styles.smallText} onClick={() => navigate('/IdFindPage')}>아이디가 기억나지 않는다면?</p>
                </div>
            </div>
        </>
    );
}

export default PwFindPage;