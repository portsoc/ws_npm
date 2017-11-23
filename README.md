ws_npm
======

An intro to node package management.


Running Tests
-------------

We continue to use QUnit to define tests that you should attempt to complete.  
The difference now is that there is no browser – you must install the source
code and the test framework and then run the tests from the command line:

1. To download the code, either use git (the simplest option):

  ```bash
  git clone https://github.com/portsoc/ws_npm.git
  cd ws_npm
  ```
  or download and unpack the [zip](https://github.com/portsoc/ws_npm/archive/master.zip)
  which on linux can be achieved using
  ```bash
  wget https://github.com/portsoc/ws_npm/archive/master.zip
  ```
  then
  ```bash
  unzip master.zip
  cd ws_npm-master
  ```

2. To download the QUnit files (and any libraries it uses, which you need to do before the first run of tests, but just the once) type:

  ```bash
  npm install
  ```

3. Run the tests by typing:

  ```bash
  npm test
  ```
  On Windows, you must use Git Bash (or a similar terminal emulator) to run npm test. This is installed by default once you have installed Git and can be found in the "Git" folder in the start menu.
  
4. **Inside `test.js` you will find helpful comments that tell you what the tests expect.**

Git: A recommendation
----------------------
If at all possible, we recommend you use git to download code rather than zips of a repository.  This is prefereable because if the repo is updated, then syncing those changes requires just one command (`git pull`) and usually any merging can be done automatically.  Git is very powerful and we heartily encourage you to become familiar with it.
