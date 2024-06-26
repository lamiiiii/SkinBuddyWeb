import { React, useState, useEffect } from "react";
import {
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./UserRecordManagePage.module.css"; // UserRecordManagePage.css 파일 import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import axios from "axios"; // api 통신을 위해 axios install & import

function UserRecordManagePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ searchId: "" }); // 검색 입력 정보
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15); // 한 페이지에 15개의 기록을 표시
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 가져오기
    const [troubleCount, setTroubleCount] = useState(0);
    const [improvementCount, setImprovementCount] = useState(0);

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            // 페이지 처음 로드할 때 스크롤 위치 초기화
            window.scrollTo({ top: 0 });
            returnUserRecordList("all");
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, []);

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 사용자 진단 기록 목록 반환 
    const returnUserRecordList = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/user/skin/record/list'; // 사용자 진단 기록 목록 반환 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, { userId: search }) // 진단 기록은 아이디로
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                const records = response.data.list;
                setData(records);
                setTroubleCount(records.filter(record => record.aiType === "AI 트러블 분석").length);
                setImprovementCount(records.filter(record => record.aiType === "AI 호전도 분석").length);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('사용자 진단 기록 반환 오류 발생: ', error);
            })
    }

    // 폼에 입력한 정보 전달
    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    // 검색 버튼 클릭 결과 반환
    const onClickSearch = () => {
        returnUserRecordList(form.searchId);
    }

    const lastItemIndex = currentPage * pageSize;
    const firstItemIndex = lastItemIndex - pageSize;
    const currentItems = data.slice(firstItemIndex, lastItemIndex);

    const totalPages = Math.ceil(data.length / pageSize);

    const changePage = (number) => {
        setCurrentPage(number);
    };


    return (
        <div className={styles.userRecordWrapper}>
            <Navbar selectedPage={"진단 기록 관리"}></Navbar>
            <div className={styles.userRecordContainer}>
                <p className={styles.mainText} onClick={() => { navigate('/UserRecordManagePage'); window.location.reload(); }}>사용자 진단 기록 조회</p>
                <div className={styles.searchDiv}>
                    <input className={styles.searchInput} type="text" name="searchId" value={form.searchId} onChange={onChange} placeholder="아이디 검색"></input>
                    <button className={styles.searchButton} onClick={onClickSearch}>검색</button>
                </div>
                <table className={styles.recordTable}>
                    <thead>
                        <tr>
                            <th className={styles.tableThNum}>목록</th>
                            <th className={styles.tableTh}>아이디</th>
                            <th className={styles.tableTh}>AI 진단 유형</th>
                            <th className={styles.tableTh}>진단 기록 날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map((item, index) => (
                            // 트러블 분석이면 0을 보내고, 호전도 분석이면 1을 보냄
                            <tr className={styles.tableTr} key={index} onClick={() => navigate(`/UserRecordUpdatePage/${item.userId}/${item.recordId}/${item.aiType === "AI 트러블 분석" ? "0" : "1"}`)}>
                                <td className={styles.tableTdNum}>{item.recordId}</td>
                                {/* <td className={styles.tableTdNum}>{index + 1}</td> */}
                                <td className={styles.tableTd}>{item.userId ? item.userId : form.searchId}</td>
                                <td className={styles.tableTd}>{item.aiType}</td>
                                <td className={styles.tableTd}>{item.takeDay}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>검색 결과 없음</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5" style={{ padding: '1%', textAlign: 'center', fontWeight: 'bold', color: 'grey' }}>
                                전체 진단 기록 수: {data.length} &emsp; (트러블 분석: {troubleCount}, 호전도 분석: {improvementCount})
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button className={styles.paginationButton} key={page} onClick={() => changePage(page)} disabled={page === currentPage}>
                            {page}
                        </button>
                    ))}
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default UserRecordManagePage;