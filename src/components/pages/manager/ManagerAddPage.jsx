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
    const [check, setCheck] = useState({ checkPwd: false, checkNewPwd: false, checkName: false, checkTel: false }); // 조건 부합 체크 
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 가져오기
    const [noticeMessage, setNoticeMessage] = useState([]); // 알림 메세지
    const [button, setButton] = useState(false);

    // 페이지 로드 시 로그인 상태 확인
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage"); // 로그인 페이지로 이동
        } else {

        }
    }, [isLoggedIn, navigate]
    );


    const onChange = (e) => { // 폼에 입력한 정보 전달
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickCheck = () => { // 비밀번호 기준 부합한지 확인
        // 정규 표현식을 사용하여 비밀번호의 유효성을 검사합니다.
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,16}$/;

        if (form.newId.length < 6) {
            setButton(false);
            setNoticeMessage("아이디는 6자리 이상이어야 합니다.");
        } else if (!form.newPwd) {
            setButton(false);
            setNoticeMessage("설정할 비밀번호를 입력해주세요.");
        } else if (!passwordRegex.test(form.newPwd)) {
            setButton(false);
            setNoticeMessage("비밀번호는 8-16자리 / 영문, 숫자, 특수문자 조합으로 입력해주세요.");
        } else if (!form.checkNewPwd) {
            setButton(false);
            setNoticeMessage("비밀번호 확인을 위해 다시 한 번 입력해주세요.");
        } else if (form.newPwd !== form.checkNewPwd) {
            setButton(false);
            setNoticeMessage("설정할 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        } else if (!form.newName) {
            setButton(false);
            setNoticeMessage("이름을 입력해주세요.");
        } else if (!form.newTel) {
            setButton(false);
            setNoticeMessage("전화번호를 입력해주세요.");
        } else {
            setButton(true);
            setNoticeMessage("");
        }

        if (form.newId.length >= 6) { setCheck({ ...check, checkPwd: true }) } // 비밀번호 입력칸 활성화
        if (form.newPwd.length && passwordRegex.test(form.newPwd)) { setCheck({ ...check, checkNewPwd: true }) } // 비밀번호 확인 입력칸 활성화
        if (form.checkNewPwd && (form.newPwd == form.checkNewPwd)) { setCheck({ ...check, checkName: true }) } // 이름 입력칸 활성화
        if (form.newName) { setCheck({ ...check, checkTel: true }) } // 전화번호 입력칸 활성화
    }

    const onClickAddManager = () => { // 관리자 추가 완료 버튼 누르면 실행할 함수
        onClickCheck(); // 한번 체크
        setNoticeMessage(""); // 알림 메세지 초기화
        const isConfirmed = window.confirm("입력된 정보로 관리자를 추가하시겠습니까?");
        if (isConfirmed) {
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
                    if (response.data["property"] === 200) {
                        // 요청이 성공한 경우 응답한 데이터 처리
                        alert(`${form.newId} 관리자가 추가되었습니다.`);
                        navigate('/ManagerPage');
                    } else if (response.data["property"] === 304) {
                        alert(`${response.data["message"]}`);
                        // window.location.reload(); // 페이지 새로고침
                    } else {
                        alert("다시 시도해주세요.");
                        window.location.reload();
                    }
                })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('전송 실패: ', error);
                    alert('관리자 추가에 실패하였습니다. 관리자에게 문의해주세요.')
                })
        }

    }

    // 엔터키 누르면 입력칸 검사 함수 onClickCheck호출 (다음 버튼과 같은 기능)
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickCheck();
        }
    };

    // form에 하나라도 입력한 경우에 목록 버튼 누르면 경고 알림 확인 받음
    const handleNavigate = () => {
        // form에 값이 있는지 확인
        if (Object.values(form).some(value => value.length > 0)) {
            const confirmNavigate = window.confirm("입력한 정보가 지워질 수 있습니다. 계속하시겠습니까?");
            if (confirmNavigate) {
                navigate('/ManagerPage');
            }
        } else {
            navigate('/ManagerPage');
        }
    };

    return (
        <div className={styles.managerAddWrapper}>
            <Navbar selectedPage={"관리자 관리"}></Navbar>
            <div className={styles.managerAddContainer}>
                <p className={styles.mainText}>관리자 추가</p>
                <div className={styles.contentBox}>
                    <p className={styles.noticeText}>{noticeMessage}</p>

                    <div className={styles.startContent}><p className={styles.contentText}>아이디</p></div>
                    <input className={styles.inputBox} type="text" name="newId" value={form.newId} placeholder="6글자 이상" onChange={onChange} onBlur={onClickCheck} onKeyDown={handleKeyDown}></input>
                    {(check.checkPwd) && (<>
                        <div className={styles.startContent}><p className={styles.contentText}>비밀번호</p></div>
                        <input className={styles.inputBox} type="password" name="newPwd" value={form.newPwd} placeholder="8~16자리 / 영문, 숫자, 특수문자 조합" onChange={onChange} onBlur={onClickCheck} onKeyDown={handleKeyDown}></input>
                    </>)}
                    {(check.checkNewPwd) && (<>
                        <div className={styles.startContent}><p className={styles.contentText}>비밀번호 확인</p></div>
                        <input className={styles.inputBox} type="password" name="checkNewPwd" value={form.checkNewPwd} placeholder="비밀번호 확인" onChange={onChange} onBlur={onClickCheck} onKeyDown={handleKeyDown}></input>
                    </>)}
                    {(check.checkName) && (<>
                        <div className={styles.startContent}><p className={styles.contentText}>이름</p></div>
                        <input className={styles.inputBox} type="text" name="newName" value={form.newName} placeholder="이름" onChange={onChange} onBlur={onClickCheck} onKeyDown={handleKeyDown}></input>
                    </>)}
                    {(check.checkTel) && (<>
                        <div className={styles.startContent}><p className={styles.contentText}>전화번호</p></div>
                        <input className={styles.inputBox} type="text" name="newTel" value={form.newTel} placeholder="'-' 빼고 숫자만 입력" onChange={onChange} onBlur={onClickCheck} onKeyDown={handleKeyDown}></input>
                    </>)}
                    {(button) ? <button className={styles.addManagerButton} onClick={onClickAddManager}>관리자 추가</button>
                        : <button className={styles.addManagerButtonH} onClick={onClickCheck}>다음</button>}
                </div>
                <div className={styles.listButtonDiv}><button className={styles.listButton}
                    onClick={handleNavigate}>목록</button></div>
            </div>
        </div>
    );
}

export default ManagerAddPage;