# Notes on Pro Git, Second Edition

By Scott Chacon; Ben Straub, Apress, 2014

## Chapter 1: Getting Started

### Git Basics

* Each git commit is a snapshot of changes to the state of the repo file tree.
* Unchanged files are stored as links to last changed version.
* Most operations are local, so you get network latency only on non-local stuff
* All stored data is checksummed, referred to by checksum, via SHA-1
* Almost all actions in Git only add data to the database
* Git has three main states that files can be in:
    * Committed - data safely stored in local database
    * Modified - changed but not committed
    * Staged - marked a modified file to be in next commit
* Everything lives in ``myproject/.git``
* Basic git workflow:
    1. Modify files in working directory
    1. Stage files, adding snapshots to staging area
    1. Commit, which moves staged changes into snapshot

### First-Time Git Setup

* Changes to customize git environment via ``git config``
* Vars for git live in one of:
    * ``/etc/gitconfig``
    * ``~/.gitconfig`` or ``~/.config/git/config``
    * ``myproject/.git/config``
* Setting various useful settings:

```Shell
git config --global user.name "John Doe"
git config --global user.email jdoe@example.com
git config --global core.editor vim
```

## Chapter 2: Git Basics

### Getting a Git Repository

* ``git init`` will add a .git folder with necessary files
* ``git clone repo-address local-name`` pulls a remote repo

### Recording Changes to the Repository
