import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./NoticeManagePage.module.css"; // NoticeManagePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function NoticeManagePage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    // 공지사항 목록 반환
    const returnNoticeList = () => {
        const apiUrl = 'http://52.79.237.164:3000/user/Notice/list'; // 공지사항 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('공지사항 목록 반환 응답: ', response.data);
                setData(response.data.list);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('공지사항 목록 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        returnNoticeList();
    }, []);

    return (
        <div className={styles.noticeWrapper}>
            <Navbar></Navbar>
            <div className={styles.noticeContainer}>
                <p className={styles.mainText}>공지사항 관리</p>
                <table className={styles.noticeTable}>
                    <thead>
                        <tr>
                            <th className={styles.tableThNum}>목록</th>
                            <th className={styles.tableTh}>내용</th>
                            <th className={styles.tableTh}>수정일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr className={styles.tableTr} key={index} onClick={() => navigate(`/NoticeUpdatePage/${index}`)}>
                                    <td className={styles.tableTdNum}>{item.noticeId}</td>
                                    {/* 공지사항 내용 중에서 :로 나눠서 : 앞부분만 목록에 띄움 */}
                                    <td className={styles.tableTd}>{item.content.split(":")[0]}</td>
                                    <td className={styles.tableTd}>{item.reviceDay}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', fontFamily: 'NanumSquareRoundB' }}>등록된 공지사항 없음</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className={styles.addDiv}><button className={styles.addButton} onClick={() => navigate('/NoticeAddPage')}>작성하기</button></div>
            </div>
        </div>
    );
}

export default NoticeManagePage;