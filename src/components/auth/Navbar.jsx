import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './Navbar.module.css';
import Dropdown from "./DropDown";

function Navbar() {
    const navigate = useNavigate();
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
            alert("로그아웃되었습니다.");
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
                            onClick={() => { navigate(item.path); window.location.reload(); }}
                            onMouseEnter={() => onClickMenu(item)}
                        // onMouseLeave={closeDropdown}
                        >
                            <p className={selectedMenu === item.name ? styles.menuMainTextChoose : styles.menuMainText}>
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

                    {menuItems.map((item) => (
                        <ul
                            key={item.name}
                            className={styles.ul}
                            onClick={() => alert("로그인이 필요합니다.")}
                        >
                            <p className={styles.menuMainText}>{item.name}</p>
                        </ul>
                    ))}

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
