# Fantasy Football Draft App
We started a dynasty keeper fantasy league 5 years ago and had been using the ESPN Fantasy app for each team and each player, with an excel sheet to keep track of the contracts. Each player has a contract and we pay a certain amount of money to keep that player. After each season, the players that have expiring contracts are added to free agency. Then, to start the season, we have a free agency draft. The draft is why I set out to create an app using Node and exactly why I can help with ESPN fantasy sports. 

## Back Story
My friends and I started a fantasy football keeper league 5 years ago. It's a keeper league, so we need to keep track of our players and the player's contracts. Currently, we use an excel sheet to keep track of each team and each player's contract. We use the ESPN fantasy app for the scoring from week to week during the regular season. 

## Creating the Site
1. The login page - each player needs to be able to login and see their own team. 
2. A database of all the players in the NFL and the relationship with each user's team. Each team's roster is added to the database using a csv file. The database will be created using MongoDB. 
3. The real time auction section - clock, 'go' button, player on the clock, the user bidders. 
4. User gets a set amount of money to bid players. Once the money is used, the user can no longer place bids on players.
5. The admin area. Create an admin with special functionality - start/stop clock, undo player drafted. 
6. Chat section - incorporate a live chat. 
7. The design of the site - a simple, single page layout. 
8. The user experience of the site - sorting players, buttons to add $1, $5, $10 or other amount to live auction, starting and stopping auction timer, etc.
9. Hosting the site - a VPS server is needed to run a Node and Mongo site.

## Challenges I've faced
The main challenge I've encountered so far is loading the database. The database is too large, db.collection.find() does not work. 

* This app is not yet complete or functional. It is a work in progress. I needed to step away for the time being. 
