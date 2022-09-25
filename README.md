# COP4331-Health-Tracking-App
## Installation and Setup guide 
## Github
### Firstly install git:
MacOSX: 
* `git --version`
if git is not installed it'll prompt you do to so

Ubuntu/WSL: 
* `sudo apt upgrade && sudo apt install git-all`
### And install npm 
MacOSX:
* `brew install node`

Ubuntu/WSL:
* `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
* `sudo apt-get install -y nodejs`

#### You also may need to update expo/ngrok and the Android SDK
* `npm install @expo/ngrok@4.1.0`

Ubuntu/WSL: 
* `sudo apt update && sudo apt install android-sdk`

### Then pull the repo
Go to wherever you want all the code to be saved (I recommend a new file) and type
* `git clone https://github.com/AkeenL1/COP4331-Health-Tracking-App.git`

## Running the program

### Once pulled navigate to the file in the terminal
* `cd your/file/path/COP4331-Health-TrackingApp`

### And Run
* `npx expo start`
 
### And Follow the instruction from Metro Bundler

### You may get a timeoutError in that case try to do
* `npx expo start --tunnel`

### And Follow the instructions




