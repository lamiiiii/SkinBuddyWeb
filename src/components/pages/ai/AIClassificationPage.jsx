import { React, useState, useEffect } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./AIClassificationPage.module.css"; // AIClassificationPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import


function AIClassificationPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState();
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

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

    return (
        <div className={styles.AIClassWrapper}>
            <Navbar></Navbar>
            <div className={styles.AIClassContainer}>
                <p className={styles.mainText}>여드름 분류 모델 관리</p>
            </div>
        </div>
    );
}

export default AIClassificationPage;