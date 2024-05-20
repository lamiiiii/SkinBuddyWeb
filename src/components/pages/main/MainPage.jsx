import { React, useState, useEffect, useRef } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./MainPage.module.css"; // MainPage.module.css import
import axios from "axios"; // api 통신을 위해 axios install & import
import Chart from 'chart.js/auto'; // Chart.js import
import Modal from "../../auth/Modal"; // 모달 컴포넌트 import


function MainPage(props) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [AIGraph, setAIGraph] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const autoSlideTimeoutRef = useRef(null);
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 오픈 여부 저장

    // 메인페이지 정보 반환
    const returnMainInformation = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/home/user'; // 메인페이지 정보 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                setData(response.data);
                drawBarChart(response.data); // 데이터를 기반으로 막대 그래프 그리기
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('메인페이지 정보 반환 오류 발생: ', error);
            })
    }

    // AI 결과 그래프 반환
    const returnAIGraph = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/ai/get'; // 그래프 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                setAIGraph(response.data.data);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('AI 결과 그래프 반환 오류 발생: ', error);
            })
    }

    // 광고 반환
    const returnAdList = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/advertise/list';
        axios.get(apiUrl)
            .then(response => {
                setAdvertisements(response.data.data);
            })
            .catch(error => {
                console.error('광고 목록 반환 오류 발생: ', error);
            });
    };

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage"); // 로그인 페이지로 이동
        } else {
            returnMainInformation();
            returnAIGraph(); // AI 결과 그래프 불러오기
            returnAdList(); // 광고 목록 불러오기
        }
    }, []);

    useEffect(() => {
        if (advertisements.length > 1) {
            startAutoSlide();
        }
    }, [advertisements]);

    const startAutoSlide = () => {
        // 자동 슬라이드가 이미 실행 중인지 확인
        if (intervalId) {
            clearInterval(intervalId); // 기존 인터벌 제거
        }

        // 5초마다 다음 광고로 자동 슬라이드
        const id = setInterval(() => {
            setCurrentAdIndex(prevIndex => (prevIndex + 1) % advertisements.length);
        }, 5000); // 5초(5000밀리초)로 변경
        setIntervalId(id);
    }

    const stopAutoSlide = () => {
        // 자동 슬라이드 멈춤
        clearInterval(intervalId);
        setIntervalId(null);
    }

    // 버튼 눌리면 멈췄다가 다시 자동 슬라이드 재생
    const resetAutoSlideTimeout = () => {
        if (autoSlideTimeoutRef.current) {
            clearTimeout(autoSlideTimeoutRef.current);
        }
        autoSlideTimeoutRef.current = setTimeout(startAutoSlide, 3000);
    };

    const goToPrevAd = () => {
        // 이전 광고로 이동
        setCurrentAdIndex(prevIndex => (prevIndex === 0 ? advertisements.length - 1 : prevIndex - 1));
        stopAutoSlide();
        resetAutoSlideTimeout();
    }

    const goToNextAd = () => {
        // 다음 광고로 이동
        setCurrentAdIndex(prevIndex => (prevIndex + 1) % advertisements.length);
        stopAutoSlide();
        resetAutoSlideTimeout();
    }

    // 막대 그래프 그리기
    const drawBarChart = (data) => {
        const ctx = document.getElementById('myChart').getContext('2d');
        // 기존 차트가 있으면 제거 - 중복 제거
        if (window.barChart !== undefined) {
            window.barChart.destroy();
        }
        window.barChart = new Chart(ctx, {
            type: 'bar',
            // type: 'line',
            data: {
                labels: ['DRNT', 'DRNW', 'DRPT', 'DRPW', 'DSNT', 'DSNW', 'DSPT', 'DSPW', 'ORNT', 'ORNW', 'ORPT', 'ORPW', 'OSNT', 'OSNW', 'OSPT', 'OSPW'],
                datasets: [{
                    label: 'Data',
                    data: [
                        data.DRNT, data.DRNW, data.DRPT, data.DRPW,
                        data.DSNT, data.DSNW, data.DSPT, data.DSPW,
                        data.ORNT, data.ORNW, data.ORPT, data.ORPW,
                        data.OSNT, data.OSNW, data.OSPT, data.OSPW
                        // 3, 4, 2, 7,
                        // 18, 3, 5, 2,
                        // 1, 4, 23, 1,
                        // 2, 6, 1, 11,
                    ],
                    backgroundColor: [
                        '#BCD3ED', '#B3A8D3', '#41A3C2', '#F16789',
                        '#F49AC1', '#F7CDC5', '#D391C0', '#F16789',
                        '#CCE29D', '#9FD5BC', '#B5D336', '#83C15D',
                        '#FDD6B9', '#FFE3A3', '#FDD6B9', '#FCB85C'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0)',
                    // pointBackgroundColor: [
                    //     '#BCD3ED', '#B3A8D3', '#41A3C2', '#F16789',
                    //     '#F49AC1', '#F7CDC5', '#D391C0', '#F16789',
                    //     '#CCE29D', '#9FD5BC', '#B5D336', '#83C15D',
                    //     '#FDD6B9', '#FFE3A3', '#FDD6B9', '#FCB85C'
                    // ],
                    // borderColor: 'rgba(0, 0, 0, 0.5)',
                    // pointRadius: 5,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                            font: {
                                weight: 'bold' // labels 글씨 두껍게 설정
                            }
                        }
                    }
                }
            }

        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.mainWrapper}>
            <Navbar></Navbar>
            <div className={styles.mainContainer}>
                <div className={styles.lineBox}>
                    <div className={styles.smallBox} onClick={() => navigate('/AIClassificationPage')}>
                        <p className={styles.mainText2}>AI 분류 모델</p>
                        {AIGraph[0] && <img className={styles.aiGraph} src={`data:image/jpeg;base64,${AIGraph[0].photo}`} alt="분류 모델 그래프 사진" />}
                    </div>
                    <div className={styles.smallBox}>
                        <p className={styles.mainText}>Buddy</p>
                        <div className={styles.contentBox}>{data.userCount}</div>
                    </div>
                    <div className={styles.smallBox} onClick={() => navigate('/AIImprovementPage')}>
                        <p className={styles.mainText2}>AI 호전도 모델</p>
                        {AIGraph[1] && <img className={styles.aiGraph} src={`data:image/jpeg;base64,${AIGraph[1].photo}`} alt="호전도 모델 그래프 사진" />}
                    </div>
                </div>
                <div className={styles.contentBox2}>
                    <div className={styles.lineBox}>
                        <div className={styles.adBox} onClick={() => navigate('/AdManagePage')}>
                            <p className={styles.mainText2}>현재 진행 중인 광고</p>
                            <div className={styles.adContentBox}>
                                {advertisements.length > 0 && (
                                    <img className={styles.image} src={`data:image/jpeg;base64,${advertisements[currentAdIndex].photo}`} alt={`Advertisement ${currentAdIndex + 1}`} />
                                )}
                                <div className={styles.buttonDiv}>
                                    <button className={styles.button} onClick={goToPrevAd}>이전</button>
                                    <button className={styles.button} onClick={goToNextAd}>다음</button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.graphBox}>
                            <p className={styles.mainText2}>현재 사용자 유형 분포도</p>
                            <div className={styles.graphContentBox} onClick={openModal}>
                                <canvas id="myChart"></canvas> {/* 막대 그래프를 그릴 캔버스 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default MainPage;
