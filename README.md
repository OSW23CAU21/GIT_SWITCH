## OSW23CAU21 

### 팀원

| 학번       | 이름 |
|----------|----|
| 20182213 | 김명진 | 
|          | 김유진 |
| 20172861 | 김재민 |
| 20165545 | 조현우 |

## 프로젝트 세팅법

1. react-scripts 다운받고 실행하기 
```
// yarn을 사용 시
1. yarn add react-scripts
2. yarn upgrade
3. yarn start

// npm 사용 시
1. npm install -save react-scripts
2. npm update
3. npm start 
```

2. localhost:3000 접속


### About FileManagement. (05/07)
1. Electron과 결합하여 로컬스토리지 접근 가능.
2. 더블클릭 이용하여 파일 브라우징 가능. 
3. 현재 상대경로로 파일 매니징을 하고 있음.
4. unStaged, Staged와 결합 완료, gui상의 디렉토리와 US/S상의 정보를 동기화 함. 

### Remaining issue (05/07)
1. 상대 경로로만 탐색중, 절대경로 추가 필요함 (프로그램 시작시 Menu바에서 경로 받아오기)
2. 경로 설정시 '/'를 사용 중, 문제는 윈도우는 '\' 사용, path.join 사용시 해결 가능 
3. main.js, 백엔드 조금 더 깔끔하게 동작해야할 필요성 있음.

### Todo. (05/07)
1. 메뉴바에서, 경로 설정 버튼을 누르면, OS 내부의 파일 탐색기 작동. 
2. 파일탐색기에서 선택한 파일을 포함한 폴더 또는 선택한 폴더가 Root가 되어 Gui, US/S 출력. 
3. isomorphic_git과 main.js 연결. 
4. 연결한 후 US/S, menubar에서 쓸 수 있는 event handler 작성하기.
