import React, { useState, useRef } from "react";
import {
    Link, /* 페이지 이동을 위해 */
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./IdFindPage.module.css"; // IdFindPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function IdFindPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ telNumber: "" }); // 전화번호 입력 정보
    const [findId, setFindId] = useState(); // 찾은 아이디

    const [modalOpen, setModalOpen] = useState(false); // 모달창 오픈을 위함
    const modalBackground = useRef(); // 모달창 바깥에 클릭 시 닫기를 위함

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickIdFind = () => {
        const requestData = { // 전송할 데이터
            tel: form.telNumber
        };

        // API URL 설정
        // const apiUrl = 'https://srkr8jg3hd.execute-api.ap-northeast-2.amazonaws.com/default/manager_findId';
        const apiUrl = 'http://52.79.237.164:3000/manager/find/id'; // 아이디 찾기 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, requestData)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                if(response.data["property"] === 200){
                    console.log('전송 성공: ', response.data);
                    console.log("전화번호:", form.telNumber);
                    setFindId(response.data.managerId);
                    setModalOpen(true); // 모달창에 아이디 정보 띄우기
                } else{
                    console.log('전송 성공 (정보 없음): ', response.data);
                    alert(response.data.message);
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('전송 실패: ', error);
                alert('아이디 찾기 실패~~~~~~~~~');
            })
    }

    return (
        <>
            <div className={styles.idFindWrapper}>
                <Navbar></Navbar>
                <div className={styles.idFindContainer}>
                    <p className={styles.mainText}>아이디 찾기</p>
                    <div className={styles.contentBox}>
                        <div className={styles.telContent}>
                            <p className={styles.telText}>휴대폰 번호</p>
                            <input className={styles.telInput} type="text" name="telNumber" value={form.telNumber} onChange={onChange} placeholder="'-'빼고 숫자만 입력" ></input>
                        </div>
                        <button className={styles.checkButton} onClick={() => onClickIdFind()}>확인</button>
                        {/* <button className={styles.checkButton} onClick={onClickIdFind}>확인</button> 모달 창으로 아이디 알려주기 */}
                        {
                            modalOpen &&
                            <div className={styles.modalContainer} ref={modalBackground} onClick={e => {
                                if (e.target === modalBackground.current) {
                                    setModalOpen(false);
                                }
                            }}>
                                <div className={styles.modalContent}>
                                    <p>관리자님의 아이디는 {findId}입니다.</p>
                                    <Link to="/LoginPage"><button className={styles.modalCloseButton} onClick={() => setModalOpen(false)}>로그인하러 가기</button></Link>
                                </div>
                            </div>
                        }
                        <p className={styles.informText}>*회원정보에 등록된 정보로 아이디를 찾을 수 있습니다.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IdFindPage;