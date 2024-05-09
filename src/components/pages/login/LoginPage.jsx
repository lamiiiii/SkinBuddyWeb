import { React, useState } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./LoginPage.module.css"; // LoginPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ managerId: "", managerPw: "" }); // 로그인 입력 정보

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickLogin = () => { // 로그인 버튼 누르면 실행할 함수
        console.log(form.managerId, form.managerPw)
        const requestData = { // 전송할 데이터
            managerId: form.managerId,
            psword: form.managerPw,
        };

        // API URL 설정
        // const apiUrl = 'https://hugopmbque.execute-api.ap-northeast-2.amazonaws.com/default/manager_login'; // 서버리스 방식
        const apiUrl = 'http://52.79.237.164:3000/manager/login'; // 로그인 API URL


        //         const awsEndpoint = 'myawsendpoint.amazonaws. com'
        // axios.post (awsEndpoint, {
        // headers: {
        // 'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
        // 'Access-Control-Allow-Credentials': true,
        // 'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
        // },
        // formEmail, formSubject, formMessage
        // } )

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, requestData,
            {
                headers: {
                    'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                if(response.data["property"] === 200){
                    console.log('전송 성공: ', response.data);
                    alert(`로그인 성공   ID: ${form.managerId}`);
                    console.log("ID:", form.managerId, "PW:", form.managerPw);
                    localStorage.setItem("ID", form.managerId); // 로그인 정보 유지를 위한 저장
                    localStorage.setItem("isLoggedIn", true); // 로그인 여부 저장
                    navigate('/MainPage');
                }
                else if(response.data["property"] === 301){
                    console.log('전송 성공(로그인 실패): ', response.data);
                    alert(`${response.data["message"]}`);
                    console.log("ID:", form.managerId, "PW:", form.managerPw);
                    localStorage.setItem("IsLoggedIn", false); // 로그인 여부 저장
                    window.location.reload(); // 페이지 새로고침
                }
                else{
                    console.log("전송 에러", response.data);
                    alert("로그인 정보를 다시 입력해주세요.");
                    localStorage.setItem("isLoggedIn", false); // 로그인 여부 저장
                    window.location.reload(); // 페이지 새로고침
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('로그인 전송 실패: ', error);
                localStorage.setItem("isLoggedIn", false); // 로그인 여부 저장
                alert('로그인 실패~~~~~~~~~');
            })
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
                <p className={styles.mainText}>로그인</p>
                <div className={styles.contentBox}>
                    <input className={styles.inputBox} type="text" name="managerId" value={form.managerId} onChange={onChange} placeholder="아이디를 입력해주세요" onKeyDown={handleKeyDown}></input>
                    <input className={styles.inputBox} type="password" name="managerPw" value={form.managerPw} onChange={onChange} placeholder="비밀번호를 입력해주세요" onKeyDown={handleKeyDown}></input>
                    <button className={styles.loginCheckButton} onClick={onClickLogin}>로그인</button>
                    <div className={styles.findDiv}>
                        <Link to="/IdFindPage"><button className={styles.idFindButton}>아이디 찾기</button></Link>
                        <Link to="/PwFindPage"><button className={styles.pwFindButton}>비밀번호 찾기</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;