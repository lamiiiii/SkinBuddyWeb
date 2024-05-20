import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
    useParams,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./UserUpdatePage.module.css"; // UserUpdatePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function UserUpdatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ userId: "", nickname: "", tel: "" }); // 검색 입력 정보
    const [data, setData] = useState([]);
    const { userNum } = useParams(); // user table 상세 index 번호 넘겨받기
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

        // 최상단 스크롤 버튼 함수
        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

    // 특정 사용자 세부 정보 반환 
    const returnUserInfo = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/manager/user/list'; // 관리자 목록 반환 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, { userId: search })
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                setData(response.data.list[0]);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('특정 사용자 세부 정보 반환 오류 발생: ', error);
            })
    }
    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            returnUserInfo(userNum);
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, []);

    // 폼에 입력한 정보 전달
    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    // 수정 완료 버튼 누르면 사용자 정보 수정하는 함수
    const onClickUserUpdate = () => {
        // 수정 사항이 있는지 확인
        if (!form.nickname && !form.tel) {
            alert("수정 사항이 없습니다.");
        } else {
            const requestData = {
                userId: data.userId,
                nickname: form.nickname || data.nickname, // 수정한 부분 없으면 기존 값 불러옴
                tel: form.tel || data.tel, // 수정한 부분 없으면 기존 값 불러옴
            };
    
            // 수정 완료 실행 이중 확인
            const isConfirmed = window.confirm(`사용자 "${data.userId}" 님의 정보를 정말로 수정하시겠습니까?`);
    
            if (isConfirmed) {
                // API URL 설정
                const apiUrl = 'http://52.79.237.164:3000/user/profile/update'
    
                // axios를 이용하여 PUT 요청 보내기
                axios.put(apiUrl, requestData)
                    .then(response => {
                        // 요청이 성공한 경우 응답한 데이터 처리
                        if (response.data["property"] === 200) { // 전송 성공 && 수정 완료
                            alert(`사용자 "${data.userId}" 님의 정보 수정 성공`);
                            navigate("/UserManagePage");
                        } else if (response.data["property"] === 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
                            alert(response.data.message);
                            window.location.reload(); // 페이지 새로고침
                        }
                    })
                    .catch(error => {
                        // 요청이 실패한 경우 에러 처리
                        console.error('전송 실패: ', error);
                        alert('사용자 정보 수정 실패~~~~~~~~~')
                    })
            } else {
                alert("사용자 정보 수정 취소");
                window.location.reload(); // 페이지 새로고침
            }
        }
    }

    // 사용자 정보 삭제 버튼 누르면 실행하는 함수
    const onClickDelete = () => {
        const requestData = {
            // delete 할 때는 data로 묶어줘야 함!!!!!!!!!
            data: {
                userId: data.userId
            }
        };

        // 삭제 실행 이중 확인
        const isConfirmed = window.confirm(`사용자 [${data.nickname}] 님의 정보를 정말로 삭제하시겠습니까?`);

        if (isConfirmed) {
            // API URL 설정
            const apiUrl = 'http://52.79.237.164:3000/manager/user/delete'

            // axios를 이용하여 DELETE 요청 보내기
            axios.delete(apiUrl, requestData)
                .then(response => {
                    // 요청이 성공한 경우 응답한 데이터 처리
                    // 서버 응답 처리
                    if (response.data["property"] === 200) {
                        alert(`사용자 "${data.userId}" 님의 계정이 삭제되었습니다.`);
                        navigate("/UserManagePage");
                    } else {
                        alert(`사용자 "${data.userId}" 님의 계정 삭제에 실패하였습니다.`);
                    }
                })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('전송 실패: ', error);
                    alert('사용자 정보 삭제 실패~~~~~~~~~')
                })
        } else {
            alert("사용자 계정 삭제 취소");
            window.location.reload(); // 페이지 새로고침
        }
    }

    return (
        <div className={styles.userUpdateWrapper}>
            <Navbar selectedPage={"사용자 정보 관리"}></Navbar>
            <div className={styles.userUpdateContainer}>
                <p className={styles.mainText} onClick={() => window.location.reload()}>사용자 정보 수정</p>
                <div className={styles.contentBox}>
                <div className={styles.divBox}>
                        <p className={styles.miniText}>아이디</p>
                        <p className={styles.idText}>{data.userId}</p>
                    </div>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>닉네임</p>
                        <input className={styles.inputBox} type="text" name="nickname" value={form.nickname} onChange={onChange} placeholder={data.nickname}></input>
                    </div>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>전화번호</p>
                        <input className={styles.inputBox} type="text" name="tel" value={form.tel} onChange={onChange} placeholder={data.tel}></input>
                    </div>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>피부 MBTI</p>
                        <p className={styles.idText}>{data.skinType ? data.skinType : '검사 정보 없음'}</p>
                    </div>
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={() => navigate('/UserManagePage')}>목록</button>
                    <button className={styles.button} onClick={(onClickUserUpdate)}>수정 완료</button>
                    <button className={styles.button} onClick={(onClickDelete)}>삭제</button>
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default UserUpdatePage;