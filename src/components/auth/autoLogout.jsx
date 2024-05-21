// 일정 시간 비활동 -> 세션 만료로 자동 로그아웃
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Modal 컴포넌트 import

const AutoLogout = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const IDLE_TIMEOUT = 60*60*1000; // 60분 (밀리초 단위)
  let idleTimer = null;

  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(logout, IDLE_TIMEOUT);
  };

  const logout = () => {
    setIsModalOpen(true); // 세션 만료 시 모달 열기
    localStorage.removeItem('ID');
    localStorage.removeItem('isLoggedIn');
    localStorage.clear();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/LoginPage'); // 로그인 페이지로 이동
    window.location.reload();
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        document.addEventListener('mousemove', resetIdleTimer);
        document.addEventListener('keypress', resetIdleTimer);
        document.addEventListener('mousedown', resetIdleTimer);
        document.addEventListener('touchstart', resetIdleTimer);
    
        resetIdleTimer(); // 초기 타이머 설정
    
        return () => {
          clearTimeout(idleTimer);
          document.removeEventListener('mousemove', resetIdleTimer);
          document.removeEventListener('keypress', resetIdleTimer);
          document.removeEventListener('mousedown', resetIdleTimer);
          document.removeEventListener('touchstart', resetIdleTimer);
        };
    }
  }, []);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageSrc={null}
      >
        <p>세션이 만료되었습니다. 다시 로그인해주세요.</p>
      </Modal>
    </>
  );
};

export default AutoLogout;
