import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./QnaManagePage.module.css"; // QnaManagePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function QnaManagePage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    // QnA 목록 반환
    const returnQnAList = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/question/list'; // QnA 목록 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('QnA 목록 반환 응답: ', response.data);
                setData(response.data.list);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('QnA 목록 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        returnQnAList();
    }, []);

    return (
        <div className={styles.qnaManageWrapper}>
            <Navbar></Navbar>
            <div className={styles.qnaManageContainer}>
                <p className={styles.mainText}>Q&A 관리</p>
                <table className={styles.qnaTable}>
                    <thead>
                        <tr>
                            <th className={styles.tableThNum}>목록</th>
                            <th className={styles.tableTh}>내용</th>
                            <th className={styles.tableTh}>등록일</th>
                            <th className={styles.tableTh}>답변여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr className={styles.tableTr} key={index} onClick={() => navigate(`/QnaAnswerPage/${index}`)}>
                                    <td className={styles.tableTdNum}>{item.questionId}</td>
                                    {/* QnA 내용 중에서 \n으로 나눠서 \n 앞부분만 목록에 띄움 */}
                                    <td className={styles.tableTd}>{item.question.split("\n")[0]}</td>
                                    <td className={styles.tableTd}>{item.createday}</td>
                                    <td className={item.answer ? styles.tableTdB : styles.tableTdR}>{item.answer ? "답변 완료" : "답변 대기"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', fontFamily: 'NanumSquareRoundB' }}>등록된 Q&A 없음</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QnaManagePage;