# Jump Start Git, 2nd Ed.

By Shaumik Daityari; Sitepoint, May 2020; ISBN 9781925836349

# Chapter 1: Introduction

* Git is a distributed VCS for multiple users
* Created by Linus Torvalds
* Junio Hamano is the primary dev
* Primary objectives were distributed, reliable, and fast
* Developed to version the Linux codebase
* Distributed VCS advantages:
    * work without worrying about concurrent edits from others
    * any distributed copy contains the entire version history
    * you can work offline from the repository
    * you can sync repos between distributed locations without a central repo

# Chapter 2: Getting Started with Git

## The Git Workflow

* You have to initialize a repository locally by checkout or init
* Basic operations performed on a project:
    * Track - add files to track them
    * Stage - edit files, then add to stage them
    * Commit - create a commit reflective of the current set of staged edits
    * Push (optional) - push commit(s) to a remote location

## First Commands

### Configuration

```shell
git config --global user.name "Nick"
git config --global user.email "nick@nickballenger.com"
git config --global color.ui "auto"
git config --list
```

* Config settings are typically in `~/.gitconfig`

### Create a Project

```shell
mkdir my_git_project
cd my_git_project
git init
```

### Create an initial commit

```shell
echo "some content" > my_file_01
cp my_file_01 my_file_02
cp my_file_01 my_file_03
git add my_file*
git commit -m "First commit"
git log
git show <ref_of_first_commit>
```

## Commands so far

* `git init` - initialize a directory as a git repo
* `git status` - show current status of the repo
* `git add` - stage a file
* `git commit` - create a commit from staged
* `git diff` - show current changes to tracked files
* `git log` - list commits
* `git show <ref>` - show commit info
* `git push` - push state to remote(s)

## Remote repositories

* 'Remote' - An external copy of a repository
* Adding a remote to the local:

    ```shell
    git remote add origin <URL_OF_REMOTE>
    git push -u origin master
    ```

# Chapter 3: Branching in Git

## What are Branches?

* A new branch is a new copy of the project that will not affect `master`
* You can also merge a branch back into `master` or another branch
* Commits to a branch do not affect other branches until merged
* Commands:
    * `git branch` - list local branches and highlight current
    * `git branch -a` - list branches with remotes

## Create a Branch

* Create and check out separately:

    ```shell
    git branch my_test_branch
    git checkout my_test_branch
    ```

* Single command:

    ```shell
    git checkout -b new_test_branch
    ```

* Branches are by default created based on the current active branch
* To base a branch on a specific commit, you would use

    ```shell
    git checkout -b old_commit_branch <SOME_OLDER_REF>
    ```

* Rename the active branch:

    ```shell
    git branch -m renamed_branch
    ```

## Delete a Branch

* Delete a branch:

    ```shell
    git branch -d new_test_branch
    git branch -D new_test_branch
    ```

### Branches and `HEAD`

* The `HEAD` ref is a synonym for the tip of a branch

### Advanced Branching: Merging Branches

Creating two branches and some dummy commits:

```shell
mkdir git_test
cd git_test
git init

git checkout -b alpha_branch
echo "first line" > my_file.txt
git add my_file.txt
git commit -m "added first line"

echo "second line" >> my_file.txt
git add my_file.txt
git commit -m "added second line"

echo "third line" >> my_file.txt
git add my_file.txt
git commit -m "added third line"

git checkout -b new_feature

echo "fourth line" >> my_file.txt
git add my_file.txt
git commit -m "added fourth line in new branch"

git checkout alpha_branch
git merge new_feature
```

# Chapter 4: Using Git in a Team

* 'Cloning' - creating a copy of a remote repo
* If you clone a repo, the source you cloned it from is the `origin` remote
* Syntax: `git clone <REPO_URL>`
* You can verify remotes with `git remote -v`
* There are multiple protocols for the URL:
    * local: `/path/to/local/remote`
    * Git: `git://hostname.tld/path/project.git` (insecure, RO access)
    * HTTP/HTTPS: `https://hostname.tld/path/project.git` (requires creds or cred helper)
    * SSH: requires public/private keypair registered at host

## Contributing to the Remote: Git Push Revisited

* `git push` pushes the current branch to the `origin` remote branch of the same name
* `git push remote_name` pushes the current branch to the `remote_name` branch on the remote
* `git push remote_name branch_name` pushes the named branch to the named remote branch
* `git push remote_name local_branch:remote_branch` pushes `local_branch` from the local repo to the `remote_branch` of the remote repo
* You can delete a remote branch with `git push remote_name :remote_branch`, which pushes an empty branch to the remote branch

## Keeping Yourself Updated with the Remote: Git Pull

* `git fetch` will download changes that have appeared in the remote
* After a `fetch` you need to update your local branch by merging it with the appropriate remote
* To update the local master with the remote master's commit set, use `git checkout master;git merge origin/master`
* That will merge `origin/master` with your currently active branch
* `git pull` is essentially `git fetch;git merge` in a single command
* To update the current active branch, use `git pull origin master`
* Pull operations are fast forward by default, though this can be changed with `--no-ff`
* You can specify different local and remote branches for `pull`:
    * `git pull` - downloads code from remote matching branch, merges to active local
    * `git pull remote_name` - downloads code from named remote and merges to active local
    * `git pull remote_name branch_name` - downloads named remote, merges to active local
    * `git pull remote_name local_branch:remote_branch` - downloads names remote, merges to named local
* A `pull` can result in a conflict, which must be resolved before completing the merge

## Dealing with a Rejected Git Push

* Special situation: pushing new code to a remote that's been updated since your last sync.
* The push will be rejected as "non-fast-forward"
* To resolve, pull from `origin/master` and merge with local `master` to resolve conflicts
* Example commit lines for this scenario:

    ```
    Rejected Push Situation:

        origin/master:  A --> B --> D --> E

        local/master:   A --> B --> C

    After Pull:

        origin/master:  A --> B --> D --> E

        local/master:   A --> B --> D --> E --> C

    After Push:

        origin/master:  A --> B --> D --> E --> C

        local/master:   A --> B --> D --> E --> C
    ```

## Conflicts

* Can happen when you're trying to merge two branches or do a pull
* Resolution is the same for either
* Conflicts arise when your current branch and the branch to be merged have diverged, and there are commits in your current branch that aren't present in the remote, and vice versa.
* Git can't tell which changes to keep so it raises a conflict for review.
* 'Base commit' - the last common commit between conflicting branches, start of divergence
* During a merge, git looks at the changes in each branch since the base commit
* If there are unambiguous differences (changes to different files, different parts of a single file), the changes are applied
* If there are changes to the same parts of the same file, and Git can't determine which changes to keep, it raises a conflict
* Creating a conflict around this file:

    ```Python
    CONSTANT = 5

    def add_constant(n):
        return CONSTANT + n
    ```

* With these branches and commits:

    ```shell
    git checkout -b base_branch
    vim sample.py
    git add sample.py
    git commit -m "initial file"

    git checkout -b conflict_branch
    vim sample.py
    git add sample.py
    git commit -m "changed to 7"

    git checkout base_branch
    git checkout -b friend_branch
    vim sample.py
    git add sample.py
    git commit -m "changed to 9"
    ```

* Creating the conflict:

    ```shell
    ❯ git checkout conflict_branch
    Switched to branch 'conflict_branch'
    ❯ git merge friend_branch
    Auto-merging sample.py
    CONFLICT (content): Merge conflict in sample.py
    Automatic merge failed; fix conflicts and then commit the result.
    ❯ git status
    On branch conflict_branch
    You have unmerged paths.
      (fix conflicts and run "git commit")
      (use "git merge --abort" to abort the merge)

    Unmerged paths:
      (use "git add <file>..." to mark resolution)
        both modified:   sample.py

    no changes added to commit (use "git add" and/or "git commit -a")
    ```

* File contents:

    ```
    <<<<<<< HEAD
    CONSTANT = 7
    =======
    CONSTANT = 9
    >>>>>>> friend_branch

    def add_constant(n):
        return CONSTANT + n
    ```

* Resolve by editing the file to remove the conflict markers and collapsing to the desired state, then adding the file and committing it
* To abort an in-progress merge, use `git merge --abort`

# Chapter 5: Git Workflows

# Chapter 6: Correcting errors while working with Git

## Amending Errors in the Git Workflow

### Undo Git Add

* `git rm --cached mistake_file` removes a newly tracked file from staging, but leaves it in the file system
* Example:

    ```

    ```
