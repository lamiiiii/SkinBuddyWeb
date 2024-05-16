import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
    useParams,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./AdManagePage.module.css"; // AdManagePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function AdManagePage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]); // 트러블 분석 결과 데이터 받아오기

    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 광고 목록 반환
    const returnAdLsit = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/advertise/id_list'; // 광고 목록 반환 API

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('광고 목록 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            returnAdLsit();
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, []);

    return (
        <div className={styles.AdManageWrapper}>
            <Navbar selectedPage={"광고 관리"}></Navbar>
            <div className={styles.AdManageContainer}>
                <p className={styles.mainText}>광고 관리</p>
            </div>
        </div>
    );
}

export default AdManagePage;