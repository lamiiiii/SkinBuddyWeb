import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './Navbar.module.css';
import Dropdown from "./DropDown";

function Navbar({ selectedPage }) {
    const navigate = useNavigate();
    const currentId = localStorage.getItem("ID");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const [selectedMenu, setSelectedMenu] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuItems = [
        { name: '관리자 관리', path: '/ManagerPage', num: 1 },
        { name: '사용자 정보 관리', path: '/UserManagePage', num: 2 },
        { name: '진단 기록 관리', path: '/UserRecordManagePage', num: 3 },
        { name: '광고 관리', path: '/AdManagePage', num: 4 },
        { name: '커뮤니티 관리', path: '/NoticeManagePage', num: 5 },
        { name: 'AI 모델', path: '/AIClassificationPage', num: 6 }
    ];

    // 앱 다운로드 함수
    const handleAppDownload = () => {
        const isConfirmed = window.confirm("SkinBuddy 앱을 다운받으시겠습니까?");
        if(isConfirmed) {
            window.location.href = "https://expo.dev/artifacts/eas/iivJ6gTL3g3FznWLahQiKC.apk";
        }
    };

    // 메뉴 선택 함수
    const onClickMenu = (menuItem) => {
        setSelectedMenu(menuItem.name);
        setIsDropdownOpen(true);
    };

    // 드롭다운 닫기 함수
    const closeDropdown = () => {
        setSelectedMenu();
        setIsDropdownOpen(false);
    };

    // 로그아웃 함수
    const onClickLogout = () => {
        const isConfirmed = window.confirm("로그아웃 하시겠습니까?");
        if (isConfirmed) {
            localStorage.clear();
            navigate('/');
        }
    }

    return (
        <div className={styles.navbarWrapper}>
            {isLoggedIn ? (
                <>
                    <img className={styles.logoImage} src="/img/SkinBuddy.png" alt="메인 로고 버튼" onClick={() => { navigate('/MainPage'); window.location.reload(); }} />


                    {menuItems.map((item) => (
                        <ul
                            key={item.name}
                            className={styles.ul}
                            // onClick={() => {}}  // 클릭하면 그냥 바로 메뉴로 이동하는 것도 넣고 싶은데 일단 보류
                            onMouseEnter={() => onClickMenu(item)}
                        // onMouseLeave={closeDropdown}
                        >
                            <p className={selectedMenu === item.name ? styles.menuMainTextCursor : (selectedPage === item.name ? styles.menuMainTextChoose : styles.menuMainText)}>
                                {item.name}
                            </p>
                            {selectedMenu === item.name && isDropdownOpen && (
                                <div className={styles.dropDownMenu}><Dropdown cursorMenu={item.num} /** 메뉴 번호 전달 */ /></div>
                            )}
                        </ul>
                    ))}
                    <div className={styles.logoutButton} onClick={onClickLogout}>로그아웃</div>

                </>

            ) : (
                <>
                    <Link className={styles.link} to={'/'}>
                        <img className={styles.logoImage} src="/img/SkinBuddy.png" alt="메인 로고 버튼" />
                    </Link>

                    {/* 상태바 가림 */}
                    {/* {menuItems.map((item) => (
                        <ul
                            key={item.name}
                            className={styles.ul}
                            onClick={() => { alert("로그인이 필요합니다."); navigate('/LoginPage') }}
                        >
                            <p className={styles.menuMainText}>{item.name}</p>
                        </ul>
                    ))} */}
                    <div className={styles.firstButtons}>
                        <Link to="#" className={styles.link} onClick={handleAppDownload}>
                            <p className={styles.appDownloadButton}>앱 다운로드</p>
                        </Link>
                        <Link className={styles.link} to="/LoginPage">
                            <p className={styles.managerLoginButton}>관리자 로그인</p>
                        </Link>
                    </div>
                </>
            )}


            {isDropdownOpen && <div className={styles.overlay} onMouseEnter={closeDropdown}></div>}
        </div>
    )
}

export default Navbar;
