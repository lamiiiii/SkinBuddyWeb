# SkinBuddyWeb 관리자

## 📌 서비스 개요  
**SkinBuddy**는 AI 기술을 활용하여 사용자 맞춤형 피부 진단 및 개선 솔루션을 제공하는 미용 서비스입니다.  
**SkinBuddy Admin**은 해당 서비스의 운영 및 관리를 위한 관리자 웹페이지입니다.  

### 서비스 선정 이유  
- **미용에 대한 관심 증가**: 피부 건강 및 관리에 대한 관심이 지속적으로 증가하는 추세  
- **피부 진단의 번거로움 해결**: 기존에는 병원을 방문해야만 피부 고민을 진단받을 수 있었음  
- **AI 기반 피부 진단 서비스**: 최신 기술을 활용하여 사용자 맞춤형 피부 분석 및 개선 솔루션 제공  

---

## 📌 서비스 소개  
### 인증 및 계정 관리  
- 로그인, 아이디 찾기, 비밀번호 찾기  
![초기화면](https://github.com/user-attachments/assets/95852e9e-a21f-4ab1-9832-2c128770da93)


### 대시보드 *(비로그인자도 더미 데이터로 확인 가능)*  
- 관리자 현황  
- 사용자 현황  
- 현재 가입자 수  
- AI 진단 기록 현황  
- 피부 MBTI 검사 결과  
- 사용자 피부 유형 분포도 (그래프)  
- 광고 현황  
- 커뮤니티 현황  
- AI 모델 재학습 결과  

![대시보드](https://github.com/user-attachments/assets/e9eed233-d9ee-4458-bd94-4984994f42b9)

### 관리 기능  
#### 관리자 관리  
- 비밀번호 변경  
- 관리자 조회, 추가, 수정, 삭제  

![관리자 관리](https://github.com/user-attachments/assets/ae57b157-f5f3-4ea0-80b6-51845ab7a234)

#### 사용자 정보 관리  
- 사용자 조회  
- 사용자 정보 조회, 수정, 삭제  

![사용자 관리](https://github.com/user-attachments/assets/6acd785b-fbbc-4fa5-a92b-96ee57a302a7)


#### 진단 기록 관리  
- AI 진단 결과 조회 및 관리  

![진단기록 관리](https://github.com/user-attachments/assets/ba556863-a5dd-48cf-bf60-f2527c1677df)


#### 광고 관리  
- 배너 광고 추가, 수정, 삭제

![광고관리](https://github.com/user-attachments/assets/2584fa06-78aa-4e92-9bff-db5589dfa65d)


#### 커뮤니티 관리  
- 공지사항 관리 (조회, 수정, 삭제)  
- 이용약관 관리  
- Q&A 관리 (상세 내용 수정, 삭제)

![커뮤니티 관리](https://github.com/user-attachments/assets/dbae606e-eef8-4581-b907-17f119acaf5f)


#### AI 모델 관리  
- **여드름 분류 모델** 관리  
  - Learning rate, epochs, patience 값 입력 후 재학습  
- **여드름 호전도 개선 모델** 관리  
  - Learning rate, weight decay, epochs, patience 값 입력 후 재학습

![ai관리](https://github.com/user-attachments/assets/a9efd3db-c4eb-4fae-9ee7-d3ca6f4bca7a)


---

## ⚙️ 개발 환경

### Frontend Stack
- React 18.2.0
- axios 1.6.8
- npm 10.9.1
- chart.js 4.4.2
- styled-components 6.1.8

### Node.js 버전
- Node.js 버전: v20.12.0

### 패키지 매니저
- 사용된 패키지 매니저: npm

---

## 📂 폴더 구조

```
.
├── src
│   ├── components
│   │   ├── auth
│   │   ├── pages
│   │   │   ├── login
│   │   │   ├── community
│   │   │   └── main
│   ├── fonts
│   ├── index.js
│   ├── App.js
│   └── App.css
```

---

## 📌 프로젝트 실행

1. Install dependencies

   ```bash
   npm install
   ```

