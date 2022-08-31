# Temi React Webview

## Requirements

- Node 16.14.0 or higher with NPM.

## Installation: Local Development server
Downloading the repository
```
git clone https://github.com/sizingservers/Robotics.Temi.Webview.git
```
After cloning the repository, you can install all the packages by doing the following command in the working directory:
```
npm i
```
After that you can use the following command to start a local development server:
```
npm start
```

## Production Builds
Every change to the master branch automatically starts the github pipeline that builds the react project and uploads it to Azure.

## Changing QR-code
In the 'public' folder there is a file named 'qr.jpg' you can replace this file with another '.jpg' file of another QR code to change to another page where people can fill in a form.

Certain file types are not compatible so make sure to test it out or use '.jpg'.