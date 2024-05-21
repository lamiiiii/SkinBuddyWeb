import { React, useState, useEffect } from "react";
import {
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./NoticeAddPage.module.css"; // NoticeAddPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function NoticeAddPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState([]); // 공지사항 내용
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장
    // const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기

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

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onChange = (e) => {
        const value = e.target.value;
        if (value.length <= 400) {
            setForm(value);
        } else {
            alert("입력 값은 최대 400자까지만 허용됩니다.");
        }
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
                        if (response.data["property"] === 200) { // 전송 성공 && 수정 완료
                            alert(`새로운 공지사항이 작성되었습니다.`);
                            navigate("/NoticeManagePage");
                        } else if (response.data["property"] === 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
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
            window.location.reload(); // 페이지 새로고침
        }
    }


    // // 엔터키 누르면 입력칸 검사 함수 onClickCheck호출 (다음 버튼과 같은 기능)
    // const handleKeyDown = (event) => {
    //     if (event.keyCode === 13) {
    //         onClickAdd();
    //     }
    // };

    // form에 하나라도 입력한 경우에 목록 버튼 누르면 경고 알림 확인 받음
    const handleNavigate = () => {
        // form에 값이 있는지 확인
        if (Object.values(form).some(value => value.length > 0)) {
            const confirmNavigate = window.confirm("작성중인 내용이 지워질 수 있습니다. 계속하시겠습니까?");
            if (confirmNavigate) {
                navigate('/NoticeAddPage');
                window.location.reload();
            }
        } else {
            navigate('/NoticeAddPage');
            window.location.reload();
        }
    };

    return (
        <div className={styles.noticeAddWrapper}>
            <Navbar selectedPage={"커뮤니티 관리"} ></Navbar>
            <div className={styles.noticeAddContainer}>
                <p className={styles.mainText} onClick={handleNavigate}>공지사항 작성</p>
                <div className={styles.contentBox}>
                    <div className={styles.noticeContentBox}>
                        <p className={styles.miniText}>내용</p>
                        <textarea className={styles.textareaBox} value={form.content} onChange={onChange} placeholder="내용을 입력하세요."></textarea>
                    </div>
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={handleNavigate}>목록</button>
                    <button className={styles.button} onClick={onClickAdd}>작성 완료</button>
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default NoticeAddPage;