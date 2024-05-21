import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../auth/Navbar";
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./IdFindPage.module.css";
import axios from "axios";

function IdFindPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ telNumber: "" });
    const [findId, setFindId] = useState();
    const [noticeMessage, setNoticeMessage] = useState([]); // 알림 메세지
    const [findIdModalOpen, setFindIdModalOpen] = useState(false);
    const modalBackground = useRef();
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            // 로그인된 상태에서는 접근 필요 없기 때문에 메인페이지로 이동
            navigate('/MainPage');
        } else {
            // 페이지 처음 로드할 때 스크롤 위치 초기화
            window.scrollTo({ top: 0 });
        }
    }, []);

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickIdFind = () => {
        if (form.telNumber) {
            setNoticeMessage("");
            const requestData = { tel: form.telNumber };
            const apiUrl = 'http://52.79.237.164:3000/manager/find/id';

            axios.post(apiUrl, requestData)
                .then(response => {
                    if (response.data["property"] === 200) {
                        setFindId(response.data.managerId);
                        setFindIdModalOpen(true);
                    } else {
                        alert(response.data.message);
                        window.location.reload(); // 페이지 새로고침
                    }
                })
                .catch(error => {
                    console.error('전송 실패: ', error);
                    alert('아이디 찾기에 실패하였습니다. 관리자에게 문의해주세요.');
                })
        } else {
            setNoticeMessage("휴대폰 변호를 입력하세요.");
        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickIdFind();
        }
    };

    return (
        <>
            <div className={styles.idFindWrapper}>
                <Navbar />
                <div className={styles.idFindContainer}>
                    <p className={styles.mainText}>아이디 찾기</p>
                    <div className={styles.contentBox}>
                        <div className={styles.telContent}>
                            <p className={styles.telText}>휴대폰 번호</p>
                            <input className={styles.telInput} type="text" name="telNumber" value={form.telNumber} onChange={onChange} placeholder="'-'빼고 숫자만 입력" onKeyDown={handleKeyDown} autoFocus ></input>
                        </div>
                        <p className={styles.noticeText}>{noticeMessage}</p>
                        <button className={styles.checkButton} onClick={() => onClickIdFind()}>확인</button>
                        {
                            findId && findIdModalOpen &&
                            <div className={styles.modalContainer} ref={modalBackground} onClick={e => {
                                if (e.target === modalBackground.current) {
                                    setFindIdModalOpen(false);
                                }
                            }}>
                                <div className={styles.modalContent}>
                                    <p>관리자님의 아이디는  <span style={{ fontWeight: '600', color: 'blue' }}>{findId}</span>입니다.</p>
                                    <Link to="/LoginPage"><button className={styles.modalCloseButton} onClick={() => setFindIdModalOpen(false)}>로그인하러 가기</button></Link>
                                    <p className={styles.smallText} onClick={() => navigate('/PwFindPage')}>비밀번호 찾기</p>
                                </div>
                            </div>
                        }
                        <p className={styles.informText}>회원정보에 등록한 휴대폰 번호로 아이디를 찾을 수 있습니다.</p>
                    </div>
                    <p className={styles.smallText2} onClick={() => navigate('/LoginPage')}>로그인 페이지로 이동</p>
                </div>
                <button className={styles.topButton} onClick={scrollToTop}>Top</button>
                <Footer></Footer>
            </div>
        </>
    );
}

export default IdFindPage;
