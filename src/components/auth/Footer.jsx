import React from "react";
import styles from './Footer.module.css'

function Footer() {
    return(
        <div className={styles.footerWrapper}>
            <p className={styles.mainText}>스킨버디 (SkinBuddy)</p>
            <p className={styles.miniText}>&nbsp;팀장: 박정재 &nbsp;|&nbsp; 팀원: 송지우, 백지연, 김규리 &nbsp;|&nbsp; 팀명: 컴붕이컹스</p>
            <p className={styles.miniText}>&nbsp;E-mail: parkjj000224@gachon.ac.kr &nbsp;|&nbsp; 주소: 경기 성남시 수정구 성남대로 1342</p>
            <p className={styles.miniText}>&nbsp;스킨버디는 간편하고 신뢰성 있는 방식으로 사용자의 피부 건강증진을 돕습니다. 개인 맞춤형 AI 피부관리 서비스를 제공합니다.</p>
            <p className={styles.miniText}>&nbsp;분석을 넘어 관리까지 스킨버디</p>
            <p className={styles.lastText}>© SkinBuddy Co., Ltd. All rights reserved
</p>
        </div>
    )
}

export default Footer;