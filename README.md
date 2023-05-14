## OSW23CAU21 

### 팀원

| 학번       | 이름   |
|----------| ------ |
| 20182223 | 김명진 |
| 20195910 | 김유진 |
| 20172861 | 김재민 |
| 20165545 | 조현우 |

## 프로젝트 세팅법
 
```
// git clone
git clone https://github.com/OSW23CAU21/OSW21_GIT_CLIENT.git

// yarn을 사용 시
1. yarn install
2. yarn start

// npm 사용 시
1. npm install
2. npm start 
```
## Description
### 1. Start page  
<img src="./re_image/start_1.png" width="380" height="400">&nbsp;&nbsp;&nbsp; <img src="./re_image/start_2.png" width="380" height="400">  
##### 프로그램 시작 시 그 어떤 폴더도 지정되어 있지 않습니다.(왼쪽)
##### 상단의 SETDIR을 눌러 OS파일매니저를 통해 Base를 지정해주세요.(오른쪽)
---
<img src="./re_image/start_3.png" width="380" height="400">&nbsp;&nbsp;&nbsp; <img src="./re_image/start_4.png" width="380" height="400">  
##### Base가 지정되고 나면, GUI를 통해 폴더정보가 출력되며, 더블클릭, 상단의 파일경로창을 통해 자유롭게 이동가능합니다.(왼쪽)
##### 단 Base는 .git을 포함하고 있는 폴더여야 git 기능을 지원합니다.(오른쪽)
---

### 2. Commit  
<img src="./re_image/commit_1.png" width="380" height="400"> &nbsp;&nbsp;&nbsp; <img src="./re_image/commit_2.png" width="380" height="380">  
##### 변경사항이 발생한 상태입니다(외부프로그램을 통해 폴더, 파일 변경 시 꼭 Command+R을 입력하여 새로고침 해주세요.)(왼쪽)
##### 하단의 unstaged창 내부의 요소를 클릭한 후 버튼을 누르면, 정상적응로 staging 기능을 이용 할 수 있습니다.(오른쪽)
---
<img src="./re_image/commit_3.png" width="380" height="400"> &nbsp;&nbsp;&nbsp; <img src="./re_image/commit_4.png" width="380" height="380">  
##### 변경된 내용의 콘솔 창입니다.(왼쪽)
##### 변경 내용을 Commit하고 싶다면, 상단의 COMMIT을 눌러주세요.(오른쪽)
---
<img src="./re_image/commit_5.png" width="380" height="380"> &nbsp;&nbsp;&nbsp; <img src="./re_image/commit_6.png" width="380" height="380">  
##### Commit Message, Name, E-mail을 입력하면 Commit하실 수 있습니다.(왼쪽)
##### Commit이 진행되면, Unstaged와 Staged 내부의 요소는 Commit된 내용에 맞게 변경됩니다.(오른쪽)
---
<img src="./re_image/commit_7.png" width="500" height="300">  
##### 마지막으로 Console창 Commit log이다.
---

### 3. Gitinit  
<img src="./re_image/Init_1.png" width="380" height="380">&nbsp;&nbsp;&nbsp; <img src="./re_image/Init_2.png" width="380" height="400">  
##### 완벽하게 Commit된 상태 즉 unmodified된 상태의 디렉토리입니다.(왼쪽) 
##### 그 디렉토리의 하위 폴더에는 .git은 없지만, Head참조를 통해 gitmanagement여부를 알 수 있습니다.(오른쪽)
---
<img src="./re_image/Init_3.png" width="380" height="400">&nbsp;&nbsp;&nbsp; <img src="./re_image/Init_4.png" width="380" height="400">  
##### 실행시, git init이 불가능하다는 popup이 발생됩니다.(왼쪽)
##### .git은 존재하지만, untracked 폴더인 testin을 가지는 디렉토리입니다.(오른쪽)
---
<img src="./re_image/Init_5.png" width="380" height="400">&nbsp;&nbsp;&nbsp; <img src="./re_image/Init_6.png" width="380" height="400">  
##### 해당 폴더로 내려가서 git Init을 시도 시 Base폴더를 확인하여 gitInit을 실행하지 않습니다.(왼쪽)
##### 다만 Base 폴더를 untracked인 하위 폴더로 설정시 .git을 gitInit을 통해 생성할 수 있습니다.(오른쪽)
---

## Wireframe
![깃와이어프레임](https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/108653152/da455a9c-a975-4124-ae80-b2dcf4d6e15a)


## 테스트 실행환경

김명진
- MacOS Apple M1 Pro Ventura 13.0

김유진
- MacOS Apple M1 Air Ventura 13.1

김재민 
- MacOS Apple M1 Pro Monterey 12.5.1(대여)

조현우
- MacOS Apple M1 Max Ventura 13.1

## History

### About gitStatus between Staged/Unstaged.(05/09)
1. 현재 디렉토리에서, 변경된파일, Staged, unstaged 된 파일을 구별하여 인자값으로 US/S components에 전달합니다. 
2. 전달양식은 다음과 같습니다 f_DirStat[{name : "깃 파일 이름", staged : 참 또는 거짓, status : "modified or untracked"}, {다른 파일 정보}]
3. 참고로 f_DirStat의 f는 filtered를 의미합니다. .폴더(숨김처리된), unmodified는 필터링을 거치기 때문에 정보가 올라가지 않습니다. 
4. 테스트이전에 꼭 main.js상단의 var AbsPath를 자신의 폴더 값으로 변경해주세요.

### About gitModify between staged/Unstaged. (05/10)
1. "선택한 파일 이동하기"를 누르면 staged, unstaged 상태에 따라 git 명령어가 실행됩니다. 
2. unstaged 에서 파일을 선택한 후 이동하기를 누르면 해당 파일에 대해 "git add" 실행
3. staged 에서 파일을 선택한 후 이동하기를 누르면 해당 파일에 대해 "git restore --staged"를 실행.


### Remaining issue (05/12)
1. main.js, 백엔드 조금 더 깔끔하게 동작해야할 필요성 있음.

### 경로작업.
1. 모든 경로를 절대 경로로 처리하도록 수정하였습니다. 
2. setDir버튼으로 Root 또는 Base가 될 폴더를 선택할 수 있습니다.
3. S/US에서 git 파일 전체를 보여주기로 함에 따라, f_DirStat내부의 4번째 요소인 gitName을 삭제하고 name으로 대체하였습니다.
4. 코드 내부에서 경로 값이 조금 더 잘 이해가 되도록, 변수 이름을 바꾸거나, 각주를 달았습니다.

