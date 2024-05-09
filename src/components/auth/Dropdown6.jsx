import React, { useState, useRef, useEffect } from "react";
import {
  Link, /* 페이지 이동을 위해 */
  useNavigate
} from "react-router-dom";
import styles from './Dropdown.module.css';

function Dropdown6() {
  const navigate = useNavigate();

  return (
    <>
      <li className={styles.menuText} onClick={() => navigate('/AiClassificationPage')}>여드름 분류 모델</li>
      <li className={styles.menuText} onClick={() => navigate('/AiImprovementPage')}>여드름 호전도 개선 모델</li>
    </>
  );
}
  
  export default Dropdown6;