import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
  
const appSettings = {
    databaseURL: "https://test-playground-422bc-default-rtdb.europe-west1.firebasedatabase.app/"
};


const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsmentsInDB = ref(database, "Endorsments")

const messageInputEl = document.getElementById("message-input")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")
const publishButton = document.getElementById("publish-button")
const messagesEl = document.getElementById("messages")

publishButton.addEventListener('click', (ev) => {
        ev.preventDefault()
        if (messageInputEl.value && fromInputEl.value && toInputEl.value) {
            let  inputValue = {
                from: fromInputEl.value,
                message: messageInputEl.value,
                to: toInputEl.value
            }
        clearInputFields()
        push( endorsmentsInDB, inputValue)
        }  else {
            alert("Please fill all fields!")
        }
    }
)

onValue(endorsmentsInDB, function(snapshot) {
        if (snapshot.exists()) {
            let itemsArr = Object.entries(snapshot.val())

            clearMessagesEl()

            for ( let i = 0; i < itemsArr.length ; i++ ) {
                let currentMessage = itemsArr[i]
                appendMessageFromEndorsmentsInDB(currentMessage) 
            }
        } else {
            messagesEl.innerHTML = "No messages yet..."
        }
    }
)

function clearInputFields() {
    messageInputEl.value = ""
    fromInputEl.value = ""
    toInputEl.value = ""
}

function clearMessagesEl() {
    messagesEl.innerHTML = ""
}

function appendMessageFromEndorsmentsInDB(item) {
    let messageID = item[0]
    let messageValue = Object.values(item[1])

    let finalMessage = `<b>From: ${messageValue[0]}</b> <br> ${messageValue[1]} <br> <b>To: ${messageValue[2]}</b>`

    let newEl = document.createElement("li")
    newEl.innerHTML = finalMessage

    newEl.addEventListener("dblclick", function() {
            let exactLocationOfItemInDB = ref(database, `Endorsments/${messageID}`)
            remove(exactLocationOfItemInDB)
        }
    )
    messagesEl.append(newEl)
    return newEl
}
