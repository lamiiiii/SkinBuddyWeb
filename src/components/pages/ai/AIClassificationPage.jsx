import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./AIClassificationPage.module.css"; // AIClassificationPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function AIClassificationPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ learningRate: "", epochs: "", patience: "" });
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
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

    const onClickClassModel = () => {
        if (form.epochs && form.learningRate && form.patience) {
            const isConfirmed = window.confirm("여드름 분류 모델을 재학습하시겠습니까?");
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
                }, 1000);

                // 확인 받았을 경우
                const requestData = {
                    "learningRate": parseFloat(form.learningRate),
                    "Epochs": parseInt(form.epochs),
                    "Patience": parseInt(form.patience),
                }

                // API URL 설정
                const apiUrl = 'http://ceprj.gachon.ac.kr:60017/classification_train';

                axios.post(apiUrl, requestData)
                    .then(response => {
                        clearInterval(updateProgressInterval);
                        setLoading(false); setModalOpen(false);
                        setResultData(response.data);
                        setModalOpen(true); // 모달창에 재학습된 결과값 띄우기
                    })
                    .catch(error => {
                        clearInterval(updateProgressInterval);
                        setLoading(true); setModalOpen(true); setMessage("학과 서버의 GPU 메모리가 부족합니다. 잠시후 다시 시도해주세요.");
                        console.error('전송 실패: ', error);
                        setTimeout(() => {
                            setModalOpen(false);
                          }, 5000);
                    })
            }
        } else {
            alert("비어있는 입력값이 존재합니다. 입력해주세요.");
        }
    }

    // 엔터키 누르면 버튼 눌림
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickClassModel();
        }
    };

    return (
        <div className={styles.AIClassWrapper}>
            <Navbar selectedPage={"AI 모델"} />
            <div className={styles.AIClassContainer}>
                <p className={styles.mainText}>여드름 분류 모델 관리</p>
                <div className={styles.contentBox}>
                    <div className={styles.startContent}>
                        <p className={styles.contentText}>Learning Rate (학습률)</p>
                    </div>
                    <input
                        className={styles.inputBox}
                        type="search"
                        name="learningRate"
                        value={form.learningRate}
                        placeholder="Learning Rate"
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                    />
                    <div className={styles.startContent}>
                        <p className={styles.contentText}>Epochs (에포크)</p>
                    </div>
                    <input
                        className={styles.inputBox}
                        type="search"
                        name="epochs"
                        value={form.epochs}
                        placeholder="Epochs"
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                    />
                    <div className={styles.startContent}>
                        <p className={styles.contentText}>Patience</p>
                    </div>
                    <input
                        className={styles.inputBox}
                        type="search"
                        name="patience"
                        value={form.patience}
                        placeholder="Patience"
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button className={styles.modelButton} onClick={onClickClassModel}>모델 재학습</button>
                    {resultData && modalOpen && (
                        <div
                            className={styles.modalContainer}
                            ref={modalBackground}
                            onClick={(e) => {
                                if (e.target === modalBackground.current) {
                                    setModalOpen(false);
                                }
                            }}
                        >
                            <div className={styles.modalContent}>
                                <p className={styles.miniText}>AUC: {parseFloat(resultData.Auc).toFixed(5)}</p>
                                <p className={styles.idText}>ROC 곡선 아래의 면적으로, 1에 가까울수록 모델의 성능이 탁월</p>
                                <p className={styles.miniText}>F1Score (macro): {parseFloat(resultData.f1Score).toFixed(5)}</p>
                                <p className={styles.idText}>클래스별로 동일한 가중치를 적용하여 계산</p>
                                <p className={styles.miniText}>F1Score (micro): {parseFloat(resultData.f1ScoreM).toFixed(5)}</p>
                                <p className={styles.idText}>전체 데이터에 대해 계산</p>
                                <p className={styles.miniText}>F1Score (weighted): {parseFloat(resultData.f1ScoreW).toFixed(5)}</p>
                                <p className={styles.idText}>각 클래스의 지지도(실제 샘플 수)에 따라 가중 평균</p>
                                <button className={styles.modalCloseButton} onClick={() => {setModalOpen(false); window.location.reload();}}>확인</button>
                            </div>
                        </div>
                    )}
                    {loading && modalOpen && (
                        <div className={styles.modalContainer} ref={modalBackground}>
                            <div className={styles.modalContent}>
                                <p>{message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AIClassificationPage;
