import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../auth/Navbar";
import styles from "./IdFindPage.module.css";
import axios from "axios";
import WarningModal from "../../auth/WarningModal";

function IdFindPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ telNumber: "" });
    const [findId, setFindId] = useState();
    const [warningModalOpen, setWarningModalOpen] = useState(false);
    const [findIdModalOpen, setFindIdModalOpen] = useState(false);
    const modalBackground = useRef();

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    const onClickIdFind = () => {
        if (form.telNumber) {
            const requestData = { tel: form.telNumber };
            const apiUrl = 'http://52.79.237.164:3000/manager/find/id';

            axios.post(apiUrl, requestData)
                .then(response => {
                    if(response.data["property"] === 200){
                        setFindId(response.data.managerId);
                        setFindIdModalOpen(true);
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch(error => {
                    console.error('전송 실패: ', error);
                    alert('아이디 찾기 실패~~~~~~~~~');
                })
        } else {
            setWarningModalOpen(true); // 전화번호가 비어있을 때 모달 띄우기
        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClickIdFind();
        }
    };

    return (
        <>
            <div className={styles.idFindWrapper}>
                <Navbar />
                <div className={styles.idFindContainer}>
                    <p className={styles.mainText}>아이디 찾기</p>
                    <div className={styles.contentBox}>
                        <div className={styles.telContent}>
                            <p className={styles.telText}>휴대폰 번호</p>
                            <input className={styles.telInput} type="text" name="telNumber" value={form.telNumber} onChange={onChange} placeholder="'-'빼고 숫자만 입력" onKeyDown={handleKeyDown}></input>
                        </div>
                        <button className={styles.checkButton} onClick={() => onClickIdFind()}>확인</button>
                        {
                            warningModalOpen &&
                            <WarningModal message={"전화번호를 입력하세요."}>
                            </WarningModal>
                        }
                        {
                            findId && findIdModalOpen &&
                            <div className={styles.modalContainer} ref={modalBackground} onClick={e => {
                                if (e.target === modalBackground.current) {
                                    setFindIdModalOpen(false);
                                }
                            }}>
                                <div className={styles.modalContent}>
                                    <p>관리자님의 아이디는 {findId}입니다.</p>
                                    <Link to="/LoginPage"><button className={styles.modalCloseButton} onClick={() => setFindIdModalOpen(false)}>로그인하러 가기</button></Link>
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
