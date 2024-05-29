import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
    useParams,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./QnaAnswerPage.module.css"; // QnaAnswerPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function QnaAnswerPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState([]); // 답변 내용
    const [data, setData] = useState([]); // 질문 내용
    const { qnaNum } = useParams(); // qna table 상세 index 번호 넘겨받기
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 가져오기

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            // 페이지 처음 로드할 때 스크롤 위치 초기화
            window.scrollTo({ top: 0 });
            returnQnAList();
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 특정 QnA 내용 반환
    const returnQnAList = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/manager/question/list'; // QnA 목록 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                const qna = response.data.list.find(n => n.questionId.toString() === qnaNum);
                if (qna) {
                    setData(qna);
                    setForm(qna.answer);
                } else {
                    // 일치하는 qna가 없는 경우
                    setData("");
                    setForm("");
                    console.error(`Q&A ${search}이 존재하지 않습니다.`);
                    navigate("/QnaManagePage");
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('QnA 목록 반환 오류 발생: ', error);
            })
    }

    // 폼에 입력한 정보 전달
    const onChange = (e) => {
        const value = e.target.value;
        setForm(value);
    };

    // Q&A 답변 완료 버튼 클릭 실행 함수
    const onClickAnswer = () => {
        // 답변 내용 작성했는지 확인
        if (form) {
            const requestData = {
                questionId: data.questionId,
                answer: form
            }

            // 수정 완료 실행 이중 확인
            const isConfirmed = window.confirm(`답변을 저장하시겠습니까?`);

            if (isConfirmed) {
                // API URL 설정
                const apiUrl = 'http://52.79.237.164:3000/manager/question/answer'

                // axios를 이용하여 POST 요청 보내기
                axios.post(apiUrl, requestData)
                    .then(response => {
                        // 요청이 성공한 경우 응답한 데이터 처리
                        if (response.data["property"] === 200) { // 전송 성공 && 수정 완료
                            alert(`답변 저장 성공`);
                            navigate("/QnaManagePage");
                        } else if (response.data["property"] === 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
                            alert(response.data.message);
                            window.location.reload(); // 페이지 새로고침
                        }
                    })
                    .catch(error => {
                        // 요청이 실패한 경우 에러 처리
                        console.error('전송 실패: ', error);
                        alert('답변 저장 실패~~~~~~~~~')
                    })

            }
        } else {
            alert("답변 내용이 없습니다.");
        }
    }

    return (
        <div className={styles.qnaAnswerWrapper}>
            <Navbar selectedPage={"커뮤니티 관리"}></Navbar>
            <div className={styles.qnaAnswerContainer}>
                <p className={styles.mainText} onClick={() => window.location.reload()}>Q&A 상세 내용</p>
                <div className={styles.contentBox}>
                    <div className={styles.qnaContentBox}>
                        <p className={styles.sideText}>질문 아이디</p>
                        <p className={styles.qnaText}>{data.questionId}</p>
                        <p className={styles.miniText}>작성자</p>
                        <p className={styles.qnaText}>{data.userId}</p>
                        <p className={styles.miniText}>내용</p>
                        <textarea className={styles.textareaBox} value={data.question}></textarea>
                    </div>
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={() => navigate('/QnaManagePage')}>목록</button>
                </div>
                <div className={styles.answerDiv}>
                    <p className={styles.answerText}>답변 작성</p>
                    <textarea className={styles.answerTextarea} value={form} onChange={onChange} placeholder={data.answer ? data.answer : "답변을 작성해주세요."}></textarea>
                    <div className={styles.answerButtonDiv}>
                        <button className={styles.answerButton} onClick={onClickAnswer}>답변 등록</button>
                    </div>
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default QnaAnswerPage;