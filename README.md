# B3 Production // Working but not complete. // Graded with G


* after cloning the repo you need to run `npm install` to install all the dependencies

* start the application by running `npm start`

* the application will be running on `localhost:3000`

** Note: ** in the fron-end js folder in both the fetchFunctions and socket files you need to change the url to your local host url <br>

also dont forget the .env file with neccecary variables as GITLAB_SECRET_TOKEN, GITLAB_API_KEY, and MONGO_URI. this is to make the application work as it is now.


## features

* the application have socket that will notify on changes

* instead of only using one project and creating a webhook for it in the maintrainer group in gitlab, I made a new subgroup in the maintrainer and have the server webhook to that group, so that the server will be notified on any changes in any project in the subgroup


## notes 

there is A LOT of junk code right now. This is becaues I hade a lot of more featuers I wanted to implement but I ran out of time. <br>
I manged to make the OAuth work for both gitlab and google, where a User cand both register and login with. <br>

the registration should allow the user to subscribe to project they wanted to be notified on, but time was not my friend for this assignemnt and now since my thiesis project start I choosed to not continue working more on this... :'( <br>

I learned a lot and experimented a lot with this project and I am happy with the result. <br>

if you check the code you will see a lot of things, men men...


## video demo
url to video demo: https://youtu.be/iO1_AoSMLvU


## in the cscloud server 

* supoort for https is added 
* and http2 is added
* the server is running on port 5050 internaly and 443 externaly
* this is using nginx as a reverse proxy
