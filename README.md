Address book to view, search, create, update and delete contacts

To run the project:

1. In Backend folder open visual studio Backend project with visual studio
2. Enter correct DB connection string in Backend/AddressBook.API/appsettings.json
4. Rebuild entire solution
5. Start the Backend project in visual studio and note on which server name and port it is running

6. in Frontend/AddressBook.APP/src/environments/environment.prod.ts and Frontend/AddressBook.APP/src/environments/environment.ts enter the server name and port from step 5
7. In your cmd go to folder Frontend/AddressBook.APP and type 'npm install' (you need node.js installed to run this command. If you don't have it installed, get it here https://nodejs.org/en/download/ )
8. Then type 'ng serve --open' (you need Angular CLI in order to run this command. If you don't have it installed, type 'npm install -g @angular/cli' )
9. That's all. Start using the app.