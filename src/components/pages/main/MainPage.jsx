import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../auth/Navbar";
import Footer from "../../auth/Footer";
import styles from "./MainPage.module.css";
import axios from "axios";
import Chart from 'chart.js/auto';
import Modal from "../../auth/Modal";

function MainPage(props) {
    const navigate = useNavigate();
    const [data, setData] = useState([]); // 메인 페이지 정보 
    const [recordData, setRecordData] = useState(0); // 진단 기록 정보
    const [troubleCount, setTroubleCount] = useState(0); // 트러블 진단 기록
    const [improvementCount, setImprovementCount] = useState(0); // 호전도 진단 기록
    const [advertisements, setAdvertisements] = useState([]); // 광고 사진
    const [AIGraph, setAIGraph] = useState([]); // AI 그래프 사진
    const [currentAdIndex, setCurrentAdIndex] = useState(0); // 슬라이드를 위한 현재 광고 인덱스 번호
    const [intervalId, setIntervalId] = useState(null); // 슬라이드를 위한 인터벌
    const autoSlideTimeoutRef = useRef(null); // 자동 슬라이드 재실행을 위한 사용자 활동 감지
    const [noticeData, setNoticeData] = useState([]); // 공지사항 정보 반환
    const [qnaData, setQnaData] = useState([]); // Q&A 정보 반환
    const [unansweredCount, setUnansweredCount] = useState(0); // 답변 대기 중인 Q&A 개수
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 관리자 계정 아이디
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 현재 로그인 여부
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 오픈 여부
    const [modalImageSrc, setModalImageSrc] = useState(""); // 모달에 보낼 사진

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage");
        } else {
            // 페이지 처음 로드할 때 스크롤 위치 초기화
            window.scrollTo({ top: 0 });
            returnMainInformation();
            returnAIGraph();
            returnAdList();
            returnUserRecordList();
            returnNoticeList();
            returnQnAList();
        }
    }, []);

    useEffect(() => { // 반복 렌더링
        if (advertisements.length > 1) {
            startAutoSlide();
        }
    }, [advertisements]);

    // 메인 페이지 정보 반환
    const returnMainInformation = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/home/user';
        axios.get(apiUrl)
            .then(response => {
                setData(response.data);
                drawBarChart(response.data);
            })
            .catch(error => {
                console.error('메인페이지 정보 반환 오류 발생: ', error);
            })
    }

    // 피부 유형 합계 계산 함수
    const calculateTotalSkinTypes = (data) => {
        const skinTypes = [
            'DRNT', 'DRNW', 'DRPT', 'DRPW',
            'DSNT', 'DSNW', 'DSPT', 'DSPW',
            'ORNT', 'ORNW', 'ORPT', 'ORPW',
            'OSNT', 'OSNW', 'OSPT', 'OSPW'
        ];

        return skinTypes.reduce((total, type) => {
            return total + (data[type] || 0);
        }, 0);
    };

    // 피부 유형의 합계 계산
    const totalSkinTypes = calculateTotalSkinTypes(data);

    const returnAIGraph = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/ai/get';
        axios.get(apiUrl)
            .then(response => {
                setAIGraph(response.data.data);
            })
            .catch(error => {
                console.error('AI 결과 그래프 반환 오류 발생: ', error);
            })
    }

    // 사용자 진단 기록 목록 반환 
    const returnUserRecordList = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/user/skin/record/list'; // 사용자 진단 기록 목록 반환 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, { userId: "all" }) // 모든 진단기록
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                const records = response.data.list;
                setRecordData(records.length);
                setTroubleCount(records.filter(record => record.aiType === "AI 트러블 분석").length);
                setImprovementCount(records.filter(record => record.aiType === "AI 호전도 분석").length);

            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('사용자 진단 기록 반환 오류 발생: ', error);
            })
    }

    // 광고 반환 함수
    const returnAdList = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/advertise/list';
        // axios.get(apiUrl)
        //     .then(response => {
        //         setAdvertisements(response.data.data);
        //     })
        //     .catch(error => {
        //         console.error('광고 목록 반환 오류 발생: ', error);
        //     });
    };

    // 광고 자동 슬라이드 
    const startAutoSlide = () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        const id = setInterval(() => {
            setCurrentAdIndex(prevIndex => (prevIndex + 1) % advertisements.length);
        }, 5000);
        setIntervalId(id);
    }

    // 움직임이 감지되면 광고 자동 슬라이드 멈춤
    const stopAutoSlide = () => {
        clearInterval(intervalId);
        setIntervalId(null);
    }

    // 움직임이 없으면 다시 자동 슬라이드 실행
    const resetAutoSlideTimeout = () => {
        if (autoSlideTimeoutRef.current) {
            clearTimeout(autoSlideTimeoutRef.current);
        }
        autoSlideTimeoutRef.current = setTimeout(startAutoSlide, 3000);
    };

    // 이전 광고로 넘기는 버튼 실행 함수
    const goToPrevAd = () => {
        setCurrentAdIndex(prevIndex => (prevIndex === 0 ? advertisements.length - 1 : prevIndex - 1));
        stopAutoSlide();
        resetAutoSlideTimeout();
    }

    // 다음 광고로 넘기는 버튼 실행 함수
    const goToNextAd = () => {
        setCurrentAdIndex(prevIndex => (prevIndex + 1) % advertisements.length);
        stopAutoSlide();
        resetAutoSlideTimeout();
    }

    // 공지사항 목록 반환
    const returnNoticeList = () => {
        const apiUrl = 'http://52.79.237.164:3000/user/Notice/list'; // 공지사항 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                setNoticeData(response.data.list);
                console.log(noticeData)
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('공지사항 목록 반환 오류 발생: ', error);
            })
    }

    // QnA 목록 반환
    const returnQnAList = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/question/list'; // QnA 목록 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                const qnaList = response.data.list;
                setQnaData(qnaList);
                console.log(qnaData)

                // 답변 대기인 Q&A 수를 셈
                const unanswered = qnaList.filter(item => !item.answer).length;
                setUnansweredCount(unanswered);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('QnA 목록 반환 오류 발생: ', error);
            })
    }

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
                        data.DRNT, data.DRNW, data.DRPT, data.DRPW,
                        data.DSNT, data.DSNW, data.DSPT, data.DSPW,
                        data.ORNT, data.ORNW, data.ORPT, data.ORPW,
                        data.OSNT, data.OSNW, data.OSPT, data.OSPW
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
                <p className={styles.titleText}>관리자 {currentId} 님 환영합니다.</p>
                <div className={styles.lineBox}>
                    {/* 첫번째 라인 - 사용자 현황*/}
                    <p className={styles.mainText}>사용자 현황</p>
                    <hr className={styles.divider}></hr>
                    <div className={styles.inlineBox}>
                        <div className={styles.smallBox}>
                            <p className={styles.mainText2}>현재 가입자</p>
                            <div className={styles.contentBox} onClick={() => navigate('/UserManagePage')}>{data.userCount}</div>
                        </div>
                        <div className={styles.smallBox}>
                            <p className={styles.mainText2}>AI 진단 기록</p>
                            <div className={styles.contentBox} onClick={() => navigate('/UserRecordManagePage')}>{recordData}</div>
                            <p style={{ marginBottom: "0", fontWeight: "bold", width: "50%" }}>트러블 분석 &nbsp;|&nbsp; {troubleCount}</p>
                            <p style={{ marginBottom: "0", fontWeight: "bold", width: "50%" }}>호전도 분석 &nbsp;|&nbsp; {improvementCount}</p>
                        </div>
                        <div className={styles.smallBox}>
                            <p className={styles.mainText2}>피부 MBTI 검사</p>
                            <div className={styles.contentBox} style={{ cursor: 'default' }}>{totalSkinTypes}</div>
                            <p style={{ color: "grey" }}>검사 미완료 사용자 &nbsp;|&nbsp; {data.userCount - totalSkinTypes}</p>
                        </div>
                        <div className={styles.graphBox}>
                            <p className={styles.mainText2}>사용자 피부 유형 분포도</p>
                            <div className={styles.graphContentBox}>
                                <canvas id="myChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.middleSet}>
                    {/* 두번째 라인 - 광고 현황 & Q&A 현황 */}
                    <div className={styles.middleLineBox}>
                        <p className={styles.mainText}>광고 현황</p>
                        <hr className={styles.divider}></hr>
                        <div className={styles.inlineBox}>
                            <div className={styles.adBox}>
                                <p className={styles.mainText2} onClick={() => navigate('/AdManagePage')} style={{ cursor: 'pointer' }}>진행 중인 광고 &nbsp;|&nbsp; {advertisements.length}</p>
                                <div className={styles.adContentBox}>
                                    {advertisements.length > 0 ? (
                                        <img className={styles.image} src={`data:image/jpeg;base64,${advertisements[currentAdIndex].photo}`} alt={`Advertisement ${currentAdIndex + 1}`} onClick={() => openModal(`data:image/jpeg;base64,${advertisements[currentAdIndex].photo}`)} />
                                    ) : <p style={{ margin: "10%", fontWeight: "bold", width: "100%" }}>현재 진행 중인 광고 없음</p>
                                    }
                                    <div className={styles.buttonDiv}>
                                        <button className={styles.button} onClick={goToPrevAd}>이전</button>
                                        <button className={styles.button} onClick={goToNextAd}>다음</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.middleLineBox}>
                        <p className={styles.mainText}>커뮤니티 현황</p>
                        <hr className={styles.divider}></hr>
                        <div className={styles.inlineBox}>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2} onClick={() => navigate('/NoticeManagePage')} style={{ cursor: 'pointer' }}>공지사항 &nbsp;|&nbsp; {noticeData.length}</p>
                                <ul className={styles.lists}>
                                    {noticeData.slice(0, 5).map((notice) => (
                                        <li className={styles.listContent} key={notice.noticeId} onClick={() => navigate(`/NoticeUpdatePage/${notice.noticeId}`)}>
                                            <span style={{ fontWeight: "bold" }}>No.{notice.noticeId}  &nbsp;</span>
                                            {notice.content.length > 8
                                                ? `${notice.content.substring(0, 8)}...`
                                                : (notice.content.includes(':') ? notice.content.split(':')[0] : notice.content)}
                                            <span> &emsp;({notice.reviceDay})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.smallBox}>
                                <p className={styles.mainText2} onClick={() => navigate('/QnaManagePage')} style={{ cursor: 'pointer' }}>Q&A &nbsp;|&nbsp; {qnaData.length}</p>
                                <p style={{ color: "red", margin: "1%" }}>답변 대기 중인 질문 &nbsp;|&nbsp; {unansweredCount}</p>
                                <ul className={styles.lists}>
                                    {qnaData.filter(qna => !qna.answer).slice(0,5).map((qna) => (
                                        <li className={styles.listContent} key={qna.questionId} onClick={() => navigate(`/QnaAnswerPage/${qna.questionId}`)}>
                                            <span style={{ fontWeight: "bold" }}>No.{qna.questionId}  &nbsp;</span>
                                            {qna.question.length > 8
                                                ? `${qna.question.substring(0, 8)}...`
                                                : (qna.question.includes('\n') ? qna.question.split('\n')[0] : qna.question)}
                                            <span> &emsp;({qna.createday})</span>
                                        </li>
                                    ))}
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
                            <p className={styles.mainText2} onClick={() => navigate('/AIClassificationPage')} style={{ cursor: 'pointer' }}>AI 분류 모델</p>
                            {AIGraph[0] && <img className={styles.aiGraph} src={`data:image/jpeg;base64,${AIGraph[0].photo}`} alt="분류 모델 그래프 사진" onClick={() => openModal(`data:image/jpeg;base64,${AIGraph[0].photo}`)} />}
                        </div>
                        <div className={styles.smallBox}>
                            <p className={styles.mainText2} onClick={() => navigate('/AIImprovementPage')} style={{ cursor: 'pointer' }}>AI 호전도 모델</p>
                            {AIGraph[1] && <img className={styles.aiGraph} src={`data:image/jpeg;base64,${AIGraph[1].photo}`} alt="호전도 모델 그래프 사진" onClick={() => openModal(`data:image/jpeg;base64,${AIGraph[1].photo}`)} />}
                        </div>
                    </div>
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer />
            <Modal isOpen={isModalOpen} onClose={closeModal} imageSrc={modalImageSrc} />
        </div>
    );
}

export default MainPage;
