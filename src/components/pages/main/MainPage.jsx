import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./MainPage.module.css"; // MainPage.module.css import
import axios from "axios"; // api 통신을 위해 axios install & import
import {
    BarChart, Bar,
    Cell, XAxis,
    YAxis, CartesianGrid,
    Tooltip, Legend,
    ResponsiveContainer
} from 'recharts'; // 그래프를 위해 import
import { Chart, registerables } from "chart.js"; // 차트 importnpm install react-chartjs-2 chart.js
import customBarChart from "../../auth/BarChart"; // BarChart 불러오기

function MainPage(props) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 메인페이지 정보 반환
    const returnMainInformation = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/home/user'; // 메인페이지 정보 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('메인페이지 정보 반환 응답: ', response.data);
                setData(response.data);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('메인페이지 정보 반환 오류 발생: ', error);
            })
    }
    
    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage"); // 로그인 페이지로 이동
        } else {
            returnMainInformation();
        }
    }, []);

    const typeData = {
        DRNT: data.DRNT,
        DRNW: data.DRNW,
        DRPT: data.DRPT,
        DRPW: data.DRPW,
        DSNT: data.DSNT,
        DSNW: data.DSNW,
        DSPT: data.DSPT,
        DSPW: data.DSPW,
        ORNT: data.ORNT,
        ORNW: data.ORNW,
        ORPT: data.ORPT,
        ORPW: data.ORPW,
        OSNT: data.OSNT,
        OSNW: data.OSNW,
        OSPT: data.OSPT,
        OSPW: data.OSPW,
    };

    return (

        <div className={styles.mainWrapper}>
            <Navbar></Navbar>
            <div className={styles.mainContainer}>
                <p className={styles.mainText}>현재 가입자 수</p>
                <div className={styles.contentBox}>{data.userCount}</div>
                <div className={styles.contentBox2}>
                    <div className={styles.adBox}>
                        <p className={styles.mainText2}>현재 진행 중인 광고</p>
                        <div className={styles.adContentBox}></div>
                    </div>
                    <div className={styles.graphBox}>
                        <p className={styles.mainText2}>현재 사용자 유형 분포도</p>
                        <div className={styles.graphContentBox}>
                            <img style={{ width: '100%', height: '100%'}} src="/img/graph.png"></img>
                            {/* <BarChart data={typeData} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;