import { React, useState, useEffect } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./ManagerAddPage.module.css"; // ManagerAddPage.module.css import
import axios from "axios"; // api 통신을 위해 axios install & import

function ManagerAddPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ newId: "", newPwd: "", checkNewPwd: "", newName: "", newTel: "" }); // 새로운 관리자 입력 정보
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 가져오기

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

    const onClickAddManager = () => { // 관리자 추가 완료 버튼 누르면 실행할 함수
        const requestData = {
            managerId: form.newId,
            psword: form.newPwd,
            name: form.newName,
            tel: form.newTel,
        };

        // API URL 설정
        const apiUrl = 'http://52.79.237.164:3000/manager/create'

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, requestData)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('전송 성공: ', response.data);
                alert(`관리자 추가 성공   ID: ${form.newId}, PW: ${form.newPwd}, NAME: ${form.newName}, TEL: ${form.newTel}`);
                console.log("관리자 추가 성공  ID:", form.newId, "PW:", form.newPwd, "NAME:", form.newName, "TEL:", form.newTel);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('전송 실패: ', error);
                alert('관리자 추가 실패~~~~~~~~~')
            })
    }

    return (
        <div className={styles.managerAddWrapper}>
            <Navbar selectedPage={"관리자 관리"}></Navbar>
            <div className={styles.managerAddContainer}>
                <p className={styles.mainText}>관리자 추가</p>
                <div className={styles.contentBox}>
                    <div className={styles.startContent}><p className={styles.contentText}>아이디</p></div>
                    <input className={styles.inputBox} type="text" name="newId" value={form.newId} placeholder="6글자 이상" onChange={onChange}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>비밀번호</p></div>
                    <input className={styles.inputBox} type="password" name="newPwd" value={form.newPwd} placeholder="8~16자리 / 영문, 숫자, 특수문자 조합" onChange={onChange}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>비밀번호 확인</p></div>
                    <input className={styles.inputBox} type="password" name="checkNewPwd" value={form.checkNewPwd} placeholder="비밀번호 확인" onChange={onChange}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>이름</p></div>
                    <input className={styles.inputBox} type="text" name="newName" value={form.newName} placeholder="이름" onChange={onChange}></input>
                    <div className={styles.startContent}><p className={styles.contentText}>전화번호</p></div>
                    <input className={styles.inputBox} type="text" name="newTel" value={form.newTel} placeholder="'-' 빼고 숫자만 입력" onChange={onChange}></input>
                    <button className={styles.addManagerButton} onClick={onClickAddManager}>관리자 추가 완료</button>
                </div>
                <div className={styles.listButtonDiv}><button className={styles.listButton} onClick={() => navigate('/ManagerPage')}>목록</button></div>
            </div>
        </div>
    );
}

export default ManagerAddPage;