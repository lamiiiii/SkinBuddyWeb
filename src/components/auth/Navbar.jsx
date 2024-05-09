import React, { useState, useRef, useEffect } from "react";
import {
    Link,
    useNavigate /* 페이지 이동을 위해 */
} from "react-router-dom";
import styles from './Navbar.module.css'; // Navbar.css 파일 import
import Dropdown from "./DropDown"; // 전체 dropdown 메뉴 합침

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // boolean 타입으로 저장
    const [selectedMenu, setSelectedMenu] = useState('');

    const menuItems = [
        { name: '관리자 관리', path: '/ManagerPage' },
        { name: '사용자 정보 관리', path: '/UserManagePage' },
        { name: '진단 기록 관리', path: '/UserRecordManagePage' },
        { name: '광고 관리', path: '/AdManagePage' },
        { name: '커뮤니티 관리', path: '/CommunityManagePage' },
        { name: 'AI 모델', path: '/AiModelPage' }
    ];

    const onClickMenu = (menuItem) => {
        setSelectedMenu(menuItem.name); // 현재 선택된 메뉴 업데이트
    };


    const onClickLogout = () => {
        // 사용자에게 로그아웃을 확인 받기
        const isConfirmed = window.confirm("로그아웃 하시겠습니까?");
        if (isConfirmed) {
            // 확인 받았을 경우 로컬 스토리지 비우기와 페이지 이동
            localStorage.clear();
            alert("로그아웃되었습니다.");
            navigate('/');
        } else {
            // 아무런 동작 없이 페이지에 남기

        }
    }

    return (

        <div className={styles.navbarWrapper}>
            {isLoggedIn ? <Link className={styles.link} to={'/MainPage'}><img className={styles.logoImage} src="/img/SkinBuddy.png" alt="메인 로고 버튼" /></Link>
                : <Link className={styles.link} to={'/'}><img className={styles.logoImage} src="/img/SkinBuddy.png" alt="메인 로고 버튼" /></Link>

            }
            {isLoggedIn && menuItems.map((item) => (
                <ul key={item.name} className={styles.ul} onClick={() => onClickMenu(item)}>
                    <p className={selectedMenu === item.name ? styles.menuMainTextChoose : styles.menuMainText}>
                        {item.name}
                    </p>
                    {selectedMenu === item.name && <div className={styles.dropDownMenu}><Dropdown /></div>}
                </ul>
            ))}
            {isLoggedIn ? <div className={styles.logoutButton} onClick={onClickLogout}>로그아웃</div>
                : <Link className={styles.link} to="/LoginPage"><p className={styles.managerLoginButton} >관리자 로그인</p></Link>
            }
        </div>

    )
}

export default Navbar