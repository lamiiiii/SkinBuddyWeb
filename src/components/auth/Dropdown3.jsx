import React, { useState, useRef, useEffect } from "react";
import {
  Link, /* 페이지 이동을 위해 */
  useNavigate
} from "react-router-dom";
import styles from './Dropdown.module.css';

function Dropdown3() {
  const navigate = useNavigate();

  return (
    <>
      <li className={styles.menuText} onClick={() => navigate('/UserRecordManagePage')}>진단 기록 관리</li>
    </>
  );
}

  
  export default Dropdown3;