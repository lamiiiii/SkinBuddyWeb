import React, { useState, useRef, useEffect } from "react";
import {
  Link, /* 페이지 이동을 위해 */
  useNavigate
} from "react-router-dom";
import styles from './Dropdown.module.css';

function Dropdown5() {
  const navigate = useNavigate();

  return (
    <>
      <li className={styles.menuText} onClick={() => navigate('/NoticeManagePage')}>공지사항 관리</li>
      <li className={styles.menuText} onClick={() => navigate('/TermsManagePage')}>이용약관 관리</li>
      <li className={styles.menuText} onClick={() => navigate('/QnaManagePage')}>Q&A 관리</li>
    </>
  );
}
  
  export default Dropdown5;