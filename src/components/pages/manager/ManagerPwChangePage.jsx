import { React, useState, useEffect } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./ManagerPwChangePage.module.css"; // ManagerPwChangePage.module.css import
import axios from "axios"; // api 통신을 위해 axios install & import

function ManagerPwChangePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ originalPwd: "", newPwd: "", checkNewPwd: "" }); // 새로운 비밀번호 변경 입력 정보
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

    const onClickChangePwd = async () => { // 비밀번호 변경 완료 버튼 누르면 실행할 함수
        const isConfirmed = window.confirm("새로운 비밀번호로 변경하시겠습니까?");
        if(isConfirmed){
            // 확인 받았을 경우
            const requestData = {
                "managerId": currentId, // 현재 로그인되어 있는 아이디 정보 
                "psword": form.originalPwd, // 기존 비밀번호
                "newPsword": form.newPwd // 새로운 비밀 번호
            };
    
            // API URL 설정
            const apiUrl = 'http://52.79.237.164:3000/manager/psword'
    
            // axios를 이용하여 PUT 요청 보내기
            axios.put(apiUrl, requestData)
                .then(response => {
                    if (response.data["property"] === 200) {
                        // 요청이 성공한 경우
                        console.log('비밀번호 변경 전송 성공: ', response.data);
                        navigate('/MainPage');
                    }
                    else if (response.data["property"] === 301){
                        console.log('전송 성공(비밀번호 변경 실패): ', response.data);
                        alert(`${response.data["message"]}`);
                        window.location.reload(); // 페이지 새로고침
                    } else {
                        console.log("비밀번호 변경 전송 에러:", response.data);
                        alert("비밀번호를 다시 입력해주세요.");
                        window.location.reload(); // 페이지 새로고침
                    }
                            })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('전송 실패: ', error);
                    alert('비밀번호 변경에 실패하였습니다. 관리자에게 문의해주세요');
                })
        } else {
            // 아무런 동작 없이 페이지에 남기
        }
    }
    return (
        <div className={styles.managerPwChangeWrapper}>
            <Navbar></Navbar>
            <div className={styles.managerPwChangeContainer}>
                <p className={styles.mainText}>비밀번호 변경</p>
                <div className={styles.contentBox}>
                    <div className={styles.startContent}><p className={styles.contentText}>기존 비밀번호</p></div>
                    <input className={styles.inputBox} type="password" name="originalPwd" value={form.originalPwd} placeholder="8~16자리 / 영문, 숫자, 특수문자 조합" onChange={onChange}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>새로운 비밀번호</p></div>
                    <input className={styles.inputBox} type="password" name="newPwd" value={form.newPwd} placeholder="8~16자리 / 영문, 숫자, 특수문자 조합" onChange={onChange}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>비밀번호 확인</p></div>
                    <input className={styles.inputBox} type="password" name="checkNewPwd" value={form.checkNewPwd} placeholder="비밀번호 확인" onChange={onChange}></input>
                    <button className={styles.changePwdButton} onClick={onClickChangePwd}>변경 완료</button>
                </div>
            </div>
        </div>
    );
}

export default ManagerPwChangePage;