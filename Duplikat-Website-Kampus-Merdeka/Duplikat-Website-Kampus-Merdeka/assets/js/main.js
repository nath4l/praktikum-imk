const books = [];
const searchBooks = [];
const RENDER_EVENT = 'render-book';
const RENDER_EVENT_SEARCH = 'render-book-search';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(todoId) {
    for (const bookItem of books) {
        if (bookItem.id === todoId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(todoId) {
    for (const index in books) {
        if (books[index].id === todoId) {
            return index;
        }
    }
    return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel @see books
 */
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


function makeBook(bookObject) {
    const { id, title, author, year, isComplete } = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = `Penulis: ${author}`;

    const textTahun = document.createElement('p');
    textTahun.innerText = `Tahun: ${year}`;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.setAttribute('id', `book-${id}`);
    container.append(textTitle, textPenulis, textTahun);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    if (isComplete) {
        const notYetButton = document.createElement('button');
        notYetButton.classList.add('green');
        notYetButton.innerText = 'Belum selesai dibaca';
        notYetButton.addEventListener('click', function () {
            undoBookFromCompleted(id);
        });

        actionContainer.append(notYetButton);
    } else {
        const doneButton = document.createElement('button');
        doneButton.classList.add('green');
        doneButton.innerText = 'Selesai dibaca';
        doneButton.addEventListener('click', function () {
            addBookToCompleted(id);
        });

        actionContainer.append(doneButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
        if(confirm('Apakah anda yakin?')){
            deleteBook(id);
        }
    });

    actionContainer.append(deleteButton);
    container.append(actionContainer);

    return container;
}

function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = parseInt(document.getElementById('inputBookYear').value);
    if(textYear < 0){
        alert('Tahun tidak bisa negatif');
        return;
    }
    const isComplete = document.getElementById('inputBookIsComplete');

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, isComplete.checked);
    books.push(bookObject);

    if(isComplete.checked){
        document.getElementById('pointScrollDone').scrollIntoView();
    }else{
        document.getElementById('pointScrollNotYet').scrollIntoView();
    }

    document.getElementById('inputBook').reset();
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(todoId) {
    const todoTarget = findBook(todoId);

    if (todoTarget == null) return;

    todoTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBook(todoId) {
    const todoTarget = findBookIndex(todoId);

    if (todoTarget === -1) return;

    books.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(todoId) {

    const todoTarget = findBook(todoId);
    if (todoTarget == null) return;

    todoTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

document.addEventListener(RENDER_EVENT_SEARCH, () => {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of searchBooks) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
    searchBooks.length = 0;
});

function search(keyword){
    for (const bookItem of books) {
        if(bookItem.title.toLowerCase().includes(keyword.toLowerCase())){
            searchBooks.push(bookItem);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT_SEARCH));
}

// live search
let keyword = document.getElementById('searchBookTitle')
keyword.addEventListener('keyup', () => {
    search(keyword.value);
});