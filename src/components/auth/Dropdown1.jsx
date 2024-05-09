import React, { useState, useRef, useEffect } from "react";
import {
    Link, /* 페이지 이동을 위해 */
    useNavigate
} from "react-router-dom";
import styles from './Dropdown.module.css';

function Dropdown1() {
  const navigate = useNavigate();
    return (
      <>
        <li className={styles.menuText} onClick={() => navigate('/ManagerPage')}>관리자 관리</li>
        <li className={styles.menuText} onClick={() => navigate('/ManagerPwChangePage')}>비밀번호 변경</li>
      </>
    );
  }
  
  export default Dropdown1;