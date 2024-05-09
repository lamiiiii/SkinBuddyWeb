import React, { useEffect } from "react";
import { 
    Link, /* 페이지 이동을 위해 */
    } from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./FirstPage.module.css"; // FirstPage.css 파일 import

function FirstPage(props) {
    useEffect(() => {
        console.log(localStorage.getItem('isLoggedIn'));
    })
    return (
        <div className={styles.firstWrapper}>
            <Navbar></Navbar>
            <div className={styles.firstContainer}>
                <img className={styles.centerLogo} src="/img/firstLogo.png" alt="페이지 로고 사진"/>
                <Link to="/LoginPage"><button className={styles.loginButton}>관리자 로그인</button></Link>
            </div>
        </div>
    );
}

export default FirstPage; 