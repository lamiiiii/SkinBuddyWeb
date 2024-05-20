import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import

import styles from "./UserManagePage.module.css"; // UserManagePage.css 파일 import
import axios from "axios";

function UserManagePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ searchId: "" }); // 검색 입력 정보
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15); // 한 페이지에 15개의 기록을 표시
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 사용자 정보 목록 반환 
    const returnUserList = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/manager/user/list'; // 사용자 정보 목록 반환 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, { userId: search })
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('사용자 정보 목록 반환 응답: ', response.data);
                setData(response.data.list);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('사용자 정보 목록 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            returnUserList("all");
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

    // 검색 버튼 클릭 결과 반환
    const onClickSearch = () => {
        returnUserList(form.searchId);
    }

    const lastItemIndex = currentPage * pageSize;
    const firstItemIndex = lastItemIndex - pageSize;
    const currentItems = data.slice(firstItemIndex, lastItemIndex);

    const totalPages = Math.ceil(data.length / pageSize);

    const changePage = (number) => {
        setCurrentPage(number);
    };

    return (
        <div className={styles.userManageWrapper}>
            <Navbar selectedPage={"사용자 정보 관리"}></Navbar>
            <div className={styles.userManageContainer}>
                <p className={styles.mainText} onClick={() => {navigate('/UserManagePage'); window.location.reload();}}>사용자 정보 조회</p>
                <div className={styles.searchDiv}>
                    <input className={styles.searchInput} type="text" name="searchId" value={form.searchId} onChange={onChange} placeholder="아이디 검색"></input>
                    <button className={styles.searchButton} onClick={onClickSearch}>검색</button>
                </div>
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th className={styles.tableThNum}>목록</th>
                            <th className={styles.tableTh}>닉네임</th>
                            <th className={styles.tableTh}>아이디</th>
                            <th className={styles.tableTh}>전화번호</th>
                            <th className={styles.tableTh}>피부 MBTI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map((item, index) => (
                                <tr className={styles.tableTr} key={index} onClick={() => navigate(`/UserUpdatePage/${item.userId}`)}>
                                    <td className={styles.tableTdNum}>{index + 1}</td>
                                    <td className={styles.tableTd}>{item.nickname ? item.nickname : '정보 없음'}</td>
                                    <td className={styles.tableTd}>{item.userId ? item.userId : '정보 없음'}</td>
                                    <td className={styles.tableTd}>{item.tel ? item.tel : '정보 없음'}</td>
                                    <td className={styles.tableTd}>{item.skinType ? item.skinType : '검사 정보 없음'}</td>
                                </tr>
                            )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>검색 결과 없음</td>
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
            </div>
            <Footer></Footer>
        </div>
    );
}

export default UserManagePage;