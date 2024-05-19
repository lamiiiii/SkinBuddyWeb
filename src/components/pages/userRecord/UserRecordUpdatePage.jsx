import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
    useParams,
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./UserRecordUpdatePage.module.css"; // UserRecordUpdatePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function UserHistoryUpdate() {
    const navigate = useNavigate();
    const [data, setData] = useState([]); // 트러블 분석 결과 데이터 받아오기
    const [currentData, setCurrentData] = useState([]); // 호전도 현재 결과 데이터 받아오기
    const [pastData, setPastData] = useState([]); // 호전도 지난 결과 데이터 받아오기
    const [improvement, setImprovement] = useState(); // 호전도 결과 메세지 받아오기
    const { userId, recordId, aiType } = useParams(); // 정보 받아오기
    let formattedAiType; // ai 유형 값 재저장
    if (aiType === "0") {
        formattedAiType = "AI 트러블 분석";
    } else if (aiType === "1") {
        formattedAiType = "AI 호전도 분석";
    } else { formattedAiType = "Unknown"; }

    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 과거 특정 진단 기록 내용 반환
    const returnHistory = () => {
        const requestData = {
            userId: userId,
            recordId: recordId,
            aiType: formattedAiType
        }

        const apiUrl = 'http://52.79.237.164:3000/user/skin/record/select'; // 과거 특정 진단 기록 반환 API

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, requestData)
            .then(response => {
                console.log(response.data);
                if (aiType === "0" && response.data["property"] === 200) {
                    // 유형 분석일 경우
                    setData(response.data["data"]);
                    // 유형에 따른 결과 저장
                    switch(response.data["data"].troubleType) {
                        case 0:
                            response.data["data"].troubleType = "깨끗하거나 면포";
                            break;
                        case 1:
                            response.data["data"].troubleType = "구진";
                            break;
                        case 2:
                            response.data["data"].troubleType = "농포";
                            break;
                        case 3:
                            response.data["data"].troubleType = "결절";
                            break;
                        default:
                            response.data["data"].troubleType = "알 수 없는 유형";
                    }
                    setCurrentData(""); setPastData(""); setImprovement("");
                } else if (aiType === "1" && response.data["property"] === 200) {
                    // 호전도 분석일 경우
                    setCurrentData(response.data["currentData"]);
                    setPastData(response.data["pastData"] ? response.data["pastData"] : "");
                    setImprovement(response.data["improvement"]);
                    setData("");
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('과거 특정 진단 기록 내용 반환 오류 발생: ', error);
            })
    }

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            returnHistory();
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, []);

    // 삭제 버튼 클릭시 실행 함수
    const onClickDelete = () => {
        const requestData = {
            // delete 할 때는 data로 묶어줘야 함!!!!!!!!!
            data: {
                recordId: recordId
            }
        };

        // 삭제 실행 이중 확인
        const isConfirmed = window.confirm(`사용자 [${userId}]의 ${recordId}번 진단기록을 정말로 삭제하시겠습니까?`);

        if (isConfirmed) {
            // API URL 설정
            const apiUrl = 'http://52.79.237.164:3000/user/skin/record/delete'
            // axios를 이용하여 DELETE 요청 보내기
            axios.delete(apiUrl, requestData)
                .then(response => {
                    // 요청이 성공한 경우 응답한 데이터 처리
                    // 서버 응답 처리
                    if (response.data["property"] === 200) {
                        alert(`사용자 [${userId}]의 ${recordId}번 진단기록이 삭제되었습니다`);
                        navigate("/UserRecordManagePage");
                    } else {
                        alert(`사용자 [${userId}]의 ${recordId}번 진단기록 삭제에 실패하였습니다`);
                    }
                })
                .catch(error => {
                    // 요청이 실패한 경우 에러 처리
                    console.error('전송 실패: ', error);
                    alert('진단기록 삭제에 실패하였습니다. 관리자에게 문의해주세요.')
                })
        } else {
            alert("진단기록 삭제 취소");
            window.location.reload(); // 페이지 새로고침
        }
    };

    return (
        <div className={styles.userRecordUpdateWrapper}>
            <Navbar selectedPage={"진단 기록 관리"}></Navbar>
            <div className={styles.userRecordUpdateContainer}>
                <p className={styles.mainText}>사용자 진단 기록 상세</p>
                {/* 진단 기록 날짜는 여기 없삼... */}
                <div className={styles.contentBox}>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>진단 기록 번호</p>
                        <p className={styles.idText}>{recordId}</p>
                    </div>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>아이디</p>
                        <p className={styles.idText}>{userId}</p>
                    </div>
                    <div className={styles.divBox}>
                        <p className={styles.miniText}>진단 유형</p>
                        <p className={styles.idText}>{formattedAiType}</p>
                    </div>
                    {/* 유형 - 유형 분류 결과 */}
                    {/* 번호별 무슨 유형인지 추가 필요 */}
                    {(aiType == 0) && data &&
                        <>
                            <div className={styles.divBox}>
                                <p className={styles.miniText}>유형 분류 결과</p>
                                <img className={styles.image} src={`data:image/jpeg;base64,${data.photo}`} alt="유형 분류 결과 사진" />
                                <p className={styles.miniText}>여드름 유형 분류</p>
                                <p className={styles.idText}>{data.troubleType}</p>
                            </div>
                        </>
                    }
                    <div className={styles.resultBox}>
                        {/* 호전도 - 최근 분석 결과 */}
                        {(aiType == 1) && currentData &&
                            <>
                                <div className={styles.divBox2}>
                                    <p className={styles.miniText}>최근 진단 내용</p>
                                    <img className={styles.image} src={`data:image/jpeg;base64,${currentData.photo}`} alt="최근 분석 결과 사진" />
                                    <p className={styles.miniText}>최근 진단 여드름 수</p>
                                    <p className={styles.idText}>{currentData.troubleTotal}</p>
                                </div>
                            </>
                        }
                        {/* 호전도 - 과거 분석 결과 */}
                        {(aiType == 1) && improvement != "처음으로 호전도 검사 서비스를 사용 하였으므로 과거 기록이 존재하지 않습니다" &&
                            <>
                                <div className={styles.divBox2}>
                                    <p className={styles.miniText}>과거 진단 내용</p>
                                    <img className={styles.image} src={`data:image/jpeg;base64,${pastData.photo}`} alt="과거 분석 결과 사진" />
                                    <p className={styles.miniText}>과거 진단 여드름 수</p>
                                    <p className={styles.idText}>{pastData.troubleTotal}</p>
                                </div>
                            </>
                        }
                    </div>
                    {/* 호전도 - 호전도 결과 메세지 */}
                    {(aiType == 1) && improvement &&
                        <>
                            <div className={styles.divBox}>
                                <p className={styles.miniText}>호전도 분석 결과</p>
                                <p className={styles.idText}>{improvement}</p>
                            </div>
                        </>
                    }
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={() => navigate('/UserRecordManagePage')}>목록</button>
                    <button className={styles.button} onClick={onClickDelete}>삭제</button>
                </div>
            </div>
        </div>
    );
}

export default UserHistoryUpdate;