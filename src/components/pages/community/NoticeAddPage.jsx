import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
    useParams,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./NoticeAddPage.module.css"; // NoticeAddPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function NoticeAddPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState([]); // 공지사항 내용

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const value = e.target.value;
        setForm(value);
    };

    // 공지사항 추가 버튼 클릭 실행 함수
    const onClickAdd = () => {
        // 내용 있는지 확인
        if (form) {
            const requestData = {
                content: form
            };
            console.log("작성 요청 보낼 공지사항 내용: ", requestData);

            // 작성 완료 실행 이중 확인
            const isConfirmed = window.confirm(`새로운 공지사항 작성을 완료하시겠습니까?`);

            if (isConfirmed) {
                // API URL 설정
                const apiUrl = 'http://52.79.237.164:3000/manager/notice/create'

                // axios를 이용하여 POST 요청 보내기
                axios.post(apiUrl, requestData)
                .then(response => {
                    // 요청이 성공한 경우 응답한 데이터 처리
                    console.log('전송 성공: ', response.data);
                    if (response.data["property"] === 200) { // 전송 성공 && 수정 완료
                        alert(`새로운 공지사항이 작성되었습니다.`);
                        navigate("/NoticeManagePage");
                    } else if (response.data["property"] == 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
                        alert(response.data.message);
                        window.location.reload(); // 페이지 새로고침
                    }
                })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('전송 실패: ', error);
                    alert('새로운 공지사항 작성 실패~~~~~~~~~')
                })
            } else {
                alert("새로운 공지사항 작성 완료 취소");
                window.location.reload(); // 페이지 새로고침
            }


        } else {
            alert("공지사항 내용이 없습니다.");
            console.log("내용 없음.");
            window.location.reload(); // 페이지 새로고침
        }
    }
    return (
        <div className={styles.noticeAddWrapper}>
            <Navbar></Navbar>
            <div className={styles.noticeAddContainer}>
                <p className={styles.mainText}>공지사항 상세</p>
                <div className={styles.contentBox}>
                    <div className={styles.noticeContentBox}>
                        <p className={styles.miniText}>내용</p>
                        <textarea className={styles.textareaBox} value={form.content} onChange={onChange} placeholder="내용을 입력하세요 (제목에 : 를 붙이세요)"></textarea>
                    </div>
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={() => navigate('/NoticeManagePage')}>목록</button>
                    <button className={styles.button} onClick={(onClickAdd)}>작성 완료</button>
                </div>
            </div>
        </div>
    );
}

export default NoticeAddPage;