const textArea = document.getElementById('my-textarea');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const statusMsg = document.getElementById('status-message');
const notesList = document.getElementById('list-of-notes');

let recognition;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        statusMsg.innerText = "LISTENING... (Speak now)";
        statusMsg.style.color = "red";
        startBtn.style.display = "none";
        stopBtn.style.display = "inline-block";
    };

    recognition.onend = function() {
        statusMsg.innerText = "Stopped.";
        statusMsg.style.color = "gray";
        startBtn.style.display = "inline-block";
        stopBtn.style.display = "none";
    };

    recognition.onresult = function(event) {
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                textArea.value += event.results[i][0].transcript + ' ';
            }
        }
    };
} else {
    alert("Speech recognition not supported in this browser");
}

startBtn.onclick = function() {
    recognition.start();
};

stopBtn.onclick = function() {
    recognition.stop();
};

clearBtn.onclick = function() {
    textArea.value = "";
};

saveBtn.onclick = function() {
    const text = textArea.value;
    
    if(text.length > 0) {
        const oldNotes = localStorage.getItem('my_notes');
        let notesArray = [];
        
        if(oldNotes) {
            notesArray = JSON.parse(oldNotes);
        }
        
        const noteObj = {
            text: text,
            id: Date.now()
        };
        
        notesArray.push(noteObj);
        localStorage.setItem('my_notes', JSON.stringify(notesArray));
        
        textArea.value = "";
        showNotes();
    } else {
        alert("Type something first!");
    }
};

function showNotes() {
    const oldNotes = localStorage.getItem('my_notes');
    if(oldNotes) {
        const notesArray = JSON.parse(oldNotes);
        
        notesList.innerHTML = "";
        
        for(let i=0; i<notesArray.length; i++) {
            const note = notesArray[i];
            
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-item';
            noteDiv.innerHTML = note.text + 
                ' <button class="delete-btn" onclick="deleteNote(' + note.id + ')">X</button>';
            
            notesList.appendChild(noteDiv);
        }
    }
}

window.deleteNote = function(id) {
    const oldNotes = localStorage.getItem('my_notes');
    if(oldNotes) {
        const notesArray = JSON.parse(oldNotes);
        
        const newArray = [];
        for(let i=0; i<notesArray.length; i++) {
            if(notesArray[i].id != id) {
                newArray.push(notesArray[i]);
            }
        }
        
        localStorage.setItem('my_notes', JSON.stringify(newArray));
        showNotes();
    }
}

showNotes();