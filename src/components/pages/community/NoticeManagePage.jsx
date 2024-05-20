import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./NoticeManagePage.module.css"; // NoticeManagePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function NoticeManagePage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15); // 한 페이지에 15개의 기록을 표시

    // 공지사항 목록 반환
    const returnNoticeList = () => {
        const apiUrl = 'http://52.79.237.164:3000/user/Notice/list'; // 공지사항 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                setData(response.data.list);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('공지사항 목록 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            returnNoticeList();
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, []);

    // 내용 간략히 보이기
    const contentCut = (content) => {
        // item.content에서 ':'를 기준으로 분리
        const splitContent = content.includes(':') ? content.split(':')[0] : content;

        // 분리된 내용이 일정 길이 이상이면 자르고, 그렇지 않으면 그대로 사용
        const displayedContent = splitContent.length > 15 ? splitContent.substring(0, 15) + "..." : splitContent;

        return (displayedContent);
    }

    const lastItemIndex = currentPage * pageSize;
    const firstItemIndex = lastItemIndex - pageSize;
    const currentItems = data.slice(firstItemIndex, lastItemIndex);

    const totalPages = Math.ceil(data.length / pageSize);

    const changePage = (number) => {
        setCurrentPage(number);
    };


    return (
        <div className={styles.noticeWrapper}>
            <Navbar selectedPage={"커뮤니티 관리"}></Navbar>
            <div className={styles.noticeContainer}>
                <p className={styles.mainText} onClick={() => {navigate('/NoticeManagePage'); window.location.reload();}}>공지사항 관리</p>
                <table className={styles.noticeTable}>
                    <thead>
                        <tr>
                            <th className={styles.tableThNum}>목록</th>
                            <th className={styles.tableTh}>내용</th>
                            <th className={styles.tableTh}>수정일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr className={styles.tableTr} key={index} onClick={() => navigate(`/NoticeUpdatePage/${item.noticeId}`)}>
                                    <td className={styles.tableTdNum}>{item.noticeId}</td>
                                    {/* 공지사항 내용 중에서 :로 나눠서 : 앞부분만 목록에 띄움 */}
                                    <td className={styles.tableTd}>{contentCut(item.content)}</td>
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
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button className={styles.paginationButton} key={page} onClick={() => changePage(page)} disabled={page === currentPage}>
                            {page}
                        </button>
                    ))}
                </div>
                <div className={styles.addDiv}><button className={styles.addButton} onClick={() => navigate('/NoticeAddPage')}>작성하기</button></div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default NoticeManagePage;