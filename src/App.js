import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// pages
import Navbar from "./components/auth/Navbar";
import FirstPage from "./components/pages/main/FirstPage";     // 로그인 전 첫 페이지
import LoginPage from "./components/pages/login/LoginPage";    // 로그인
import IdFindPage from "./components/pages/login/IdFindPage";  // 로그인
import PwFindPage from "./components/pages/login/PwFindPage";  // 로그인
import MainPage from "./components/pages/main/MainPage";              // 메인
import TypeResultPage from "./components/pages/main/TypeResultPage";  // 메인
import ManagerPage from "./components/pages/manager/ManagerPage";                 // 관리자
import ManagerAddPage from "./components/pages/manager/ManagerAddPage";           // 관리자
import ManagerUpdatePage from "./components/pages/manager/ManagerUpdatePage";     // 관리자 
import ManagerPwChangePage from "./components/pages/manager/ManagerPwChangePage"; // 관리자
import UserManagePage from "./components/pages/user/UserManagePage"; // 사용자
import UserUpdatePage from "./components/pages/user/UserUpdatePage"; // 사용자
import UserRecordManagePage from "./components/pages/userRecord/UserRecordManagePage"; // 사용자 과거 기록
import UserRecordUpdatePage from "./components/pages/userRecord/UserRecordUpdatePage"; // 사용자 과거 기록
import AdManagePage from "./components/pages/advertisement/AdManagePage"; // 광고
import NoticeAddPage from "./components/pages/community/NoticeAddPage";       // 커뮤니티 - 공지사항
import NoticeManagePage from "./components/pages/community/NoticeManagePage"; // 커뮤니티 - 공지사항
import NoticeUpdatePage from "./components/pages/community/NoticeUpdatePage"; // 커뮤니티 - 공지사항
import QnaAnswerPage from "./components/pages/community/QnaAnswerPage";     // 커뮤니티 - QNA
import QnaManagePage from "./components/pages/community/QnaManagePage";     // 커뮤니티 - QNA
import TermsManagePage from "./components/pages/community/TermsManagePage"; // 커뮤니티 - 이용약관
import AIClassificationPage from "./components/pages/ai/AIClassificationPage"; // AI 분류 모델
import AIImprovementPage from "./components/pages/ai/AIImprovementPage";       // AI 개선도 모델

import './App.css';

function App(props) {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/NavBar" element={<Navbar/>}/>
        <Route index element={<FirstPage/>}/> {/* 루트 페이지 */}
        <Route path="/LoginPage" element={<LoginPage/>}/>
        <Route path="/IdFindPage" element={<IdFindPage/>}/>
        <Route path="/PwFindPage" element={<PwFindPage/>}/>
        <Route path="/MainPage" element={<MainPage/>}/>
        <Route path="/TypeResultPage" element={<TypeResultPage/>}/>
        <Route path="/ManagerPage" element={<ManagerPage/>}/>
        <Route path="/ManagerAddPage" element={<ManagerAddPage/>}/>
        <Route path="/ManagerUpdatePage/:managerNum/:managerId" element={<ManagerUpdatePage/>}/>
        <Route path="/ManagerPwChangePage" element={<ManagerPwChangePage/>}/>
        <Route path="/UserManagePage" element={<UserManagePage/>}/>
        <Route path="/UserUpdatePage/:userNum" element={<UserUpdatePage/>}/>
        <Route path="/UserRecordManagePage" element={<UserRecordManagePage/>}/>
        <Route path="/UserRecordUpdatePage/:userId/:recordId/:aiType" element={<UserRecordUpdatePage/>}/>
        <Route path="/AdManagePage" element={<AdManagePage/>}/>
        <Route path="/NoticeAddPage" element={<NoticeAddPage/>}/>
        <Route path="/NoticeManagePage" element={<NoticeManagePage/>}/>
        <Route path="/NoticeUpdatePage/:noticeNum" element={<NoticeUpdatePage/>}/>
        <Route path="/QnaAnswerPage/:qnaNum" element={<QnaAnswerPage/>}/>
        <Route path="/QnaManagePage" element={<QnaManagePage/>}/>
        <Route path="/TermsManagePage" element={<TermsManagePage/>}/>
        <Route path="/AIClassificationPage" element={<AIClassificationPage/>}/>
        <Route path="/AIImprovementPage" element={<AIImprovementPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
