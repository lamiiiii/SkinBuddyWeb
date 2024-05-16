import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
    useParams,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./ManagerUpdatePage.module.css"; // ManagerUpdatePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function ManagerUpdatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ loginManagerId: "", managerName: "", managerId: "", managerTel: "", }); // 검색 입력 정보
    const [data, setData] = useState([]);
    const { managerNum } = useParams(); // manager table 상세 아이디 넘겨받기
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 특정 관리자 세부 정보 반환 
    const returnManagerInfo = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/manager/list'; // 관리자 목록 반환 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, { name: search })
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log(response.data)
                setData(response.data.list[0]);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('특정 관리자 세부 정보 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            if (managerNum) {
                const decodedManagerNum = decodeURIComponent(managerNum);
                console.log(decodedManagerNum);
                returnManagerInfo(decodedManagerNum);
            }
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, [managerNum]);

    // 폼에 입력한 정보 전달
    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [name]: value
        });
    };

    // 수정 완료 버튼 누르면 관리자 정보 수정하는 함수
    const onClickManagerUpdate = () => {
        // root 계정인지 확인
        if (currentId === "root") {
            // 수정 사항이 있는지 확인
            if (!form.managerName && !form.managerTel) {
                alert("수정 사항이 없습니다.");
            } else {
                const requestData = {
                    loginManagerId: currentId,
                    managerId: data.managerId,
                    name: form.managerName || data.name, // 수정한 부분 없으면 기존 값 불러옴
                    tel: form.managerTel || data.tel, // 수정한 부분 없으면 기존 값 불러옴
                };
                // 수정 완료 실행 이중 확인
                const isConfirmed = window.confirm(`사용자 "${data.managerId}" 님의 정보를 수정하시겠습니까?`);

                if (isConfirmed) {
                    // API URL 설정
                    const apiUrl = 'http://52.79.237.164:3000/manager/update'

                    // axios를 이용하여 PUT 요청 보내기
                    axios.put(apiUrl, requestData)
                        .then(response => {
                            // 요청이 성공한 경우 응답한 데이터 처리
                            if (response.data.property === 200) { // 전송 성공 && 수정 완료
                                alert("수정되었습니다.");
                                navigate("/ManagerPage");
                            } else if (response.data["property"] === 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
                                alert(response.data.message);
                                window.location.reload(); // 페이지 새로고침
                            } else if (response.data["property"] === 1006) {
                                alert(response.data.message);
                                window.location.reload(); // 페이지 새로고침
                            } else {
                                alert("다시 시도하세요.");
                                window.location.reload(); // 페이지 새로고침
                            }
                        })
                        .catch(error => {
                            // 요청이 실패한 경우 에러 처리
                            console.error('전송 실패: ', error);
                            alert('사용자 정보 수정 실패하였습니다. 관리자에게 문의하세요.');
                        })
                }
            }
        }
    }

    // 삭제 버튼 누르면 관리자 삭제하는 함수
    const onClickDelete = () => {
        // root 계정인지 확인
        if (currentId === "root") {
            const requestData = {
                data: {
                    loginManagerId: currentId,
                    managerId: data.managerId,
                }
            };
            // 수정 완료 실행 이중 확인
            const isConfirmed = window.confirm(`사용자 "${data.managerId}" 님의 계정을 삭제하시겠습니까?`);

            if (isConfirmed) {
                // API URL 설정
                const apiUrl = 'http://52.79.237.164:3000/manager/delete'
                // axios를 이용하여 DELETE 요청 보내기
                axios.delete(apiUrl, requestData)
                    .then(response => {
                        // 요청이 성공한 경우 응답한 데이터 처리
                        // 서버 응답 처리
                        if (response.data["property"] === 200) {
                            alert(response.data["message"]);
                            navigate("/ManagerPage");
                        } else if (response.data["property"] === 1006) {
                            alert(response.data["message"]);
                            window.location.reload();
                        } else {
                            alert("관리자 계정 삭제 오류");
                            window.location.reload();
                        }
                    })
                    .catch(error => {
                        // 요청이 실패한 경우 에러 처리
                        console.error('전송 실패: ', error);
                        alert('관리자 계정 삭제에 실패하였습니다. 관리자에게 문의해주세요.')
                    })

            } else {
                alert(`사용자 "${data.managerId}" 님의 계정을 삭제 취소`);
                window.location.reload(); // 페이지 새로고침
            }
        }
    }

    return (
        <div className={styles.managerUpdateWrapper}>
            <Navbar selectedPage={"관리자 관리"}></Navbar>
            <div className={styles.managerUpdateContainer}>
                <p className={styles.mainText}>{((currentId) === "root")?"관리자 정보 수정" : "관리자 정보"}</p>
                <div className={styles.contentBox}>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>아이디</p>
                        <p className={styles.idText}>{data.managerId}</p>
                    </div>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>관리자 명</p>
                        {(currentId === "root") ?
                            <input className={styles.inputBox} type="text" name="managerName" value={form.managerName} onChange={onChange} placeholder={data.name}></input>
                            : <p className={styles.idText}>{data.name}</p>
                        }
                    </div>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>전화번호</p>
                        {(currentId === "root") ?
                        <input className={styles.inputBox} type="text" name="managerTel" value={form.managerTel} onChange={onChange} placeholder={data.tel}></input>
                        : <p className={styles.idText}>{data.tel}</p>
                    }
                        </div>
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={() => navigate('/managerPage')}>목록</button>
                    {/* root계정 만 수정, 삭제 가능 */}
                    {(currentId === "root") ?
                        <>
                            <button className={styles.button} onClick={() => onClickManagerUpdate()}>수정 완료</button>
                            <button className={styles.button} onClick={() => onClickDelete()}>삭제</button>
                        </>
                        : null
                    }
                </div>
            </div>
        </div>
    );
}

export default ManagerUpdatePage;