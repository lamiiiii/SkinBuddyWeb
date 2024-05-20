import React, { useEffect } from "react";
import { 
    Link, /* 페이지 이동을 위해 */
    useNavigate,
    } from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./FirstPage.module.css"; // FirstPage.css 파일 import

function FirstPage(props) {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/MainPage');
        } 
    }, []);
    return (
        <div className={styles.firstWrapper}>
            <Navbar></Navbar>
            <div className={styles.firstContainer}>
                <img className={styles.centerLogo} src="/img/firstLogo.png" alt="페이지 로고 사진"/>
                <Link to="/LoginPage"><button className={styles.loginButton}>관리자 로그인</button></Link>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default FirstPage; 