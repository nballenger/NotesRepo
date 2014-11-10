# Notes on Git In Practice

By Mike McQuaid, Manning Publications, 2014

## Chapter Summaries

### Chapter 1: Local Git

#### 1.1 Why do programmers use Git?

* Created by Linus Torvalds to manage Linux kernel
* It's nice.
* Downsides: counterintuitive CLI, jargon-y, docs can be hard to follow

#### 1.2 Initial Setup

```Shell
$> git config --global user.name "My Name"
$> git config --global user.email me@myhost.com
$> git init MyRepo;cd MyRepo
```

#### 1.3 ``.git`` subdirectory

* Has the following:
    * ``config`` &mdash; local configuration
    * ``description`` &mdash; description file
    * ``HEAD`` &mdash; pointer to HEAD rev
    * ``hooks/`` &mdash; directory of event hooks
    * ``info/exclude`` &mdash; excluded files
    * ``objects/info`` &mdash; object information
    * ``objects/pack`` &mdash; pack files
    * ``refs/heads`` &mdash; branch pointers
    * ``refs/tags`` &mdash; tag pointers

#### 1.4 Creating a new commit: git add, git commit

* A commit is created from one or more changed or added files
* You change, review diffs, add to the index, create new commit, repeat
* The index is a staging area for commits, you can add to it incrementally
* Creating a commit stores the changes to the files in the index
* Every commit contains:
    * message
    * details of the author
    * unique commit reference in SHA-1 form
    * pointer to the preceding commit (the 'parent commit')
    * date created
    * pointer to contents of files when the commit was made
* Example:

```Shell
$> touch my_file.txt
$> git add my_file.txt
$> mkdir my_dir
$> touch my_dir/a my_dir/b my_dir/c
$> git add my_dir
$> git commit -m "Added a file and a directory with three files"
```

* **The Object Store**:
    * Types of objects: commits, blobs, trees, tags
    * commit object &mdash; has commit metadata, reference to root for this version
    * tree object &mdash; has references to blob objects for each file in the directory for this version, reference to tree objects for each subdirectory of the directory for this version
    * tree object &mdash; links to blob objects in directories
    * blob object &mdash; contains contents of the file for this version
* **Parent Commits**:
    * Every commit object points to its parent, except the initial commit
    * You can always trace the chain backwards
    * Git's history is the complete list of all commits, and references to any branches, merges, and tags in the repo
    * Viewing history:

```Shell
$> cd MyRepo
$> git log
```

### Chapter 2: Remote Git

* Git is distributed, there's no central repo--every user has a full repo locally
* All commits, branches, and history are stored offline unless sent/received explicitly by the user
* The remote workflow cycle is to fetch changes with ``fetch`` or ``pull``, make local changes, commit them, and then ``push`` them back to the remote
* Once you have a remote repo, you can add it as the remote in your local with ``git remote add origin https://github.com/username/MyRepo.git``
* You can verify the remote with ``git remote --verbose``
* You can alter remotes with ``git remote rename`` or ``git remote remove``
* You can push changes to the ``master`` branch of the ``origin`` remote with ``git push --set-upstream origin master``
* By using ``set-upstream`` you tell git that the local ``master`` branch should track the ``origin`` remote's ``master`` branch. The ``master`` branch on the ``origin`` remote is now the 'tracking branch' or 'upstream branch' for the local ``master`` branch.
* It is only necessary to set the upstream the first time you push to create a remote branch.
* If you use ``git push --all`` it will push all branches and tags
* If you use ``git push --force`` it will disable checks on the remote and allow rewriting the commit history.
* Since the tracking branch is the default push/pull location for a branch, you can just use ``git pull`` and ``git push`` with no arguments after setting it.
* You can clone a remote repo with ``git clone <repo-url>``
* That automatically sets the remote origin.
* You can pull changes and merge the remote branch with the current branch with ``git pull``
* You can optionally use ``git pull --rebase`` that does a rebase rather than a merge.
* To pull changes without merging to local branch, use ``git fetch`` To merge, you can use ``git merge origin/master`` or ``git pull``
* **Creating new local branch**
    * To make a series of commits that won't be in the master branch, you need to create a separate branch to hold those commits
    * The branch is actually a commit pointer that creates a semi-separate head
    * Tags are similar, but adhere to one commit and do not update
    * To create a new branch: ``git branch <branch-name>``, which creates a branch locally
    * Using ``git branch`` with no arguments will list the local branches
    * Creating a new branch **does not switch you to it**. You must switch manually.
    * Optionally you can give a second arg to ``git branch``, which will be the start point for the branch. Default is the branch you are currently on.
    * You can also set a ``--track`` flag to set the upstream of the branch
    * To change to a local branch, you have to use ``git checkout <branch-name>``
    *
