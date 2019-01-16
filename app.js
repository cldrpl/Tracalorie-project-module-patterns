// Creating the feel of React & Angular with vanilla/ ES6 JavaScript

// Storage Controller, immediately invoked and getting setup for Local Storage
const StorageCtrl = (function() {
    // Public methods
    return {
        // Creating later on and inserting into the App Controller
        // If there is nothing in the empty items array, pushing to it and setting it as Local Storage
        storeItem: function(item) {
            let items;
            // Check if there are any items in Local Storage
            // if empty set to zero
            if(localStorage.getItem('items') === null) {
                items = [];
                // Push new item
                items.push(item);
                // Set Local Storage, wrapping in JSON
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // Get what is already in Local Storage
                // If there is an item in Local Storage, bringing it back from JSON above so parsing
                items = JSON.parse(localStorage.getItem('items'));
            
                // Push new item
                items.push(item);

                // Resetting Local Storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            // If Local Storage is empty set to an array, else parse so we can handle it and return items 
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            } 
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updatedItem.id === item.id) {
                    // items splice it by 1 and replace with the updated item
                    items.splice(index, 1, updatedItem);
                } 
            });
            // reset
            localStorage.setItem('items', JSON.stringify(items));
        },
        
        // very similiar to updateItemStorage w/out updatedItem
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(id === item.id) {
                    items.splice(index, 1);
                } 
            });
            // reset
            localStorage.setItem('items', JSON.stringify(items));
        },     

        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        } 
    }

})();

// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // earlier hardcoding before building out the methods to input data
        // items: [
            //{id: 0, name: 'Steak Dinner', calories: 1200},
            //{id: 1, name: 'Potatoes', calories: 300},
            //{id: 2, name: 'Eggs', calories: 250}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        // passing meal items in as an update
        currentItem: null,
        totalCalories: 0,
    }

    // Public method
    return {
        getItem: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // Create ID, logic to add it to the end of entered calories
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item from constructor - that's the reason why you have to use new
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },

        getItemByID: function(id) {
            let found = null;
            // Loop through items
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        updatedItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            // smiliar to getItemByID
            let found = null;

            data.items.forEach(function(item) {
                // once we click the edit pencil button it gets added to current, checking to see if
                // they are the same 
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
             });

             return found;
        },

        deleteItem: function(id) {
            // get ID's using maps (similiar to forEach, but returning something)
            const ids = data.items.map(function(item) {
                return item.id; 
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);

        },

        clearAllItems: function() {
            data.items = [];
        },


        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        getCurrentItem: function() {
            return data.currentItem;
        },

            getTotalCalories: function() {
              let total = 0;

              // Loop through items and add calories
              data.items.forEach(function(item) {
                total += item.calories;
                // same as total = total + item.calories;
              });

              // Set total calories in the data structure
              data.totalCalories = total;

              // Return total
              return data.totalCalories;
        }, 

        logData: function() {
            return data;
        }
    }

})();

// UI Controller
const UICtrl = (function() {
    // creating a selector to get the ID #items, easier to update in one place if there was 
    // a later change made to the html file, making it more efficent and scaleable
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public methods
    return {
        populateItemList: function(items) {
            // Looping through the items and inserting them into the list ul
            let html = '';

            items.forEach(function(item) {
                // appending to (li) and instead of ES5 concatnating using template strings so we can use variables inside
                // calling the item id #'s from above
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fas fa-pencil-alt"></i>
                </a>
            </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

            getItemInput: function () {
                return {
                    name: document.querySelector(UISelectors.itemNameInput).value,
                    calories: document.querySelector(UISelectors.itemCaloriesInput).value
                }
            },

            addListItem: function(item) {
                // Show the list w/later on hiding it if nothing is there
                document.querySelector(UISelectors.itemList).style.display = 'block';
                // create li element
                const li = document.createElement('li');
                // Add class
                li.className = 'collection-item';
                // Add ID, dynamic through the function(item) above
                li.id = `item-${item.id}`;
                // Add HTML
                li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fas fa-pencil-alt"></i>
                </a>`;
                // Insert item
                document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
            },

            updateListItem: function(item) {
                let listItems = document.querySelectorAll(UISelectors.listItems);

                // gives node list and we can't use forEach on that
                // So turning Node list into array
                listItems = Array.from(listItems);

                listItems.forEach(function(listItem) {
                    const itemID = listItem.getAttribute('id');

                    if(itemID === `item-${item.id}`) {
                        document.querySelector(`#${itemID}`).innerHTML =  `<strong>${item.name}: 
                        </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fas fa-pencil-alt"></i>`;
                    }

                });
            },

            deleteListItem: function(id) {
                const itemID = `#item-${id}`;
                const item = document.querySelector(itemID);
                item.remove();

            },

            // Clear input
            clearInput: function() {
                document.querySelector(UISelectors.itemNameInput).value = '';
                document.querySelector(UISelectors.itemCaloriesInput).value = '';
            },
            
            addItemToForm: function() {
                document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
                document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
                UICtrl.showEditState();
            },

            removeItems: function() {
                let listItems = document.querySelectorAll(UISelectors.listItems);

                // Turn node list into an array
                listItems = Array.from(listItems);

                listItems.forEach(function(item) {
                    item.remove();
                });
            },

            // Hiding the line after Total Calories 
            hideList: function () {
                document.querySelector(UISelectors.itemList).style.display = 'none';
            },

            showTotalCalories: function (totalCalories) {
                document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
            },

            clearEditState: function() {
                // calling the same thing as above, so just calling it directly & uncommented out the
                // update and delete buttons from the index.html file
                UICtrl.clearInput();
                // hiding the other buttons unless we are editing the calories below
                document.querySelector(UISelectors.updateBtn).style.display = 'none';
                document.querySelector(UISelectors.deleteBtn).style.display = 'none';
                document.querySelector(UISelectors.backBtn).style.display = 'none';
                document.querySelector(UISelectors.addBtn).style.display = 'inline';
            },

            // Adding the UI buttons after you clicked the edit icon, the opposite of clearEditState
            showEditState: function() {
                document.querySelector(UISelectors.updateBtn).style.display = 'inline';
                document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
                document.querySelector(UISelectors.backBtn).style.display = 'inline';
                document.querySelector(UISelectors.addBtn).style.display = 'none';
            },

            getSelectors: function() {
                return UISelectors;
            }
    }
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load Event Listeners
    const loadEventListeners = function() {
        // Get UI selectors, creating a public method to get them
        const UISelectors = UICtrl.getSelectors();
        
        // Add Item event, created the UICtrl addBtn so that we could access it here
        // when you click on the add meal button 
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter (when editing items to use the buttons instead)
        document.addEventListener('keypress', function(e) {
            // keyCode 13 equals enter, some older browsers might not support that so also checking
            // another way, we don't want the page to encounter errors sumbitting so preventing the default (e.preventDefault())
            if(e.keyCode === 13 || e.which === 13) {
                // basically disabling the enter key
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event, targeting the edit pencil so that we can use the edit buttons
        // We can't target it directly, so we have to go through the parent, process to get there
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        // adding the additional default information to prevent the back button from clearing the entire page
        // and so that everything is still handled inside the event listener section
        document.querySelector(UISelectors.backBtn).addEventListener('click', function(e) {
            UICtrl.clearEditState();
            e.preventDefault();
        }); 

        // Clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

        // Add Item Submit
        const itemAddSubmit = function(e) {
            // Get form input from UI Controller
            const input = UICtrl.getItemInput();

            // Check for name and calorie input
            if(input.name !== '' && input.calories !== '') {
                // Add item
                const newItem = ItemCtrl.addItem(input.name, input.calories);

                // Add item to UI list
                UICtrl.addListItem(newItem);

                // Getting total calories
                const totalCalories = ItemCtrl.getTotalCalories(); 

                // Add total calories to UI
                UICtrl.showTotalCalories(totalCalories);

                // Store in local storage, newItem is coming from the addItem section above
                StorageCtrl.storeItem(newItem);
            
                // Clear input fields
                UICtrl.clearInput();
            }
            e.preventDefault();
        }

        // Click edit item 
        const itemEditClick = function(e) {
            // targeting the edit-item pencil
            // adding after the page loads so we have to use event delegation
            if(e.target.classList.contains('edit-item')) {
                // Get list item id (item-0, item-1)
                const listID = e.target.parentNode.parentNode.id;

                // Break ID into an array
                const listIDArr = listID.split('-');

                // Get the actual ID, parseInt to use a number, [1] to get the number listed
                const id = parseInt(listIDArr[1]);

                // Get item 
                const itemToEdit = ItemCtrl.getItemByID(id);

                // Set current item
                ItemCtrl.setCurrentItem(itemToEdit);

                // Add item to form
                UICtrl.addItemToForm();
            }
            e.preventDefault();
        }

        // Update item submit, if you entered an item, clicked on the edit icon, changed the
        // calorie totals for example and clicked on the update meal button
        const itemUpdateSubmit = function(e) {
            // already have a UI controller function that we can use
            // Get item input
            const input = UICtrl.getItemInput();

            // Update item
            const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

            // Update UI
            UICtrl.updateListItem(updatedItem);

            // Getting total calories
            const totalCalories = ItemCtrl.getTotalCalories(); 

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Update local storage
            StorageCtrl.updateItemStorage(updatedItem);


            UICtrl.clearEditState();

                e.preventDefault();
        }

        // Delete button event
        // double checking my code, w/out the function(e) below, when I use delete it was clearing everything that was entered
        // now it's showing in the console output, but it's not showing the updated total calorie count
        const itemDeleteSubmit = function(e) {
            // Get current item
            const currentItem = ItemCtrl.getCurrentItem();

            // Delete from data structure
            ItemCtrl.deleteItem(currentItem.id);

            // Delete from UI
            UICtrl.deleteListItem(currentItem.id);

            // Getting total calories
            const totalCalories = ItemCtrl.getTotalCalories(); 

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            
            // Delete from Local Storage
            StorageCtrl.deleteItemFromStorage(currentItem.id);

            UICtrl.clearEditState();

            e.preventDefault();
        }

        // Clear All items event
        const clearAllItemsClick = function(e) {
            // Delete all items from data structure
            ItemCtrl.clearAllItems();

            // Removing total calories
            // Getting total calories
            const totalCalories = ItemCtrl.getTotalCalories(); 

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Remove from UI
            UICtrl.removeItems();

            // Remove from Local Storage
            StorageCtrl.clearItemsFromStorage();

            // Hide UL line after total calories
            UICtrl.hideList();

        }

        // Public methods
    return {
        init: function() {
            // Clear edit state / set inital state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItem();

            // Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
            // Populate items
            UICtrl.populateItemList(items);
            }  

            // Getting total calories
            const totalCalories = ItemCtrl.getTotalCalories(); 

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event Listeners
            loadEventListeners();
        }
    }

// adding StorageCtrl later on where its invoked
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();


