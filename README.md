# Temi React Webview

- [Temi React Webview](#temi-react-webview)
  - [Requirements](#requirements)
  - [Installation: Local Development server](#installation-local-development-server)
  - [Production Builds](#production-builds)
  - [Admin Page](#admin-page)
  - [Changing QR-code](#changing-qr-code)
- [How to use](#how-to-use)
  - [routes](#routes)
  - [parameters](#parameters)
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


## Admin Page
You can find the Admin page [here](https://mcttemitour.azurewebsites.net/admin).

## Changing QR-code
In the 'public' folder there is a file named 'qr.jpg' you can replace this file with another '.jpg' file of another QR code to change to another page where people can fill in a form.

Certain file types are not compatible so make sure to test it out or use '.jpg'.

# How to use
On the start of the app it will automaticly go to 'reception' this is a required postition where Temi always starts doing the tour. The go to button in the middle of the screen will prompt users to go to the next location, the following locations can be seen in the stepper to indicate where you currently are in the tour.

If you want a different location you can always open up the hamburger menu and select one of the locations.
The hamburger drawer is connected to our API, so you will have to add these locations there aswell.
The stepper is also connected to the API so if you want to change stepper locations in a different sequence or add/remove them, you can upload a new list with String locations in the 'api/stepper' route

The refresh icon (top-right) can be used to refresh website when something is off or when changes to the website have been pushed to github.
The wifi-icon shows the connected state to the SocketIO server and can also be used to force exit the app (exit by pressing this icon 15times)

To mute the robot make sure to have the settings permissions turned on on then toggle the TTS button so the state of it is active.
When toggled active temi should no longer be able to make sound.

## routes
All useful routes can be show below

- api/stepper (POST) -> this requires a new list<String> to set as new stepper values (params show below)

- api/stepper (GET) -> this receives the list<String> and sets as stepper value

- api/add/location (POST) -> add a new location to the mongoDB (params shown below)

- api/update/location (PUT) -> change textlist on a certain location

- api/delete/location (DELETE) -> delete a location 

- api/locations/getlocations (GET) -> get all locations

- api/locations/get/{locationname} (GET) -> get specific location info

- api/markdown (GET) -> special route to convert md files to new locations in the DB (run this locally and change directory to local directory)


## parameters

for stepper route:
{
    "stepsList": ["Reception", "1MCT", "The Core", "International"]
}

for location route:
{
    "name": "core", "alias": "The Core" ,"textList": ["AI engineer", "Next web dev", "Smart tech creator"], "icon": "CancelIcon"
}

