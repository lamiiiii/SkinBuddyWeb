import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import Footer from "../../auth/Footer"; // 하단 Footer Component import
import styles from "./AdManagePage.module.css"; // AdManagePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import

function AdManagePage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]); // 트러블 분석 결과 데이터 받아오기
    const [selectedFile, setSelectedFile] = useState(null); // 파일 선택 상태

    // const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // 로그인 상태 여부 저장

    // 최상단 스크롤 버튼 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 광고 목록 반환
    const returnAdList = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/advertise/list'; // 광고 목록 반환 API

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                setData(response.data.data);
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('광고 목록 반환 오류 발생: ', error);
            });
    };

    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (isLoggedIn) {
            returnAdList();
        } else {
            alert("잘못된 접근 방법입니다. 다시 시도해주세요.");
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    // 파일 선택 핸들러
    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            resizeImage(file, 1024, 768, (resizedFile) => {
                setSelectedFile(resizedFile);
            });
        }
    };

    // 이미지 리사이즈 함수
    const resizeImage = (file, width, height, callback) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    callback(new File([blob], file.name, { type: file.type }));
                }, file.type);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // 광고 추가 함수
    const onClickAdd = () => {
        if (!selectedFile) {
            alert("파일을 선택해주세요.");
            return;
        }

        // 파일명 인코딩
        const encodedFileName = encodeURIComponent(selectedFile.name);
        const formData = new FormData();
        formData.append('photoFile', selectedFile, encodedFileName); // 인코딩된 파일명 추가
        const apiUrl = 'http://52.79.237.164:3000/manager/advertise/create'; // 광고 업로드 API

        // axios를 이용하여 POST 요청 보내기
        axios.post(apiUrl, formData)
            .then(response => {
                if (response.data.property === 200) {
                    alert("광고가 성공적으로 추가되었습니다.");
                    returnAdList(); // 목록 갱신
                    setSelectedFile(null); // 파일 선택 초기화
                } else {
                    alert("광고 추가에 실패하였습니다.");
                }
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('광고 추가 오류 발생: ', error);
                alert('광고 추가 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
    };

    // 광고 삭제 함수
    const onClickDelete = (advertisementId) => {
        const requestData = {
            data: {
                advertisementId: advertisementId
            }
        };

        const isConfirmed = window.confirm(`${advertisementId}번 광고를 삭제하시겠습니까?`);

        if (isConfirmed) {
            const apiUrl = 'http://52.79.237.164:3000/manager/advertise/delete';

            axios.delete(apiUrl, requestData)
                .then(response => {
                    if (response.data.property === 200) {
                        alert(`${advertisementId}번 광고가 삭제되었습니다.`);
                        returnAdList(); // 목록 갱신
                    } else {
                        alert(`${advertisementId}번 광고 삭제에 실패하였습니다`);
                    }
                })
                .catch(error => {
                    console.error('광고 삭제 오류 발생: ', error);
                    alert('광고 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
                });
        }
    };

    return (
        <div className={styles.AdManageWrapper}>
            <Navbar selectedPage={"광고 관리"} />
            <div className={styles.AdManageContainer}>
                <p className={styles.mainText} onClick={() => { navigate('/AdManagePage'); window.location.reload(); }}>광고 관리</p>
                <div className={styles.contentBox}>
                    {data.length > 0 ? (
                        data.map(ad => (
                            <div key={ad.advertisementId} className={styles.divBox}>
                                <p className={styles.miniText}>Ad Number.{ad.advertisementId}</p>
                                <img className={styles.image} src={`data:image/jpeg;base64,${ad.photo}`} alt="광고 사진" />
                                <button className={styles.button} onClick={() => onClickDelete(ad.advertisementId)}>삭제</button>
                            </div>
                        ))
                    ) : (
                        <p className={styles.miniText}>광고를 추가해주세요.</p>
                    )}
                </div>
                <div className={styles.addDiv}>
                    <input className={styles.addButton} type="file" onChange={onFileChange} />
                    <button className={styles.addButton} onClick={onClickAdd}>광고 추가</button>
                </div>
            </div>
            <button className={styles.topButton} onClick={scrollToTop}>Top</button>
            <Footer></Footer>
        </div>
    );
}

export default AdManagePage;
