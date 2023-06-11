<img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=OpenSourceSoftWare-Team21&fontSize=50" />


## 🧑‍🤝‍🧑 Contributor

| Gitname |
|----------|
| Catnap421 |
| Wayz2u |
| jamin-sub |
| jjgene |

* If you want to contribute to us, please write according to the eslint rules. When it is not working according to eslint, it is not compiled.

*  Also, make sure to promise to PR after working on the branch.

### Code of conduct
```
Language : javascript,(typescript)
Formatter : prettier
Linters : eslint 
```
* Allow import of multiple calsses, functions, variables, etc. in one line. (ex) import { useState, useEffect } from 'react';

## 🕰️ Project Duration

 * May 8 ~ June 12

## ⚙️ Used Collaboration tool

* Notion : https://little-butternut-09d.notion.site/c4d7e168711945188847b3f08fe8fccd?v=bb19e9db28f5434dad91f54ec12ccc10

* Discord : https://discord.gg/vPn2sy6y

## 📌 Prerequiste

<img src="https://img.shields.io/badge/Electron(v25.1.0)-47848F?style=for-the-badge&logo=electron&logoColor=white"/>
<img src="https://img.shields.io/badge/React(v18.2.0)-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js(v18.16.0)-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Yarn(1.22.19)-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white"/>
<img src="https://img.shields.io/badge/npm(9.5.1)-CB3837?style=for-the-badge&logo=npm&logoColor=white"/>

```
"isomorphic-git": "^1.23.0"
@mui/material (for dialogs, buttons, and UIs) "^5.13.0"  
@chonky fileexplorer (for file explorers) "^2.3.2"  
@chonky chonky-icon-fontawesome (for icons) "^2.3.2"  
@diff (for getting diff) "^5.1.0"  
@electron-store (for storing data with encryptions) "^8.1.0"  
```


## 💻 Initial Project Setting

### **You must have both yarn and npm to develop tests.**


### How to use

* git clone 
```
$ git clone https://github.com/OSW23CAU21/OSW21_GIT_CLIENT.git
```

* must install both yarn and npm  
```
$ yarn install
$ npm install
```

* if you want to start yarn (1.22.19)
```
$ yarn start
```

* if you want to start npm(9.5.1)
```
$ npm start 
```

### 🍎 Executable Environment

* MacOS environment 

### 🍎 Member's test environment

* 김명진 : MacOS Apple M1 Pro Ventura 13.0
* 김유진 : MacOS Apple M1 Air Ventura 13.1
* 김재민 : MacOS Apple M1 Pro Monterey 12.5.1(대여)
* 조현우 : MacOS Apple M1 Max Ventura 13.1

## Wireframe
![깃와이어프레임](https://github.com/OSW23CAU21/OSW21_GIT_CLIENT/assets/108653152/da455a9c-a975-4124-ae80-b2dcf4d6e15a)


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



