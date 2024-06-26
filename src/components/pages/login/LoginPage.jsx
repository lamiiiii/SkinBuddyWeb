import { React, useState, useEffect } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./LoginPage.module.css"; // LoginPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ managerId: "", managerPw: "" }); // 로그인 입력 정보
    const [noticeMessage, setNoticeMessage] = useState([]); // 알림 메세지
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 가져오기

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            // 로그인된 상태에서는 접근 필요 없기 때문에 메인페이지로 이동
            navigate('/MainPage');
        } else {
            // 페이지 처음 로드할 때 스크롤 위치 초기화
            window.scrollTo({ top: 0 });
        }
    }, []);

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickLogin = () => { // 로그인 버튼 누르면 실행할 함수
        if (form.managerId && form.managerPw) {
            setNoticeMessage("");
            const requestData = { // 전송할 데이터
                managerId: form.managerId,
                psword: form.managerPw,
            };

            // API URL 설정
            // const apiUrl = 'https://hugopmbque.execute-api.ap-northeast-2.amazonaws.com/default/manager_login'; // 서버리스 방식 추후 시도 (CORS 문제)
            const apiUrl = 'http://52.79.237.164:3000/manager/login'; // 로그인 API URL

            // axios를 이용하여 POST 요청 보내기
            axios.post(apiUrl, requestData)
                .then(response => {
                    // 요청이 성공한 경우 응답한 데이터 처리
                    if (response.data["property"] === 200 && response.data["success"] === true && response.data["message"] === "로그인 성공") {
                        localStorage.setItem("ID", form.managerId); // 로그인 정보 유지를 위한 저장
                        localStorage.setItem("isLoggedIn", true); // 로그인 여부 저장
                        navigate('/MainPage');
                    }
                    else if (response.data["property"] === 301) {
                        alert(`${response.data["message"]}`);
                        localStorage.setItem("isLoggedIn", false); // 로그인 여부 저장
                        window.location.reload(); // 페이지 새로고침
                    }
                    else {
                        alert("로그인에 실패하였습니다. 다시 시도해주세요.");
                        localStorage.setItem("isLoggedIn", false); // 로그인 여부 저장
                        window.location.reload(); // 페이지 새로고침
                    }
                })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('로그인 전송 실패: ', error);
                    localStorage.setItem("isLoggedIn", false); // 로그인 여부 저장
                    alert('로그인에 실패하였습니다. 관리자에게 문의해주세요.');
                })
        } else if (!form.managerId) {
            setNoticeMessage("아이디를 입력해주세요.");
            localStorage.setItem("isLoggedIn", false); // 로그인 여부 저장
        } else {
            setNoticeMessage("비밀번호를 입력해주세요.");
            localStorage.setItem("isLoggedIn", false); // 로그인 여부 저장
        }
    }

    // 엔터키 누르면 버튼 눌림
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickLogin();
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <Navbar></Navbar>
            <div className={styles.loginContainer}>
                <p className={styles.mainText}>관리자 로그인</p>
                <div className={styles.contentBox}>
                    <input className={styles.inputBox} type="text" name="managerId" value={form.managerId} onChange={onChange} placeholder="아이디를 입력해주세요" onKeyDown={handleKeyDown} autoFocus ></input>
                    <input className={styles.inputBox} type="password" name="managerPw" value={form.managerPw} onChange={onChange} placeholder="비밀번호를 입력해주세요" onKeyDown={handleKeyDown}></input>
                    <p className={styles.noticeText}>{noticeMessage}</p>
                    <button className={styles.loginCheckButton} onClick={onClickLogin}>로그인</button>
                    <div className={styles.findDiv}>
                        <Link to="/IdFindPage"><button className={styles.idFindButton}>아이디 찾기</button></Link>
                        <Link to="/PwFindPage"><button className={styles.pwFindButton}>비밀번호 찾기</button></Link>
                    </div>
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default LoginPage;