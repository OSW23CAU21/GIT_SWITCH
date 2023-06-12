## (P2 MVP#1) 'BR_createbranch' (src/electron/branch)

```
*input : branchName (for creation)

*output : result {result :  boolean, message : string }
```

## (P2 MVP#1) 'BR_deletebranch' (src/electron/branch)

```
*input : branchName (target of deletion)

*output : result {result : boolean, message : string}
```

## P2 MVP#1) 'BR_renamebranch' (src/electron/branch)

```
*input : oldname, newname

*output : result {result : boolean, message : string}
```

## (P2 MVP#1) 'BR_checkout' (src/electron/branch)

```
*input : branchName (to checkout)

*ouptput : result {result : boolean, message : string}
```



## (P2 MVP#2) 'GF_mergebranch' (src/electron/gitfab)

```
*input : current (current branch), target (target branch to merge)

*output : result {result : boolean, message : string}
```


## (P2 MVP#4) 'GF_gitclone' (src/electron/gitfab)

```
*input : url (github url), tokens (git hub access token, if needed)

*output : result {result : boolean, message : string }
```


## (P2 MVP#3)'GH_gethistory' (src/electron/githistory)

```
*input : branchname (target to check history)

*output : {commit object from isomorphic-git} more info (https://isomorphic-git.org/docs/en/log)
```
