import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./ManagerPage.module.css"; // ManagerPage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function ManagerPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ searchName: "" }); // 검색 입력 정보
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15); // 한 페이지에 15개의 기록을 표시
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 가져오기

    // 관리자 목록 반환 
    const returnManagerList = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/manager/list'; // 관리자 목록 반환 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, { name: search })
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                setData(response.data.list);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('관리자 목록 반환 오류 발생: ', error);
            })
    }

    // 페이지 로드 시 로그인 상태 확인
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage"); // 로그인 페이지로 이동
        } else {
            returnManagerList("all"); // 관리자 목록 정보 반환
        }
    }, [isLoggedIn, navigate]);

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
        returnManagerList(form.searchName);
    }

    const lastItemIndex = currentPage * pageSize;
    const firstItemIndex = lastItemIndex - pageSize;
    const currentItems = data.slice(firstItemIndex, lastItemIndex);

    const totalPages = Math.ceil(data.length / pageSize);

    const changePage = (number) => {
        setCurrentPage(number);
    };

    // 관리자 추가 버튼 클릭시 실행 함수
    const onClickAdd = () => {
            // 관리자 추가 이중 확인
            const isConfirmed = window.confirm(`관리자를 추가하시겠습니까?`);
            if(isConfirmed){
                navigate('/ManagerAddPage')
            } else {
                window.location.reload(); // 페이지 새로고침
            }
    }

    return (
        <div className={styles.managerWrapper}>
            <Navbar selectedPage={"관리자 관리"}></Navbar>
            <div className={styles.managerContainer}>
                <p className={styles.mainText}>관리자 조회</p>
                <div className={styles.searchDiv}>
                    <input className={styles.searchInput} type="search" name="searchName" value={form.searchName} onChange={onChange} placeholder="이름 검색"></input>
                    <button className={styles.searchButton} onClick={onClickSearch}>검색</button>
                </div>
                <table className={styles.managerTable}>
                    <thead>
                        <tr>
                            <th className={styles.tableThNum}>목록</th>
                            <th className={styles.tableTh}>이름</th>
                            <th className={styles.tableTh}>아이디</th>
                            <th className={styles.tableTh}>전화번호</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                (currentId === "root" || item.managerId !== "root") && ( //루트 계정만 루트의 정보를 조회 가능 (나머지 계정은 루트 계정의 존재 확인 불가)
                                <tr className={styles.tableTr} key={index} onClick={() => navigate(`/ManagerUpdatePage/${item.name}/${item.managerId}`)}>
                                    <td className={styles.tableTdNum}>{index + 1}</td>
                                    <td className={styles.tableTd}>{item.name}</td>
                                    <td className={styles.tableTd}>{item.managerId}</td>
                                    <td className={styles.tableTd}>{item.tel}</td>
                                </tr>
                                )
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', fontFamily: 'Arial, Helvetica, sans-serif'}}>검색 결과 없음</td>
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
                <div className={styles.addDiv}><button className={styles.addButton} onClick={(onClickAdd)}>관리자 추가</button></div>
            </div>
        </div>
    );
}

export default ManagerPage;