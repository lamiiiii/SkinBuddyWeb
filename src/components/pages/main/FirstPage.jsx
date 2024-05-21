import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../auth/Navbar";
import Footer from "../../auth/Footer";
import styles from "./FirstPage.module.css";

function FirstPage(props) {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const imagesRef = useRef([]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/MainPage');
        } else {
            window.scrollTo({ top: 0 });
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    } else {
                        entry.target.classList.remove(styles.visible);
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        imagesRef.current.forEach(img => {
            if (img) {
                observer.observe(img);
            }
        });

        return () => {
            imagesRef.current.forEach(img => {
                if (img) {
                    observer.unobserve(img);
                }
            });
        };
    }, []);

    return (
        <div className={styles.firstWrapper}>
            <Navbar />
            <div className={styles.firstContainer}>
                <div>
                    <p className={styles.bannerText}>AI 피부관리 도우미 서비스 &emsp;
                        <span style={{ fontSize: '100px', color: '#9ABBF3', fontFamily: 'NanumSquareRoundEB', fontWeight: 'bolder' }}>SkinBuddy</span>
                    </p>
                    <div className={styles.imageDiv}>
                        <img ref={el => imagesRef.current[0] = el} className={`${styles.appImage} ${styles.appImage1}`} src="/img/Main.png" alt="앱 메인페이지 사진" />
                        <img ref={el => imagesRef.current[1] = el} className={`${styles.appImage} ${styles.appImage2}`} src="/img/MBTI.png" alt="피부 MBTI 검사 페이지 사진" />
                    </div>
                    <p className={styles.bannerSmallText}>스킨버디는 간편하고 신뢰성 있는 방식으로 사용자의 피부 건강증진을 돕습니다</p>
                </div>
                <div className={styles.pageContainer}>
                    <div className={styles.imageDiv}>
                        <img ref={el => imagesRef.current[2] = el} className={`${styles.appImage} ${styles.appImage1}`} src="/img/Classification.png" alt="유형 분석 페이지 사진" />
                        <img ref={el => imagesRef.current[3] = el} className={`${styles.appImage} ${styles.appImage2}`} src="/img/ClassificationHistory.png" alt="유형 분석 진단 기록 사진" />
                        <img ref={el => imagesRef.current[4] = el} className={`${styles.appImage} ${styles.appImage3}`} src="/img/Detection.png" alt="호전도 분석 페이지 사진" />
                        <img ref={el => imagesRef.current[5] = el} className={`${styles.appImage} ${styles.appImage4}`} src="/img/DetectionHistory.png" alt="호전도 분석 진단 기록 사진" />
                    </div>
                    <p className={styles.bannerSmallText}>여드름 유형과 피부 호전도를 분석 받고 관리 요법을 받아보세요.</p>
                </div>
                <img ref={el => imagesRef.current[6] = el} className={styles.centerLogo} src="/img/firstLogo.png" alt="페이지 로고 사진" />
                <button ref={el => imagesRef.current[7] = el} className={styles.loginButton} onClick={() => navigate('/LoginPage')}>
                    관리자 로그인
                </button>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer />
        </div>
    );
}

export default FirstPage;
