
// FIREBASE SETUP ============================================================================= //
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://playground-bf5b1-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings); // connects our project to the database
const database = getDatabase(app);
// to get started with using our database, we'll need a reference on the database side, like a table.
const groceryItemsInDB = ref(database, "groceryList"); // here we created the reference / table to put things in.


// LIST FUNCTIONALITY ============================================================================= //
// get button
const button = document.getElementById("add-button");

// get ul
const shoppingList = document.getElementById("shopping-list");

// if button is clicked, get value from textbox and console log it
button.addEventListener('click', function() {
    // get textbox
    const textbox = document.getElementById("input-field");
    let input = textbox.value;
    push(groceryItemsInDB, input); // use firebase's push function to add to the db
    clearTextBox(textbox);
});

function addToShoppingList(itemToAdd) {
    // add to list
    shoppingList.innerHTML += `<li>${itemToAdd}</li>`;
}

function clearTextBox(textboxToClear) {
    textboxToClear.value = "";
}

function clearShoppingList() {
    shoppingList.innerHTML = "";
}

onValue(groceryItemsInDB, function(snapshot) { // snapshot is current data in db
    const itemsArray = Object.values(snapshot.val()); 
    clearShoppingList();
    for (let i = 0; i < itemsArray.length; i++) {
        addToShoppingList(itemsArray[i]);
    }
});

