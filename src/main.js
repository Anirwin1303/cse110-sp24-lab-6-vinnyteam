const notesContainer = document.getElementById("notes-app");
const addNoteButton = notesContainer.querySelector(".add-note");
let noteCount = 0;

getNotes().forEach(note => {
    const noteElement = createNoteElement(note.id, note.content);
    //notesContainer.insertBefore(noteElement, addNoteButton);
    notesContainer.append(noteElement);
    noteCount++;
});

document.addEventListener("keydown", (event) => deleteAllNotes(event));

//UI button change feature
addNoteButton.addEventListener("mouseover", ()=> {
    addNoteButton.textContent = "+";
});
addNoteButton.addEventListener("mouseout", () => { 
    addNoteButton.textContent = "Add Note"; 
});

addNoteButton.addEventListener("click", () => addNote());

//Creates new note elements
function createNoteElement(id, content){

    const element = document.createElement("textarea");

    element.classList.add("note");
    element.value = content;
    element.placeholder = "New Note";
    
    element.addEventListener("change", () =>{
        updateNote(id, element.value);
    });
   
    element.addEventListener("dblclick", () => {
        deleteNote(id, element);
    });

    return element;
}

//Adds new Notes to page
function addNote(){

    const notes = getNotes();
    const noteObject = {
        id: Math.floor(Math.random() * 2000000),
        content: ""
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.append(noteElement);
    notes.push(noteObject);
    saveNotes(notes);
    noteCount++
}

//Updates Note with new given content
function updateNote(id, newContent) {
    notes = getNotes();
    updatedNote = getNote(notes, id);
    updatedNote.content = newContent;
    saveNotes(notes);
}

//Get all the notes from local storage
function getNotes() {
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

//Get a certain note based of id
function getNote(notes, id) {
    return notes.filter(note => note.id == id)[0];
}

//Saves all notes to local storage
function saveNotes(notes){
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

//Deletes a single specific note with double click
function deleteNote(id, element){
    const notes = getNotes().filter(note => note.id != id);
    saveNotes(notes);
    notesContainer.removeChild(element);
    noteCount--;
}

//deletes all notes with crt + shift + D
function deleteAllNotes(event){
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        if(confirm("Do you want to delete all notes")){
            for(var i = 0; i < noteCount; i++){
                notesContainer.removeChild(notesContainer.lastChild);
            }
            saveNotes(JSON.parse("[]"));
            noteCount = 0;
        }
    }
}
