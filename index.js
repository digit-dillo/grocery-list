
// FIREBASE SETUP ============================================================================= //
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

function addToShoppingList(item) {
    let itemID = item[0];
    let itemValue = item[1];

    // create an li element
    const li = document.createElement("li");

    // add some text
    li.textContent = itemValue;

    // now that it has been created, have it listen for removal
    li.addEventListener('dblclick', function() {
        let locationInDB = ref(database, `groceryList/${itemID}`);

        remove(locationInDB);
    });

    // append to parent (list)
    shoppingList.appendChild(li);
}

function clearTextBox(textboxToClear) {
    textboxToClear.value = "";
}

function clearShoppingList() {
    shoppingList.innerHTML = "";
}

// runs every time there is a change in the DB
onValue(groceryItemsInDB, function(snapshot) { // snapshot is current data in db

    if (snapshot.exists()) {
        // get the key-value pairs of data if it exists
        const itemsArray = Object.entries(snapshot.val()); 

        // clear old shopping list
        clearShoppingList();

        // iterate over new data
        for (let i = 0; i < itemsArray.length; i++) {
            // get current item
            let currentItem = itemsArray[i];

            // get current item's key
            let currentItemID = currentItem[0];

            // get current item's value
            let currentItemValue = currentItem[1];

            addToShoppingList(currentItem);
        }
    } else {
        shoppingList.innerHTML = "No items here... yet!"
    }
    
});

