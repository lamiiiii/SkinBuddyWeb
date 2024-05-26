import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../auth/Navbar";
import Footer from "../../auth/Footer";
import styles from "./GuestPage.module.css";
import Chart from 'chart.js/auto';
import Modal from "../../auth/Modal";
import { useNavigate } from "react-router-dom";

function GuestPage(props) {
    const navigate = useNavigate();
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 관리자 계정 아이디
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 가져오기
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 오픈 여부
    const [modalImageSrc, setModalImageSrc] = useState(""); // 모달에 보낼 사진

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        // 페이지 처음 로드할 때 스크롤 위치 초기화
        window.scrollTo({ top: 0 });
        drawBarChart();
    }, []);

    // 유형 막대 그래프 그리기
    const drawBarChart = (data) => {
        const ctx = document.getElementById('myChart').getContext('2d');
        if (window.barChart !== undefined) {
            window.barChart.destroy();
        }
        window.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['DRNT', 'DRNW', 'DRPT', 'DRPW', 'DSNT', 'DSNW', 'DSPT', 'DSPW', 'ORNT', 'ORNW', 'ORPT', 'ORPW', 'OSNT', 'OSNW', 'OSPT', 'OSPW'],
                datasets: [{
                    label: 'Data',
                    data: [
                        5, 7, 2, 1,
                        6, 10, 2, 21,
                        3, 6, 0, 9,
                        15, 4, 8, 1,
                    ],
                    backgroundColor: [
                        '#BCD3ED', '#B3A8D3', '#41A3C2', '#F16789',
                        '#F49AC1', '#F7CDC5', '#D391C0', '#F16789',
                        '#CCE29D', '#9FD5BC', '#B5D336', '#83C15D',
                        '#FDD6B9', '#FFE3A3', '#FDD6B9', '#FCB85C'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0)',
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
                                weight: 'bold'
                            }
                        }
                    }
                }
            }

        });
    };

    // 모달 열기
    const openModal = (imageSrc) => {
        setModalImageSrc(imageSrc);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageSrc("");
    };

    return (
        <div className={styles.mainWrapper}>
            <Navbar />
            <div className={styles.mainContainer}>
                <p style={{color: 'red'}}> 환영합니다, Guest님. &nbsp; 이 페이지는 예시 정보를 보여주고 있습니다. &nbsp; 더 많은 정보를 확인하시려면 로그인해주세요. </p>
                <div className={styles.middleSet}>
                    <div className={styles.box}>
                        <p className={styles.mainText}>관리자 현황</p>
                        <hr className={styles.divider}></hr>
                        <p className={styles.mainText2}>관리자 &nbsp;|&nbsp; N</p>
                        <ul className={styles.lists} style={{ padding: '1%' }}>
                            <li className={styles.listContent} style={{ marginBottom: '10%' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span>Guest1 &emsp;</span><span>게스트1</span></li>
                            <li className={styles.listContent} style={{ marginBottom: '10%' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span>Guest2 &emsp;</span><span>게스트2</span></li>
                            <li className={styles.listContent} style={{ marginBottom: '10%' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span>Guest3 &emsp;</span><span>게스트3</span></li>
                            <li className={styles.listContent} style={{ marginBottom: '10%' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span>Guest4 &emsp;</span><span>게스트4</span></li>
                            <li className={styles.listContent} style={{ marginBottom: '10%' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span>Guest5 &emsp;</span><span>게스트5</span></li>
                            <li className={styles.listContent} style={{ marginBottom: '10%' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span>Guest6 &emsp;</span><span>게스트6</span></li>
                            <li className={styles.listContent} style={{ marginBottom: '10%' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span>Guest7 &emsp;</span><span>게스트7</span></li>
                        </ul>
                    </div>
                    <div className={styles.box2}>
                        {/* 첫번째 라인 - 사용자 현황*/}
                        <p className={styles.mainText}>사용자 현황</p>
                        <hr className={styles.divider}></hr>
                        <div className={styles.inlineBox}>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2}>현재 가입자</p>
                                <div className={styles.contentBox} onClick={() => { alert("로그인 후에 이용해주세요.") }}>N</div>
                                <p style={{ marginBottom: "0", fontWeight: 'bold' }}>최근 가입자 아이디</p>
                                <p>Guest</p>

                            </div>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2}>AI 진단 기록</p>
                                <div className={styles.contentBox} style={{ color: 'grey' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}>N</div>
                                <p style={{ marginBottom: "0", fontWeight: "bold" }}>트러블 분석 &nbsp;|&nbsp; N</p>
                                <p style={{ marginBottom: "0", fontWeight: "bold" }}>호전도 분석 &nbsp;|&nbsp; N</p>
                            </div>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2}>피부 MBTI 검사</p>
                                <div className={styles.contentBox} style={{ color: 'grey', cursor: 'default' }}>N</div>
                                <p style={{ color: "grey" }}>검사 미완료 사용자 &nbsp;|&nbsp; N</p>
                            </div>
                            <div className={styles.graphBox}>
                                <p className={styles.mainText2}>사용자 피부 유형 분포도</p>
                                <div className={styles.graphContentBox}>
                                    <canvas id="myChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div></div>
                <div className={styles.middleSet}>
                    {/* 두번째 라인 - 광고 현황 & 커뮤니티 현황 */}
                    <div className={styles.middleLineBox}>
                        <p className={styles.mainText}>광고 현황</p>
                        <hr className={styles.divider}></hr>
                        <div className={styles.inlineBox}>
                            <div className={styles.adBox}>
                                <p className={styles.mainText2} style={{ cursor: 'pointer' }}>진행 중인 광고 &nbsp;|&nbsp; N</p>
                                <div className={styles.adContentBox}>
                                    <img className={styles.image} src={'/img/photo1.png'} alt={`Advertisement Example`} onClick={() => openModal('/img/photo1.png')} />
                                    <div className={styles.buttonDiv}>
                                        <button className={styles.button} onClick={() => { alert("로그인 후에 이용해주세요.") }}>이전</button>
                                        <button className={styles.button} onClick={() => { alert("로그인 후에 이용해주세요.") }}>다음</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 두번째 라인 - 광고 현황 & 커뮤니티 현황 */}
                    <div className={styles.middleLineBox2}>
                        <p className={styles.mainText}>커뮤니티 현황</p>
                        <hr className={styles.divider}></hr>
                        <div className={styles.inlineBox}>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2} onClick={() => { alert("로그인 후에 이용해주세요.") }} style={{ cursor: 'pointer' }}>공지사항 &nbsp;|&nbsp; N</p>
                                <ul className={styles.lists}>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}>
                                        <span style={{ fontWeight: "bold" }}>No.1  &emsp;</span>공지사항입니다.<span> &emsp;2024-05-10</span>
                                    </li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}>
                                        <span style={{ fontWeight: "bold" }}>No.2  &emsp;</span>공지사항1<span> &emsp;2024-05-11</span>
                                    </li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}>
                                        <span style={{ fontWeight: "bold" }}>No.3  &emsp;</span>공지사항2<span> &emsp;2024-05-13</span>
                                    </li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}>
                                        <span style={{ fontWeight: "bold" }}>No.4  &emsp;</span>공지사항3<span> &emsp;2024-05-19</span>
                                    </li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}>
                                        <span style={{ fontWeight: "bold" }}>No.5  &emsp;</span>공지사항4<span> &emsp;2024-05-20</span>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2} style={{ color: "red", margin: "1%" }}>답변 대기중인 질문 &nbsp;|&nbsp; N</p>
                                <p style={{ cursor: 'pointer', margin: "1%" }} onClick={() => { alert("로그인 후에 이용해주세요.") }}>Q&A &nbsp;|&nbsp; N</p>
                                <ul className={styles.lists}>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.12  &nbsp;</span>질문입니다.<span> &emsp;2024-04-11</span></li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.13  &nbsp;</span>질문입니다.<span> &emsp;2024-04-29</span></li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.14  &nbsp;</span>질문입니다.<span> &emsp;2024-05-03</span></li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.15  &nbsp;</span>질문입니다.<span> &emsp;2024-05-12</span></li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.16  &nbsp;</span>질문입니다.<span> &emsp;2024-05-22</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.inlineBox}>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2} style={{ cursor: 'pointer' }}>이용약관</p>
                                <div className={styles.lists}>
                                    <p>이용 약관 최종 수정일: 2024년 5월 20일 1. 소개 이용 약관(이하 "약관")은 본 앱(이하 "서비스")을 이용하는 모든 사용자(이하 "사용자")와 본 서비스를 제공하는 회사(이하 "회사") 간의 권리, 의무 및 책임을 규정합니다. 서비스를 이용하기 전에 본 ...</p>
                                </div>
                            </div>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2} style={{ color: "blue", margin: "1%" }}>답변 완료된 질문 &nbsp;|&nbsp; N</p>
                                <p style={{ cursor: 'pointer', margin: "1%" }} onClick={() => { alert("로그인 후에 이용해주세요.") }}>Q&A &nbsp;|&nbsp; N</p>
                                <ul className={styles.lists}>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.07  &nbsp;</span>질문입니다.<span> &emsp;2024-04-01</span></li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.08  &nbsp;</span>질문입니다.<span> &emsp;2024-04-02</span></li>
                                    <li className={styles.listContent} onClick={() => { alert("로그인 후에 이용해주세요.") }}><span style={{ fontWeight: "bold" }}>No.09  &nbsp;</span>질문입니다.<span> &emsp;2024-04-03</span></li>
                               </ul>
                            </div>
                        </div>
                        <div className={styles.inlineBox}>

                        </div>
                    </div>
                </div>
                <div className={styles.lineBox}>
                    {/* 세번째 라인 - AI 모델 현황 */}
                    <p className={styles.mainText}>AI 모델 재학습 결과</p>
                    <hr className={styles.divider}></hr>
                    <div className={styles.inlineBox}>
                        <div className={styles.smallBox}>
                            <p className={styles.mainText2} style={{ cursor: 'pointer' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}>AI 분류 모델</p>
                            <p style={{ fontSize: '15px', margin: '5%' }}>로그인 후에 확인하실 수 있습니다.</p>
                        </div>
                        <div className={styles.smallBox}>
                            <p className={styles.mainText2} style={{ cursor: 'pointer' }} onClick={() => { alert("로그인 후에 이용해주세요.") }}>AI 호전도 모델</p>
                            <p style={{ fontSize: '15px', margin: '5%' }}>로그인 후에 확인하실 수 있습니다.</p>
                        </div>
                    </div>
                </div>
                <button className={styles.loginButton} onClick={() => navigate('/LoginPage')}>
                    로그인하러 가기
                </button>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer />
            <Modal isOpen={isModalOpen} onClose={closeModal} imageSrc={modalImageSrc} />
        </div>
    );
}

export default GuestPage;
