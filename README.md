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
1. Start page
![Start1](https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/30de1b09-e73e-45a7-a9ab-cf619d354ac9.)
![Start2](https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/226efa9a-fe21-47ed-bac8-0ef12844938d)
![Start3](https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/9101c7ba-0a93-43e0-8ba7-dd8ff848ca90)
![Start4](https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/ed60cf85-bb69-4a8d-b2f8-c23d65bd450f)

2. Commit
<img width="802" alt="commit_1" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/e0743b9a-8076-4704-a98c-9bd6c44cfd04">
<img width="806" alt="commit_2" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/00d3f5d5-bec5-48fd-a8dd-c86a20921bb2">
<img width="572" alt="commit_3" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/99e13f39-49e1-4eac-88aa-2eee55232978">
<img width="798" alt="commit_4" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/6e3b1c4b-8d79-48b8-b98b-731c9ae1fbb5">
<img width="801" alt="commit_5" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/d827d65c-836a-4130-96f1-4a206ef5f32b">
<img width="803" alt="commit_6" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/5f757075-0522-4deb-9bbc-07355c476

3. !<img width="798" alt="Init_1" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/cc4c18f4-1558-49bc-9e54-7bab277d2eb2">
<img width="799" alt="Init_2" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/8995c238-d250-4390-ba55-270813cfecc5">
<img width="801" alt="Init_3" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/7ee9b137-3f05-4e65-94cc-4825d22f23fd">
<img width="803" alt="Init_4" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/671e9dcf-7552-4f7a-bd88-1598c79d6818">
<img width="800" alt="Init_5" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/ad69ae19-5373-4b10-bd39-b534ad17c785">
<img width="803" alt="Init_6" src="https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/92094639/97487568-348e-4097-b1f4-829a75ec1b45">
dba">



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
