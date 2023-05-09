## OSW23CAU21 

### 팀원

| 학번       | 이름   |
|----------| ------ |
| 20182223 | 김명진 |
| 20195910 | 김유진 |
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

### About gitStatus between Staged/Unstaged.(05/09)
1. 현재 디렉토리에서, 변경된파일, Staged, unstaged 된 파일을 구별하여 인자값으로 US/S components에 전달합니다. 
2. 전달양식은 다음과 같습니다 f_DirStat[{name : "파일이름", staged : 참 또는 거짓, status : "modified or untracked"}, {다른 파일 정보}]
3. 참고로 f_DirStat의 f는 filtered를 의미합니다. .폴더(숨김처리된), unmodified는 필터링을 거치기 때문에 정보가 올라가지 않습니다. 
4. 전달되는 양식 값을 main.js의 getGitStat() 하단 "console.log(f_DirStat);"에서 확인 할 수 있게 하였습니다.(로그는 터미널에서 확인 가능.)
5. 테스트이전에 꼭 main.js상단의 var AbsPath를 자신의 폴더 값으로 변경해주세요.


### Remaining issue (05/09)
1. 상대 경로로만 탐색중, 절대경로 추가 필요함 (프로그램 시작시 Menu바에서 경로 받아오기)
2. 경로 설정시 '/'를 사용 중, 문제는 윈도우는 '\' 사용, path.join 사용시 해결 가능 
3. main.js, 백엔드 조금 더 깔끔하게 동작해야할 필요성 있음.
4. 폴더 또는 파일의 이름이 byte보다 작으면 검색이 안되는 issue가 있습니다. Example "src"는 조회자체가 안됩니다. 따라서 폴더는 조회하지 않기로 결정했습니다. (파일만 추적.)
5. .git 내부 또는 blind 처리된 폴더 내부의 status가 정상적으로 출력되지 않는 버그가 있습니다.

### Todo. (05/09)
1. 메뉴바에서, 경로 설정 버튼을 누르면, OS 내부의 파일 탐색기 작동. 
2. 파일탐색기에서 선택한 파일을 포함한 폴더 또는 선택한 폴더가 Root가 되어 Gui, US/S 출력. 
3. isomorphic_git과 main.js 연결. (완료)
4. 연결한 후 US/S, menubar에서 쓸 수 있는 event handler 작성하기. (진행중)