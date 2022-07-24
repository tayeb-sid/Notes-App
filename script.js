const notesList = document.getElementsByClassName("note-list")[0];
const noteTitle = document.getElementById("inp-note-title");
const noteContent = document.getElementById("inp-note-content");
const addButton = document.getElementById("add-note");
const NewButton = document.getElementById("new-note-btn");

const notePrev = document.getElementsByClassName("note-preview")[0];

var notesArr = JSON.parse(localStorage.getItem("noteApp-notes")||"[]")
var noteIDs = notesArr.map((note)=>{
    return note.id
})
const MAX_LEN = 60

NewButton.addEventListener("click",()=>{
  location.reload()

})


addButton.addEventListener("click",()=>{
    let noteObj={}
     if(noteTitle.value || noteContent.value){

     

    noteObj.title = noteTitle.value 
    noteObj.content = noteContent.value 
    noteObj.updated = new Date().toUTCString()
   
    console.log(noteIDs.includes(parseInt(notePrev.dataset.id)))
   //updating an existing note
    if(noteIDs.includes(parseInt(notePrev.dataset.id))){
        let newNotesArr = notesArr.filter((note)=>{
            return note.id != notePrev.dataset.id
        })
        noteObj.id = notePrev.dataset.id
        notesArr = newNotesArr
    }
    //new note with new ID
    else noteObj.id = Math.floor(Math.random()*1000) 
    notesArr.unshift(noteObj)
    
    // notePrev.dataset.id =null
    localStorage.setItem("noteApp-notes",JSON.stringify(notesArr))
    location.reload();
}
    else alert("the note is empty")
})
function createNoteListHTML(notesArr){

    notesArr.forEach(note =>{
        const noteContainer = document.createElement("div")
    noteContainer.classList.add("note");
    noteContainer.dataset.id = note.id;
    
    
    const noteTitleContainer = document.createElement("div")
    noteTitleContainer.classList.add("note-title");
    
    const noteContentContainer = document.createElement("div")
    noteContentContainer.classList.add("note-content");
    
    const noteTimstampsContainer = document.createElement("div")
    noteTimstampsContainer.classList.add("timestamps");
    
    noteTitleContainer.innerText = note.title || "<untitled>"
    if(note.content.length>MAX_LEN) noteContentContainer.innerText = note.content.substring(0,MAX_LEN)+"..."
    else noteContentContainer.innerText = note.content || "<no body>"
    noteTimstampsContainer.innerText = note.updated
    
    noteContainer.append(noteTitleContainer)
    noteContainer.append(noteContentContainer)
    noteContainer.append(noteTimstampsContainer)
    
    notesList.append(noteContainer)
    
})
}

addEventListener("click",(e)=>{
    
    let currentNote = e.target.closest(".note")
    //if the clicked element is a note
    //if currentNote != null
    if(currentNote){
        //apply the 'selected' effect on the clicked note
        currentNote.classList.toggle("selected");        
        //remove  the selected effect from the other notes
        document.querySelectorAll(".note.selected").forEach(note =>{
            if(note == currentNote)return
            note.classList.remove("selected")
        })
        
        
        let selectedNote = findNote(currentNote)
        showNote(selectedNote)

    }
    //if we click outside a note we remove the effect
    else{
        document.querySelectorAll(".note.selected").forEach(note =>{
            note.classList.remove("selected")
        })
    }
    
})

function findNote(selectedNote){
    return  notesArr.find((note) =>{
        return note.id == selectedNote.dataset.id
    })
    
}
function showNote(noteToShow){
    noteTitle.value = noteToShow.title
    noteContent.value = noteToShow.content
    notePrev.dataset.id = noteToShow.id
    
}
function deleteNote(noteToDelete){
    // select all notes but the one we want to delete
    let newNotesArr = notesArr.filter((note)=>{
        return note.id != noteToDelete.dataset.id
    })
    //insert the new array
    localStorage.setItem("noteApp-notes",JSON.stringify(newNotesArr));
    location.reload();
}

addEventListener("dblclick", (e)=>{
    let currentNote = e.target.closest(".note")
    if(currentNote) {
        if(confirm("Wanna delete this note?\n (ctrl+space to delete all)")) deleteNote(currentNote)
    }
    
})

document.addEventListener("keydown",(e)=>{
    if(e.key==' ' && e.ctrlKey && notesList.hasChildNodes() ){
        if(confirm("wanna delete all saved notes ?")){
            localStorage.clear();
            location.reload();
        }
}})
createNoteListHTML(notesArr)