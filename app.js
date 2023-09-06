const createButton = document.getElementById("button");
const editorContainer = document.querySelector('.editor-container');
const editor = document.querySelector('.editor');
const saveButton = document.getElementById("editor-save");
const titleInput = document.getElementById("input-title");
const list = document.querySelector(".title-bar");
const editButton = document.getElementById("editor-edit");
const deleteButton = document.getElementById("editor-delete");
let quillEditor;
let isEditing = false; // Flag to indicate whether we are editing a note
let selectedNoteTitle;
quillEditor = new Quill(editor, { theme: 'snow' });

createButton.addEventListener('click', () => {
    isEditing = false; // Set the mode to create when clicking the create button
    editorContainer.classList.remove('hidden');
});

function initializeNotes() {
    // Clear the existing notes
    list.innerHTML = '';

    // Retrieve the note titles from local storage
    const noteTitles = Object.keys(localStorage);

    // Create note divs for each title
    noteTitles.forEach((title) => {
        const noteDiv = document.createElement('div');
        noteDiv.textContent = title;
        noteDiv.classList.add('note');
        noteDiv.setAttribute('data-title', title);
        list.appendChild(noteDiv);
    });
}

// Call the initializeNotes function when the page loads
window.addEventListener('load', initializeNotes);

saveButton.addEventListener("click", () => {
    const newTitle = titleInput.value.trim();
    const text = quillEditor.root.innerHTML;

    if (isEditing) {
        // Editing an existing note


        // Check if the user changed the title

        // Remove the old note with the previous title from local storage
        localStorage.removeItem(selectedNoteTitle);

        // Remove the old note div from the left menu
        const oldNoteDiv = document.querySelector(`.note[data-title="${selectedNoteTitle}"]`);
        if (oldNoteDiv) {
            list.removeChild(oldNoteDiv);
        }

    }
    const note = {
        title: newTitle,
        content: text
    };
    const noteJSON = JSON.stringify(note);
    localStorage.setItem(newTitle, noteJSON);

    const rightMenuTitle = document.querySelector(".rightmenu-title");
    const rightMenuContent = document.querySelector(".rightmenu-content");
    rightMenuTitle.innerHTML = "";
    rightMenuContent.innerHTML = "";
    initializeNotes();
    
    titleInput.value = '';
    quillEditor.setText('');
    editorContainer.classList.add('hidden');
});


function handleListItemClick(event) {
    const clickedItem = event.target;
    const title = clickedItem.textContent;

    // Retrieve the JSON data from local storage
    const noteJSON = localStorage.getItem(title);

    if (noteJSON) {
        // Parse the JSON data
        const note = JSON.parse(noteJSON);

        // Display the content in the right menu div
        displayContent(note.title, note.content);
    }
}

// Add event listener to the parent element (list)
list.addEventListener("click", function (event) {
    if (event.target.classList.contains("note")) {
        isEditing = true; // Set the mode to edit when clicking a note
        handleListItemClick(event);
    }
});

// ...

// Function to display content in the right menu div
function displayContent(title, content) {
    const rightMenu = document.querySelector(".rightmenu");
    const rightMenuTitle = document.querySelector(".rightmenu-title");
    const rightMenuContent = document.querySelector(".rightmenu-content");

    // Create elements to display the content
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;

    const contentElement = document.createElement("div");
    contentElement.innerHTML = content;

    // Clear the right menu and append the new content
    rightMenuTitle.innerHTML = "";
    rightMenuContent.innerHTML = "";
    rightMenuTitle.appendChild(titleElement);
    rightMenuContent.appendChild(contentElement);
}

editButton.addEventListener("click", () => {
    selectedNoteTitle = document.querySelector(".rightmenu-title h2").textContent;
    const noteJSON = localStorage.getItem(selectedNoteTitle);

    if (noteJSON) {
        const note = JSON.parse(noteJSON);
        titleInput.value = note.title;
        quillEditor.root.innerHTML = note.content;

        // Remove the 'hidden' class to display the editor
        editorContainer.classList.remove('hidden');
        // const selectedNoteDiv = document.querySelector(`.note[data-title="${selectedNoteTitle}"]`);
        // if (selectedNoteDiv) {
        //     list.removeChild(selectedNoteDiv);}
    }
});
deleteButton.addEventListener("click", () => {
    selectedNoteTitle = document.querySelector(".rightmenu-title h2").textContent;
    if (selectedNoteTitle) {
        // Retrieve the selected note title and check if it exists in local storage
        const noteJSON = localStorage.getItem(selectedNoteTitle);
        if (noteJSON) {
            // Remove the selected note from local storage
            localStorage.removeItem(selectedNoteTitle);

            // Clear the right menu
            const rightMenuTitle = document.querySelector(".rightmenu-title");
            const rightMenuContent = document.querySelector(".rightmenu-content");
            rightMenuTitle.innerHTML = "";
            rightMenuContent.innerHTML = "";

            // Remove the note div from the left menu
            initializeNotes();
        }
    }
});
