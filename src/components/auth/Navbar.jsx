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

    const onClickMenu = (menuItem) => {
        setSelectedMenu(menuItem.name);
        setIsDropdownOpen(true);
    };

    const closeDropdown = () => {
        setSelectedMenu();
        setIsDropdownOpen(false);
    };

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
                    <Link className={styles.link} to={'/MainPage'}>
                        <img className={styles.logoImage} src="/img/SkinBuddy.png" alt="메인 로고 버튼" />
                    </Link>

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

                    {/* {menuItems.map((item) => (
                        <ul
                            key={item.name}
                            className={styles.ul}
                            onClick={() => { alert("로그인이 필요합니다."); navigate('/LoginPage') }}
                        >
                            <p className={styles.menuMainText}>{item.name}</p>
                        </ul>
                    ))} */}

                    <Link className={styles.link} to="/LoginPage">
                        <p className={styles.managerLoginButton}>관리자 로그인</p>
                    </Link>
                </>
            )}


            {isDropdownOpen && <div className={styles.overlay} onMouseEnter={closeDropdown}></div>}
        </div>
    )
}

export default Navbar;
