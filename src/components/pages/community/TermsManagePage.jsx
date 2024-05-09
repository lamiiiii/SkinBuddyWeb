import { React, useState, useEffect } from "react";
import { /* 페이지 이동을 위해 */
    Link,
    useNavigate,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./TermsManagePage.module.css"; // TermsManagePage.module.css import
import axios from "axios"; // api 통신을 위해 axios install & import

function TermsManagePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState([]); // 이용약관 수정 내용
    const [data, setData] = useState([]); // 이용약관 기존 내용

    const onChange = (e) => { // 폼에 입력한 정보 전달
        const value = e.target.value;
        setForm(value);
    };

    // 이용약관 내용 반환
    const returnTerms = () => {
        const apiUrl = 'http://52.79.237.164:3000/user/terms'; // 이용약관 내용 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('이용약관 내용 반환 응답: ', response.data);
                if (response.data["property"] === 404) {
                    setData("내용 없음")
                    setForm("내용 없음")
                } else {
                    setData(response.data.trems);
                    setForm(response.data.trems);
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('이용약관 내용 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        returnTerms();
    }, []);

    // 수정 완료 버튼 클릭 실행 함수
    const onClickUpdate = () => {
        // 이용약관이 기존 내용에서 수정되었는지 확인
        if (form === data) {
            alert("수정 사항이 없습니다.");
            console.log("수정 사항 없음");
        } else {
            const requestData = {
                terms: form
            };
            console.log("수정 요청 보낼 이용약관 내용: ", requestData);

            // 수정 완료 실행 이중 확인
            const isConfirmed = window.confirm(`이용약관을 수정하시겠습니까?`);

            if (isConfirmed) {
                // API URL 설정
                const apiUrl = 'http://52.79.237.164:3000/manager/terms/update'

                // axios를 이용하여 PUT 요청 보내기
                axios.put(apiUrl, requestData)
                    .then(response => {
                        // 요청이 성공한 경우 응답한 데이터 처리
                        console.log('전송 성공: ', response.data);
                        if (response.data["property"] === 200) { // 전송 성공 && 수정 완료
                            alert(`이용약관 수정 성공`);
                            navigate("/TermsManagePage");
                        } else if (response.data["property"] == 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
                            alert(response.data.message);
                            window.location.reload(); // 페이지 새로고침
                        }
                    })
                    .catch(error => {
                        // 요청이 실패한 경우 에러 처리
                        console.error('전송 실패: ', error);
                        alert('이용약관 수정 실패~~~~~~~~~')
                    })
            }

        }
    }

    return (
        <div className={styles.termsWrapper}>
            <Navbar selectedPage={"커뮤니티 관리"}></Navbar>
            <div className={styles.termsContainer}>
                <p className={styles.mainText}>이용약관 관리</p>
                <div className={styles.contentBox}>
                    <textarea className={styles.textBox} value={form} onChange={onChange} placeholder={data}></textarea>
                </div>
                <div className={styles.updateDiv}><button className={styles.updateButton} onClick={(onClickUpdate)}>수정 완료</button></div>
            </div>
        </div>
    );
}

export default TermsManagePage;