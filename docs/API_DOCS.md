IPCHANDLERS 

## {MVP #1} src/electron/branch/ 

## (#1) 'BR_createbranch' branchnames are not oids)

*input : branchName (for creation)
*output : result {result :  boolean, message : string }

## (#1) 'BR_deletebranch' branchnames are not oids)

*input : branchName (target of deletion)
*output : result {result : boolean, message : string}

## (#1) 'BR_renamebranch' branchnames are not oids)

*input : oldname, newname
*output : result {result : boolean, message : string}

## (#1) 'BR_checkout' branchnames are not oids)

*input : branchName (to checkout)
*ouptput : result {result : boolean, message : string}


## {MVP #3, #4} src/electron/gitfab/

## (#3) 'GF_mergebranch' (branchnames are not oids)

*input : current (current branch), target (target branch to merge)
*output : result {result : boolean, message : string}

## (#4) 'GF_gitclone' 

*input : url (github url), tokens (git hub access token, if needed)
*output : result {result : boolean, message : string }



## {MVP #3} src/electron/githistory

## (#3)'GH_gethistory'
*input : branchname (target to check history)
*output : {commit object from isomorphic-git} more info (https://isomorphic-git.org/docs/en/log)
