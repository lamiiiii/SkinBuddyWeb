import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./AdManagePage.module.css"; // AdManagePage.css 파일 import
import axios from "axios"; // api 통신을 위해 axios install & import


function AdManagePage() {
    const navigate = useNavigate();
    return(
        <div className={styles.AdManageWrapper}>
            <Navbar></Navbar>
            <div className={styles.AdManageContainer}>
                <p className={styles.mainText}>광고 관리</p>
            </div>
        </div>
    );
}

export default AdManagePage;