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
    const { managerNum } = useParams(); // manager table 상세 index 번호 넘겨받기

    // 특정 관리자 세부 정보 반환 
    const returnManagerInfo = (search) => {
        const apiUrl = 'http://52.79.237.164:3000/manager/list'; // 관리자 목록 반환 API URL

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, { name: search })
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('특정 관리자 세부 정보 반환 응답: ', response.data.list[managerNum]);
                setData(response.data.list[managerNum]);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('특정 관리자 세부 정보 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        returnManagerInfo("all");
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

        // // 수정 완료 버튼 누르면 관리자 정보 수정하는 함수
        // const onClickManagerUpdate = () => {
        //     // 수정 사항이 있는지 확인
        //     if (!form.managerName && !form.managerTel) {
        //         alert("수정 사항이 없습니다.");
        //         console.log("수정 사항 없음");
        //     } else{
        //         const requestData = {
        //             loginManagerId: 
        //             userId: data.userId,
        //             nickname: form.nickname || data.nickname, // 수정한 부분 없으면 기존 값 불러옴
        //             tel: form.tel || data.tel, // 수정한 부분 없으면 기존 값 불러옴
        //         };
        //         console.log("수정 요청 보낼 사용자 정보: ", requestData);
        
        //         // 수정 완료 실행 이중 확인
        //         const isConfirmed = window.confirm(`사용자 "${data.userId}" 님의 정보를 정말로 수정하시겠습니까?`);
        
        //         if (isConfirmed) {
        //             // API URL 설정
        //             const apiUrl = 'http://52.79.237.164:3000/user/profile/update'
        
        //             // axios를 이용하여 PUT 요청 보내기
        //             axios.put(apiUrl, requestData)
        //                 .then(response => {
        //                     // 요청이 성공한 경우 응답한 데이터 처리
        //                     console.log('전송 성공: ', response.data);
        //                     if (response.data.property == 200) { // 전송 성공 && 수정 완료
        //                         alert(`사용자 "${data.userId}" 님의 정보 수정 성공`);
        //                         navigate("/UserManagePage");
        //                     } else if (response.data.property == 304) { // 전송 성공했으나 수정 불가 사유 메세지 띄우기
        //                         alert(response.data.message);
        //                         window.location.reload(); // 페이지 새로고침
        //                     }
        //                 })
        //                 .catch(error => {
        //                     // 요청이 실패한 경우 에러 처리
        //                     console.error('전송 실패: ', error);
        //                     alert('사용자 정보 수정 실패~~~~~~~~~')
        //                 })
        //         }
        //     }
        // }

    return (
        <div className={styles.managerUpdateWrapper}>
            <Navbar></Navbar>
            <div className={styles.managerUpdateContainer}>
                <p className={styles.mainText}>관리자 정보 수정</p>
                <div className={styles.contentBox}>
                    <div className={styles.managerNameBox}>
                        <p className={styles.nameText}>관리자 명</p>
                        <input className={styles.nameInputBox} type="text" name="managerName" value={form.managerName} onChange={onChange} placeholder={data.name}></input>
                    </div>
                    {/* <p className={styles.sideText}>회원정보</p> */}
                    <div className={styles.managerIdBox}>
                        <p className={styles.miniText}>아이디</p>
                        <p className={styles.idText}>{data.managerId}</p>
                    </div>
                    <div className={styles.managerTelBox}>
                        <p className={styles.miniText}>전화번호</p>
                        <input className={styles.inputBox} type="text" name="managerTel" value={form.managerTel} onChange={onChange} placeholder={data.tel}></input>
                    </div>
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={() => navigate('/managerPage')}>목록</button>
                    <button className={styles.button}>수정 완료</button>
                    <button className={styles.button}>삭제</button>
                </div>
            </div>
        </div>
    );
}

export default ManagerUpdatePage;