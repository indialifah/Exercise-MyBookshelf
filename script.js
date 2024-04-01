const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

var checkboxValue = false;

function updateValue() {
    var checkbox = document.getElementById("isComplete");
    var checkboxValue = checkbox.checked ? true : false;
    // console.log(checkboxValue); 
    return checkboxValue;
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function addBook() {
    const bookTitle = document.getElementById('title').value;
    const bookAuthor = document.getElementById('author').value;
    const bookYear = Number(document.getElementById('year').value); // convert from string into number
    const isCompleted = updateValue();

    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, bookTitle, bookAuthor, bookYear, isCompleted);
    books.push(bookObject);

    console.log(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function moveToCompletedBooks(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function moveToUncompletedBooks(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id == bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function makeBookShelf(bookObject) {
    // console.log(bookObject.title, bookObject.author, bookObject.year);

    const textTitle = document.createElement('h2');
    textTitle.innerText = "📔 " + bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun terbit: " + bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    
    let completedButton;
    let uncompletedButton;

    if (bookObject.isCompleted) {
        uncompletedButton = document.createElement('button');
        uncompletedButton.classList.add('uncompleted-button');
        const uncompletedButtonText = document.createTextNode('Belum Selesai');
        uncompletedButton.appendChild(uncompletedButtonText);

        // event ke function belum selesai dibaca
        uncompletedButton.addEventListener('click', function() {
            moveToUncompletedBooks(bookObject.id);
        })

        container.append(uncompletedButton);
    } else {
        completedButton = document.createElement('button');
        completedButton.classList.add('completed-button');
        const completedButtonText = document.createTextNode('Sudah Selesai');
        completedButton.appendChild(completedButtonText);

        // event ke function sudah selesai dibaca
        completedButton.addEventListener('click', function() {
            moveToCompletedBooks(bookObject.id);
        })

        container.append(completedButton);
    }

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-button');
    const removeButtonText = document.createTextNode('Hapus');
    removeButton.appendChild(removeButtonText);

    // event ke function hapus
    removeButton.addEventListener('click', function() {
        removeBook(bookObject.id);
    })
    
    container.append(removeButton);
    
    return container;
}

function isStorageExist() {
    if(typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookList = document.getElementById('books');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completed-books');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBookShelf(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
            
        } else {
            completedBookList.append(bookElement);
            
        }
    }
})