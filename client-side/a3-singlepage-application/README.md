# A3 SPA // Graded with A


### Author
* **Name:** Saleh Shalabi
* **Student ID:** ss225bx
* **Course:** 1DV528
* **Assignment:** A3 SPA
* **Date:** 2023-01-13
* **Version:** 1.0.0

<hr>

## Introduction
<p> The assignment was to build a single web page applcation using javascript.
<p> the application functions as a personal desktop and it is simmilair to the linux Ubuntu desktop.

## Features
* The application has a menu bar at the side of the page.
* The menu bar has a list of applications.
* The application has a taskbar in the side bar.
* The taskbar has a list of open applications.
* by clicking on the application in the menu bar it will open and show on the desktop, and it will also show in the taskbar.
* by clicking on the application in the taskbar it will bring it in front of all other opened windows.
* by clicking on the close button on the application it will close the application and remove it from the taskbar.
* the desktop has a background image.
* the desktop has a clock and date in the top right corner. <br>

### The project contains the following applications:
* Memory game
* Chat application
* Nasa picture application

#### Memory game
* The memory game is a game where you have to find all the pairs of cards.
* The game provides the appility to choose between 3 different levels of difficulty.
* The game has an attempt counter.
* The game has a reset button that shows when the you win the game.
* The game has animation effect when the cards are flipped.
* The game has animation effect when the cards are matched.
* The game has animation effect when the cards are not matched.
* The game have a hint button that will show the user a random card.
* The game can be played using the mouse and/or the keyboard.
* If to play with the keyboard the user can use the arrow keys to move between the cards and the enter or space bar to flip the card.
* If the user wins the game a message will show up.



#### Chat application
* First time you open the chat application you will be asked to enter a username.
* The application will then connect to the server and show you the chat.
* The application has the ability to send messages and emojis.
* The application has the ability to recive messages.
* The user is able to change the username.
* The user is able to change channel.
* The application cashes the messages up tp 30 messages.
* The application has a button to scroll in the chat.
* Moving between channels will show the user the last 30 messages from that channel.
* The application has a button to clear the chat. Note: Clearing the chat will also clear the cashed messages.


#### Nasa picture application
* The application will show the user random pictures from the NASA API.
* The application has a button to get new pictures.
* The user is able to choose how many pictures to be shown.
* The application shows the pictures and facts from the NASA API.



### The application is built with the following technologies:
* HTML
* CSS
* Javascript

<hr>

## Installation
### Clone the repository

in the terminal write the command "git clone" and paste the link to the repository.

```
git clone "repo link"
```

### Install application
* After you have cloned the repository navigate to the root directory for the project using the command "cd".

* In the terminal write the command "npm install" to install all the nessecery resourses for the application.

```
npm install
```
* When the installation is done you can run the application by writing the command "npm run serve" in the terminal.

```
npm run serve
```
* In your browser go to the link "http://localhost:4173/".

* Now the application is up and running.

<hr>

## Code structure
The application is built with the following structure:
* The desktop is the main component and it is the parent component for all the other components.
* The desktop is structured in the "index.html" file.
* "index.js" is the main javascript file for the application.
* In the "index.js" the desktop component is imported and the application is rendered.
* Clicking on an application in the menu bar will open the application and render it in the desktop.
* The application is rendered in the desktop by creating a new instance of Window componant and pass the application as a prop.
* The Window component is the parent component for the application.
* The Window component is structured in the "window.js" file.
* The Window component is devided into 2 main parts, top bar and container for the application.
* The top bar is structured in the "topbar.js" file.
* The top bar is devided into 2 divs, one for the title and one for the close, minimaize and maximize buttons.
* The top bar has a function called "closeApp" that will close the application and remove it from the taskbar.
* The top bar has a function called "minimizeApp" that will minimize the application.
* The top bar has a function called "maximizeApp" that will maximize the application.
* In the Window listenrs to the top bar div are added that allows the user to drag the application.

* The Window componant uses the param "app" to render the correct application.
* Each application is structured in its own file and they are added to the Window container by creating a new instance of the application.
* All applications instances has a function called getDiv() that returns the div for the application.
* The Window component uses the function getDiv() to add the application to the container.
* All applications added to the desktop are stored in the "apps" array in the "index.js" file and removed when the application is closed.




### The linters
* The application is linted with the following linters:
* **Eslint** 1. run command "npm run eslint" 2. run command "npm run eslint-fix"
* **Stylelint** 1. run command "npm run stylelint" 2. run command "npm run stylelint-fix"
* **JsDoc** run command "npm run jsdoc" 
* **Htmlhint** run command "npm run htmlhint"
* **Lint** run command "npm run lint" to run all the linters together.

<hr>

## youtube link

https://youtu.be/BpBn6r5n0v0

<hr>

## Submission
**F1:** 
<p> The base structure of the application is built in the html file to create the desktop and the menu bar this is to make it easier to add the applications to the desktop.

<p> Clicking on any app logo in the menu bar will create an instanse of the Window component and inside of it in the container the application will be added by creating a new instance of the application and calling the getDiv() function that returns the div for the application.

<p> Each application has its own structure that are renderd in the constructor of the application. All of the applications have a function called getDiv() that returns the div for the application. The div returned is the main div and parent of all the other divs in the application.

<p> Drag and drop is implemented by adding event listeners to the top bar. the listneres listen to "mousedown" and "mouseup" and "mousemove" events. When the user clicks on the top bar the event listener will start listening to the mouse move event and when the user moves the mouse the event listener will move the application by changing the top and left css properties of the application.

<p> The user is able to open any application by clicking on the logo of the application in the side bar. 'No need to dubble click' -> more usiable in my opinion.

<p> in the top bar of the window there are buttons to close, minimize and maximize the application. The buttons are implemented by adding event listeners to the buttons and calling the correct function when the button is clicked.

<p> When creating the window listiners are added to know when it is clicked on or draged to bring it into the front of the other windows.

**F2:**
<p> All the points was followed wiht no issues.

*hince* Bullding the application with vite makes an issue with the images, they were not loading, since it can not find them even if the path for them are added in the code. I hade to manualy copy them into the dist folder.

**F3:**
<p> Since the application is a class that is an object, there is no limits to how many instances of the application that can be created. Each instance renders it's own div that can be returned.

<p> the user is able to play the game with the keyboard since the event listiners are added inside of the game creation. Opning more than one instance will not cuse any issu to play with the keyboard, since to be able to listen to the keyboard events the window needs to be in focus.

<p> I choased to add a hint button that will randomly flip a card for a 0,5 secound. This is to make it easier for the user to find the pairs.

**F4:**
<p> Same thing as the memory game, it is fully possible to open more than one instance of the chatt application since it is a class that is an object. Each instance renders it's own div that can be returned.

<p> Opning the application checks in the local storage if there are any username saved, if not then the application will ask the user to give a username that will be saved in the local storage for the next time the application is opened.

<p> Since each msg will be added into the cahtt body there are no problem at all of seeing the messages that are sent since the chat is opned.

**F5:** 
<p> I wanted to add a simple and funy, but also a good and thoughtfull application. I found the Nasa api.

<p> The application is a simple application that shows the picture from Nasa. The application also shows the title and the description of the picture.

<p> The application is a class that is an object. Each instance renders it's own div that can be returned. So no problem at all of opening more than one instance of the application.

<p> The user has the ability to update the picture by clicking on the update button. The update button will fetch a new picture from the Nasa api and update the picture, title and description.

<p> The user is also able to choose how many pictures that will be fetched from the Nasa api. The user can choose between 1-10 pictures.


**F6:**

<p> The user can choose to listen to one of 3 different channels. The user can choose between the channels by clicking on the drop down menu and choose the channel that the user wants to listen to.

*General* - The general channel is a channel that is used for general chat.
*Any* - The any channel is a channel that is used for any topic.
*Encrypted* - The encrypted channel is a channel that is used for encrypted chat.

<p> The user sends also msgs to different channels dippending on what channel the user is listening to.
<p> emojies are also supported in the chat. thet are added by creating a button that shows a div with the emojies. when the user clicks on the emojie the emojie will be added to the msg that the user is writing.
the emojis are created dinamically by looping between 2 numbers and adding the hex code for the emoji to the div as buttons.

<p> The Encrypted is used by TextEncoder and TextDecoder. The user can send encrypted msgs to the encrypted channel and the other users that are listening to the encrypted channel will be able to decrypt the msg if they have the same key and the same algorithm.

<p> msgs are saved in the local storage and when the user opnes the application the msgs will be fetched from the local storage and added to the chat body. The limit is 30 msgs. 

<p> Having the application open will continue to fetch msgs from the server and add them to the chat body and even saving the to local storage.

<p> Changing the channel will also fetch the msgs from the local storage and add them to the chat body, then each channel will have its own msgs.

<p> one more thing, the user can also send msgs by pressing the enter key on the keyboard and/or send button.

<p> last thing, the user can also choose to clear the chat body by clicking on the clear button. This will also clear the local storage.

**F7:**
<p> The application can fully be used by the keyboard. The user can navigate between the applications by using the tab key. The Button "PageUp" will make the application maximize and the button "PageDown" will make the application minimize. The button "Escape" will close the application.

<hr>

## Conclusion
<p> Acctuly and in my opninon the hardest of all in this project was the CSS. It may deppend on that I'm not that much in to tha front-end and like more to work on the overall functionality of the application. But I think that I did a good job with the CSS and the overall look of the application.

<p> Since it's the first project in this size doing it in javascript, personaly I think the overall structure is not the best and could be imporven if there were more time. But it still works for now.

### Til of this project
<p> The most I learned of this project is rendering different things using only javascript, almost not needing any html at all.
<p> I learned many thing in javascript and how to use it in a better way. as dispatching events out of the divs to be cathed in some where else. that was very usefull in this project.
I also learned the Promise class that I needed since the setTimeOut does not work as I used to in other languages.

<p> One thing absolutly not going to forget is tons of CSS.

### Overall TIL of this course (this far)

<p> I had no idea about web programing and did not know any basics of it. 
I learned to use javascript, html, CSS and how to use them together to create web applications.
<p> Basicly I learned everything that I needed to know to create web applications in clinet side.

