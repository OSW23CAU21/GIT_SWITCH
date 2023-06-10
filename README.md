## OSW23CAU21 
### 팀원

| 학번       | 이름   |
|----------| ------ |
| 20182213 | 김명진 |
| 20195910 | 김유진 |
| 20172861 | 김재민 |
| 20165545 | 조현우 |

## Version

```
electron 

```

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
## Executable Environment
##### MacOs환경에서 정상적으로 가능

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
Console창 Commit log  
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

### 4. Fileopen
<img src="./re_image/fileopen_1.png" width="380" height="380">&nbsp;&nbsp;&nbsp; <img src="./re_image/fileopen_2.png" width="380" height="400">  
##### GUI내부에서 파일 더블클릭시, 파일관리자 화면이 열립니다. 
##### 파일 관리자는 GIT 관리를 받는 경우 오픈되며(왼쪽) 관리를 받지 않는 경우 오픈되지 않습니다.(오른쪽)
##### 관리자 옵션은 하나만 설정 가능하며, git rm, git restore와 같이 깃 명령어를 기반으로 작동합니다.
##### 단, Rename을 선택하고 변경할 이름을 적지 않는다면, 변경사항은 적용되지 않습니다.
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

## Bugs. 
1. when you set Base directory in Git space, BaseName is not branch name. 
2. when you executes files in workspace sometimes it not opens properly. (getting .id error). 
3. when you opening added file to see git diff, error occurs 
-> solved by changing 'added', 'untracking' files openable status to false 
-> We think alert to when user try to open new files in git space


## for future supports. 
1. Developing WorkSpace File actions (Rename, Delete, CreateFile, CreateFolders)
2. Developing Gitspace File Actions (To Unstaged, To Staged)
3. Adding Git Inits to Switch Fab button following under conditions. 
    - when Base folder is not managed by git, must be plus Iconn (not apple or github)
    - when you clicks + buttons git Initiation will be executed. (same as create .git)
4. Switching three fab buttons by Switch Fab conditions. 
    - If we are in workspace User will access Three buttons (git_clone, branch managing, refresh) ## is MVP
    - If we are in gitspace User will accces Three buttons (commit, gitPush, gitPull) ## not MVP
5. saving User Infos by Encryption (folderchain, base's rootpath, Author name, Author email, access token to github)
6. loading User Infos by decryption


## Prerequsite. 
react
node.js
electron

@mui/material (for dialogs, buttons, and UIs)
@chonky fileexplorer (for file explorers)
@chonky chonky-icon-fontawesome (for icons)
@diff (for getting diff)
@electron-store (for storing data with encryptions)
