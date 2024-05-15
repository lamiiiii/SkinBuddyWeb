import { React, useState, useEffect } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./AIImprovementPage.module.css"; // AIImprovementPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import


function AIImprovementPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ learningRate: "", weightDecay: "", epochs: "", patience: "" });
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장
    const [noticeMessage, setNoticeMessage] = useState([]); // 알림 메세지

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
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickImproveModel = () => {
        const isConfirmed = window.confirm("여드름 호전도 개선 모델을 재학습하시겠습니까?");
        if (isConfirmed) {
            // 확인 받았을 경우
            const requestData = {
                "learningRate": form.learningRate,
                weightDecay: form.weightDecay,
                "Epochs": form.epochs,
                "Patience": form.patience,
            }



        }
    }

        // 엔터키 누르면 버튼 눌림
        const handleKeyDown = (event) => {
            if (event.keyCode === 13) {
                onClickImproveModel();
            }
        };
        
    return (
        <div className={styles.AIImproveWrapper}>
            <Navbar selectedPage={"AI 모델"}></Navbar>
            <div className={styles.AIImproveContainer}>
                <p className={styles.mainText}>여드름 호전도 개선 모델 관리</p>
                <div className={styles.contentBox}>
                    <div className={styles.startContent}><p className={styles.contentText}>Learning Rate (학습률)</p></div>
                    <input className={styles.inputBox} type="search" name="learningRate" value={form.learningRate} placeholder="Learning Rate" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>Weight Decay (가중치 감쇠)</p></div>
                    <input className={styles.inputBox} type="search" name="weightDecay" value={form.weightDecay} placeholder="Weight Decay" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>Epochs (에포크)</p></div>
                    <input className={styles.inputBox} type="search" name="epochs" value={form.epochs} placeholder="Epochs" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>Patience</p></div>
                    <input className={styles.inputBox} type="search" name="patience" value={form.patience} placeholder="Patience" onChange={onChange} onKeyDown={handleKeyDown}></input>
                    <p className={styles.noticeText}>{noticeMessage}</p>
                    <button className={styles.modelButton} onClick={onClickImproveModel}>모델 재학습</button>
                </div>
                </div>
        </div>
    );
}

export default AIImprovementPage;