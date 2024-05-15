import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
    useParams,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./NoticeUpdatePage.module.css"; // NoticeUpdatePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function NoticeUpdatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState([]); // 공지사항 수정 내용
    const [data, setData] = useState([]); // 공지사항 기존 내용
    const [noticeData, setNoticeData] = useState([]); // 응답 데이터
    const { noticeNum } = useParams(); // notice table 상세 index 번호 넘겨받기

    // 특정 공지사항 내용 반환 
    const returnNotice = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/user/notice/list'; // 관리자 목록 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                const notice = response.data.list.find(n => n.noticeId.toString() === noticeNum);
                if (notice) {
                    setNoticeData(notice);
                    setData(notice.content);
                    setForm(notice.content);
                } else {
                    // 일치하는 공지사항이 없는 경우
                    setData("");
                    setForm("");
                    console.error(`공지사항 ${search}이 존재하지 않습니다.`);
                    navigate("/NoticeManagePage");
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('특정 공지사항 내용 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        returnNotice();
    }, []);

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const value = e.target.value;
        setForm(value);
    };

    // 수정 완료 버튼 클릭 실행 함수
    const onClickUpdate = () => {
        // 공지사항이 기존 내용에서 수정되었는지 확인
        if (form === data) {
            alert("수정 사항이 없습니다.");
        } else {
            const requestData = {
                noticeId: noticeData.noticeId,
                content: form
            };

            // 수정 완료 실행 이중 확인
            const isConfirmed = window.confirm(`${noticeData.noticeId}번 공지사항을 수정하시겠습니까?`);

            if (isConfirmed) {
                // API URL 설정
                const apiUrl = 'http://52.79.237.164:3000/manager/notice/update'

                // axios를 이용하여 PUT 요청 보내기
                axios.put(apiUrl, requestData)
                    .then(response => {
                        // 요청이 성공한 경우 응답한 데이터 처리
                        if (response.data["property"] === 200) { // 전송 성공 && 수정 완료
                            alert(`${noticeData.noticeId}번 공지사항 수정 성공`);
                            navigate("/NoticeManagePage");
                        } else if (response.data["property"] == 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
                            alert(response.data.message);
                            window.location.reload(); // 페이지 새로고침
                        }
                    })
                    .catch(error => {
                        // 요청이 실패한 경우 에러 처리
                        console.error('전송 실패: ', error);
                        alert('공지사항 수정 실패~~~~~~~~~')
                    })
            } else {
                alert("공지사항 수정 취소");
                window.location.reload(); // 페이지 새로고침
            }

        }
    }

    // 삭제 버튼 클릭시 실행 함수
    const onClickDelete = () => {
        const requestData = {
            // delete 할 때는 data로 묶어줘야 함!!!!!!!!!
            data: {
                noticeId: noticeData.noticeId
            }
        };

        // 삭제 실행 이중 확인
        const isConfirmed = window.confirm(`${noticeData.noticeId}번 공지사항을 정말로 삭제하시겠습니까?`);

        if (isConfirmed) {
            // API URL 설정
            const apiUrl = 'http://52.79.237.164:3000/manager/notice/delete'
            // axios를 이용하여 DELETE 요청 보내기
            axios.delete(apiUrl, requestData)
                .then(response => {
                    // 요청이 성공한 경우 응답한 데이터 처리
                    // 서버 응답 처리
                    if (response.data["property"] === 200) {
                        alert(`${noticeData.noticeId}번 공지사항이 삭제되었습니다`);
                        navigate("/NoticeManagePage");
                    } else {
                        alert(`${noticeData.noticeId}번 공지사항 삭제에 실패하였습니다`);
                    }
                })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('전송 실패: ', error);
                    alert('공지사항 삭제 실패~~~~~~~~~')
                })
        } else {
            alert("공지사항 삭제 취소");
            window.location.reload(); // 페이지 새로고침
        }

    }

    return (
        <div className={styles.noticeUpdateWrapper}>
            <Navbar selectedPage={"커뮤니티 관리"}></Navbar>
            <div className={styles.noticeUpdateContainer}>
                <p className={styles.mainText}>공지사항 상세 내용</p>
                <div className={styles.contentBox}>
                    <div className={styles.noticeContentBox}>
                        <p className={styles.sideText}>글 번호</p>
                        <p className={styles.noticeIdText}>{noticeData.noticeId}</p>
                        <p className={styles.miniText}>내용</p>
                        <textarea className={styles.textareaBox} value={form} onChange={onChange} placeholder={data}></textarea>
                    </div>
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={() => navigate('/NoticeManagePage')}>목록</button>
                    <button className={styles.button} onClick={(onClickUpdate)}>수정 완료</button>
                    <button className={styles.button} onClick={(onClickDelete)}>삭제</button>
                </div>
            </div>
        </div>
    );
}

export default NoticeUpdatePage;