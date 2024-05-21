import { React, useState, useEffect } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./ManagerPwChangePage.module.css"; // ManagerPwChangePage.module.css import
import axios from "axios"; // api 통신을 위해 axios install & import

function ManagerPwChangePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ originalPwd: "", newPwd: "", checkNewPwd: "" }); // 새로운 비밀번호 변경 입력 정보
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장
    const [noticeMessage, setNoticeMessage] = useState([]); // 알림 메세지
    const [button, setButton] = useState(false);
    const [check, setCheck] = useState(false); // 기존 비밀번호 체크 여부 저장

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 페이지 로드 시 로그인 상태 확인
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage"); // 로그인 페이지로 이동
        } else {
            // 페이지 처음 로드할 때 스크롤 위치 초기화
            window.scrollTo({ top: 0 });
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
    // 엔터키 누르면 버튼 눌림
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickCheck();
        }
    };

    const handleKeyDown2 = (event) => {
        if (event.keyCode === 13) {
            onClickCheckOriginalPwd();
        }
    };

    const onClickCheckOriginalPwd = () => { // 기존 비밀번호 일치 여부 확인
        if (form.originalPwd) {
            const requestData = { // 전송할 데이터
                managerId: currentId,
                psword: form.originalPwd,
            };

            const apiUrl = 'http://52.79.237.164:3000/manager/login'; // 로그인 API URL

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
                    if (response.data["property"] === 200) { // 기존 비밀번호 확인 완료
                        setCheck(true);
                        setNoticeMessage("");
                    }
                    else if (response.data["message"] === "비밀번호가 올바르지 않습니다." && response.data["property"] === 301) {
                        setCheck(false);
                        setNoticeMessage(response.data["message"])
                    } else {
                        console.log("기존 비밀번호 확인 에러");
                    }
                })
        } else {
            setButton(false);
            setNoticeMessage("기존 비밀번호를 입력해주세요.");
        }
    }

    const onClickCheck = () => { // 비밀번호 기준 부합한지 확인
        // 정규 표현식을 사용하여 비밀번호의 유효성을 검사합니다.
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,16}$/;

        if (!form.originalPwd) {
            setButton(false);
            setNoticeMessage("기존 비밀번호를 입력해주세요.");
        } else if (!form.newPwd) {
            setButton(false);
            setNoticeMessage("새롭게 설정할 비밀번호를 입력해주세요.");
        } else if (!passwordRegex.test(form.newPwd)) {
            setButton(false);
            setNoticeMessage("비밀번호는 8-16자리 / 영문, 숫자, 특수문자 조합으로 입력해주세요.");
        } else if (!form.checkNewPwd) {
            setButton(false);
            setNoticeMessage("새롭게 설정할 비밀번호 확인을 위해 다시 한 번 입력해주세요.");
        } else if (form.newPwd !== form.checkNewPwd) {
            setButton(false);
            setNoticeMessage("새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        } else {
            setButton(true);
            setNoticeMessage("");
        }
    }

    const onClickChangePwd = () => { // 비밀번호 변경 완료 버튼 누르면 실행할 함수
        onClickCheck(); // 한번 더 체크
        setButton(true);
        setNoticeMessage("");
        // 비밀번호 변경 로직 추가
        const isConfirmed = window.confirm("새로운 비밀번호로 변경하시겠습니까?");
        if (isConfirmed) {
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
                        navigate('/MainPage');
                    }
                    else if (response.data["property"] === 301) {
                        alert(`${response.data["message"]}`);
                        window.location.reload(); // 페이지 새로고침
                    } else {
                        alert("비밀번호를 다시 입력해주세요.");
                        window.location.reload(); // 페이지 새로고침
                    }
                })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('전송 실패: ', error);
                    alert('비밀번호 변경에 실패하였습니다. 관리자에게 문의해주세요');
                })
        }

    }


    return (
        <div className={styles.managerPwChangeWrapper}>
            <Navbar selectedPage={"관리자 관리"}></Navbar>
            <div className={styles.managerPwChangeContainer}>
                <p className={styles.mainText} onClick={() => { navigate('/ManagerPwChangePage'); window.location.reload(); }}>비밀번호 변경</p>
                <div className={styles.contentBox}>
                    {(!check) &&
                        <>
                            <div className={styles.startContent}><p className={styles.contentText}>기존 비밀번호</p></div>
                            <input className={styles.inputBox} type="password" name="originalPwd" value={form.originalPwd} placeholder="기존 비밀번호 입력" onChange={onChange} onBlur={handleKeyDown2} onKeyDown={handleKeyDown2}></input>
                        </>}
                    {(check) &&
                        <>
                            <div className={styles.startContent}><p className={styles.contentText}>새로운 비밀번호</p></div>
                            <input className={styles.inputBox} type="password" name="newPwd" value={form.newPwd} placeholder="8~16자리 / 영문, 숫자, 특수문자 조합" onChange={onChange} onBlur={onClickCheck} onKeyDown={handleKeyDown}></input>
                            <div className={styles.startContent}><p className={styles.contentText}>비밀번호 확인</p></div>
                            <input className={styles.inputBox} type="password" name="checkNewPwd" value={form.checkNewPwd} placeholder="새로운 비밀번호 확인" onChange={onChange} onBlur={onClickCheck} onKeyDown={handleKeyDown}></input>
                        </>}
                    <p className={styles.noticeText}>{noticeMessage}</p>
                    {(button) ? <button className={styles.changePwdButton} onClick={onClickChangePwd}>변경 완료</button> : <button className={styles.changePwdButtonH} onClick={onClickCheckOriginalPwd}>확인</button>}
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default ManagerPwChangePage;