import { React, useState, useEffect, useRef } from "react";
import { /* 페이지 이동을 위해 */
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./AIImprovementPage.module.css"; // AIImprovementPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import


function AIImprovementPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ learningRate: "", weightDecay: "", epochs: "", patience: "" });
    // const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장
    const [resultData, setResultData] = useState(null); // 재학습 결과값
    const [modalOpen, setModalOpen] = useState(false); // 모달창 오픈을 위함
    const modalBackground = useRef(); // 모달창 바깥에 클릭 시 닫기를 위함
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // 페이지 로드 시 로그인 상태 확인
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage"); // 로그인 페이지로 이동
        } else {
        }
    }, [isLoggedIn, navigate]);

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const name = e.target.name;
        const value = e.target.value;
        // 숫자가 아닌 값이 입력되었는지 검사
        if (!isNaN(value) || value === "") {
            setForm({
                ...form,
                [name]: value
            });
        } else {
            alert("숫자를 입력해주세요.");
        }
    };

    const onClickImproveModel = () => {
        if (form.learningRate && form.epochs && form.weightDecay && form.patience) {
            let time = 0;
            const calculatedTime = 500 * form.epochs; // 에포크 수에 따른 시간 설정
            time = calculatedTime;

            const isConfirmed = window.confirm("여드름 호전도 개선 모델을 재학습하시겠습니까?");
            if (isConfirmed) {
                setLoading(true); setModalOpen(true); setMessage("모델 재학습을 진행 중입니다. 잠시만 기다려주세요.");

                // 진행률 메시지 업데이트를 위한 변수
                let progress = 0;
                const updateProgressInterval = setInterval(() => {
                    const randomProgress = Math.floor(Math.random() * 5); // 0부터 5까지의 난수 생성
                    progress += randomProgress;
                    setMessage(`모델 재학습을 진행 중입니다. 잠시만 기다려주세요. 진행률: ${progress}%`);
                    if (progress >= 95) {
                        clearInterval(updateProgressInterval);
                    }
                }, time);

                // 확인 받았을 경우
                const requestData = {
                    "learningRate": parseFloat(form.learningRate),
                    "weightDecay": parseFloat(form.weightDecay),
                    "Epochs": parseInt(form.epochs),
                    "Patience": parseInt(form.patience),
                }

                // API URL 설정
                const apiUrl = 'http://ceprj.gachon.ac.kr:60017/detection_train'; // 호전도 모델 API

                axios.post(apiUrl, requestData)
                    .then(response => {
                        clearInterval(updateProgressInterval);
                        setLoading(false); setModalOpen(false);
                        setResultData(response.data);
                        setModalOpen(true); // 모달창에 재학습된 결과값 띄우기

                        // 받은 그래프 사진 서버에 저장해서 메인페이지에 띄우기
                        graphSave(response.data.photo);
                    })
                    .catch(error => {
                        clearInterval(updateProgressInterval);
                        setLoading(true); setModalOpen(true); setMessage("학과 서버의 GPU 메모리가 부족합니다. 잠시후 다시 시도해주세요.");
                        console.error('전송 실패: ', error);
                    })
            }
        } else {
            alert("비어있는 입력값이 존재합니다. 입력해주세요.");
        }
    }

    // 받은 그래프 사진 서버에 저장해서 메인페이지에 띄우기
    const graphSave = (photo) => {

        // API URL 설정
        const apiUrl = 'http://52.79.237.164:3000/manager/ai/save/detectionGrp'; // 그래프 저장 API
        const formData = new FormData();

        // base64 문자열을 Blob으로 변환
        const byteCharacters = atob(photo);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        formData.append('photoFile', blob, 'detectionGraph.jpg');

        // axios를 이용하여 PUT 요청 보내기
        axios.put(apiUrl, formData)
            .then(response => {
                if (response.data.property !== 200) {
                    console.log("호전도 그래프 저장 실패");
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('호전도 그래프 저장 오류 발생: ', error);
                alert('호전도 그래프 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
            });

    }

    // 엔터키 누르면 버튼 눌림
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickImproveModel();
        }
    };

        // form에 하나라도 입력한 경우에 목록 버튼 누르면 경고 알림 확인 받음
        const handleNavigate = () => {
            // form에 값이 있는지 확인
            if (Object.values(form).some(value => value.length > 0)) {
                const confirmNavigate = window.confirm("작성중인 내용이 지워질 수 있습니다. 계속하시겠습니까?");
                if (confirmNavigate) {
                    navigate('/AIImprovementPage');
                    window.location.reload();
                }
            } else {
                navigate('/AIImprovementPage');
                window.location.reload();
            }
        };

    return (
        <div className={styles.AIImproveWrapper}>
            <Navbar selectedPage={"AI 모델"}></Navbar>
            <div className={styles.AIImproveContainer}>
                <p className={styles.mainText} onClick={handleNavigate}>여드름 호전도 개선 모델 관리</p>
                <div className={styles.contentBox}>
                    <div className={styles.startContent}><p className={styles.contentText}>Learning Rate (학습률)</p></div>
                    <input className={styles.inputBox} type="search" name="learningRate" value={form.learningRate} placeholder="Learning Rate" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>Weight Decay (가중치 감쇠)</p></div>
                    <input className={styles.inputBox} type="search" name="weightDecay" value={form.weightDecay} placeholder="Weight Decay" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>Epochs (에포크)</p></div>
                    <input className={styles.inputBox} type="search" name="epochs" value={form.epochs} placeholder="Epochs" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>Patience</p></div>
                    <input className={styles.inputBox} type="search" name="patience" value={form.patience} placeholder="Patience" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <button className={styles.modelButton} onClick={onClickImproveModel}>모델 재학습</button>
                    {
                        resultData && modalOpen && (
                            <div
                                className={styles.modalContainer}
                                ref={modalBackground} onClick={e => {
                                    if (e.target === modalBackground.current) {
                                        setModalOpen(false);
                                    }
                                }}
                            >
                                <div className={styles.modalContent}>
                                    <div className={styles.modalBox}>
                                        <div className={styles.modalContentBox}>
                                            <p className={styles.miniText}>AvgPrecision: {parseFloat(resultData.avgPrecision).toFixed(5)}</p>
                                            <p className={styles.idText}>정밀도(Precision)는 모델이 탐지한 객체 중에서 실제로 올바른 객체의 비율이다.</p>
                                            <p className={styles.miniText}>AvgRecall: {parseFloat(resultData.avgRecall).toFixed(5)}</p>
                                            <p className={styles.idText}>재현율(Recall)은 실제 객체 중에서 모델이 올바르게 탐지한 비율이다.</p>
                                        </div>
                                        <div className={styles.modalContentBox}>
                                            <p className={styles.miniText}>호전도 모델 그래프</p>
                                            <img className={styles.image} src={`data:image/jpeg;base64,${resultData.photo}`} alt="호전도 모델 그래프 사진" />
                                        </div>
                                    </div>
                                    <div className={styles.buttonDiv}><button className={styles.modalCloseButton} onClick={() => { setModalOpen(false); window.location.reload(); }}>확인</button></div>
                                </div>
                            </div>
                        )
                    }
                    {loading && modalOpen && (
                        <div className={styles.modalContainer} ref={modalBackground}>
                            <div className={styles.modalContent}>
                                <p>{message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default AIImprovementPage;