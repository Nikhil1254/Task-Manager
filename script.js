const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const actionBtnCont = document.querySelector(".action-btn-cont");
const toolboxCont = document.querySelector(".toolbox-cont");
const textareaCont = document.querySelector('textarea');
const priorityColorsCont = document.querySelector(".priority-colors-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const removeBtn = document.querySelector(".remove-btn");
const toolboxPriorityCont = document.querySelector(".toolbox-priority-cont");
const choiceCont = document.querySelector(".choices");

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];
let removeFlag = false;
let ticketsArr = [];


// handling storage when we open application
if (localStorage.getItem("ticketsArr") === null)
    localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr));
else
    ticketsArr = JSON.parse(localStorage.getItem("ticketsArr"));


mainCont.innerHTML = createInnerHtmlFromObjects(ticketsArr);

// functions needed ------------------------------------------------------------------------------------------

// get ticket with given id
function getTicket(ticketId) {
    for (let idx = 0; idx < ticketsArr.length; idx++) {
        let ticket = ticketsArr[idx];
        if (ticket.ticketId === ticketId)
            return ticket;
    }
}

function removeTicket(ticketId) {
    ticketsArr = ticketsArr.filter((ticket) => ticket.ticketId !== ticketId);
    localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr));
}

function changeTicketColor(ticketID, color) {
    for (let idx = 0; idx < ticketsArr.length; idx++) {
        let ticket = ticketsArr[idx];
        if (ticketID === ticket.ticketId) {
            ticket.ticketColor = color;
            localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr));
            return;
        }
    }
}

function filterContent(color) {
    let filteredArr = ticketsArr.filter((ticket) => ticket.ticketColor === color);

    let innerHtml = "";
    filteredArr.forEach((ticket) => {
        innerHtml += `<div class="ticket-cont">
        <div class="ticket-color ${ticket.ticketColor}" ></div>
        <div class="ticket-id" >#${ticket.ticketId}</div>
        <div class="task-area" spellcheck="false">
            ${ticket.content}
        </div>
       <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
       </div>
    </div>`
    });

    mainCont.innerHTML = innerHtml;
}



// will reset modal properties and values
function resetModal() {
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length - 1]; // black
    allPriorityColors.forEach((colorEle) => {
        colorEle.classList.remove("active");
    })

    allPriorityColors[allPriorityColors.length - 1].classList.add("active"); //
}

// will create new ticket
function createTicket(content, ticketColor, ticketId) {
    mainCont.insertAdjacentHTML("beforeend",
        `<div class="ticket-cont">
            <div class="ticket-color ${ticketColor}" ></div>
            <div class="ticket-id" >#${ticketId}</div>
            <div class="task-area" spellcheck="false">
                ${content}
            </div>
           <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
           </div>
        </div>`);

    ticketsArr.push({ ticketColor, ticketId, content });
    localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr));
}

// handling remove-btn click
function handleRemoveBtn() {
    removeFlag = !removeFlag;
    if (removeFlag) {
        removeBtn.style.color = "red";
    } else {
        removeBtn.style.backgroundColor = "#3d3d3d";
        removeBtn.style.color = "#dcdde1"
    }
}

function toggleModal() {
    if (getComputedStyle(modalCont).display === "none") {
        modalCont.style.display = "flex";
        mainCont.style.opacity = "0.3";
        toolboxCont.style.opacity = "0.3";
        toolboxCont.style.pointerEvents = "none";

        textareaCont.focus();
    } else {
        modalCont.style.display = "none";
        mainCont.style.opacity = "1";
        toolboxCont.style.opacity = "1";
        toolboxCont.style.pointerEvents = "auto";
    }
}


function handleLockUnlock(e) {
    // clicked on lock
    if (e.target.classList.contains("fa-solid")) {
        if (e.target.classList.contains("fa-lock")) {
            e.target.classList.remove("fa-lock");
            e.target.classList.add("fa-lock-open");

            let textArea = e.target.parentElement.previousElementSibling;
            textArea.setAttribute("contenteditable", "true");
        } else {
            e.target.classList.remove("fa-lock-open");
            e.target.classList.add("fa-lock");

            let textArea = e.target.parentElement.previousElementSibling;
            textArea.setAttribute("contenteditable", "false");
        }
    }
}

// will create inner HTML string for .main-cont
function createInnerHtmlFromObjects(ticketsArr) {
    let innerHtml = "";
    ticketsArr.forEach((ticket) => {
        innerHtml += `<div class="ticket-cont">
        <div class="ticket-color ${ticket.ticketColor}" ></div>
        <div class="ticket-id" >#${ticket.ticketId}</div>
        <div class="task-area" spellcheck="false">
            ${ticket.content}
        </div>
       <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
       </div>
    </div>`
    });

    return innerHtml;
}

// event listeners ------------------------------------------------------------------------------------------

priorityColorsCont.addEventListener("click", (e) => {
    if (e.target.classList.contains("priority-color")) {
        allPriorityColors.forEach((colorEle) => {
            colorEle.classList.remove("active");
        });
        e.target.classList.add("active");
        modalPriorityColor = e.target.classList[0];
    }

});


removeBtn.addEventListener("click", (e) => {
    handleRemoveBtn();
})


addBtn.addEventListener("click", (e) => {
    toggleModal();
});

// create Ticket on Shift + Enter --
modalCont.addEventListener("keydown", (e) => {
    if (e.shiftKey) {
        if (e.key == "Enter" && textareaCont.value.trim() !== "") {
            createTicket(textareaCont.value, modalPriorityColor, shortid()); // ticket will be created and added to .main-cont
            resetModal(); // will set modal to initial state
            toggleModal(); // will close modal
        }
    } else if (e.key === "Escape") {
        toggleModal(); // closing opened modal onpress of escape key
    }

});


// handling remove ticket/change its color/lock-unlock --
mainCont.addEventListener("click", (e) => {
    if (removeFlag) {
        // handling remove ticket - if we click on ticket while remove-Btn is active will remove that ticket
        let ele = e.target;
        let list = ele.classList;

        if (list.contains("ticket-color") || list.contains("ticket-id") || list.contains('task-area')) {
            let targetTicketId = ele.parentElement.querySelector('.ticket-id').innerText.slice(1);
            let targetTicketEle = ele.parentElement;

            targetTicketEle.remove();
            removeTicket(targetTicketId);
        }
    } else {
        // ticket color change logic - 
        if (e.target.classList.contains("ticket-color")) {
            let currColorIdx = colors.indexOf(e.target.classList[1]);
            let nextColorIdx = (currColorIdx + 1) % colors.length;
            e.target.classList.remove(e.target.classList[1])
            e.target.classList.add(colors[nextColorIdx]);

            changeTicketColor(e.target.parentElement.querySelector(".ticket-id").innerText.slice(1), colors[nextColorIdx]);
            console.log(ticketsArr);
        }

        handleLockUnlock(e);
    }
});

// updating ticket content -
mainCont.addEventListener("keyup", (e) => {
    if (e.target.classList.contains('task-area')) {
        let targetTicket = getTicket(e.target.parentElement.querySelector(".ticket-id").innerText.slice(1));
        targetTicket.content = e.target.innerText;
        localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr));
    }
})

// filtering content on color basis
toolboxPriorityCont.addEventListener("click", (e) => {
    if (e.target.classList.contains("color")) {
        filterContent(e.target.classList[0]);
    }
})

// on double click on color get all tickets back -
toolboxPriorityCont.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("color")) {
        mainCont.innerHTML = createInnerHtmlFromObjects(ticketsArr);
    }
})


choiceCont.addEventListener("click", (e) => {
    if (e.target.classList.contains("done") || e.target.classList.contains("fa-check")) {
        createTicket(textareaCont.value, modalPriorityColor, shortid());
        resetModal(); // will set modal to initial state
        toggleModal(); // will close modal
    } else if (e.target.classList.contains("close") || e.target.classList.contains("fa-xmark")) {
        toggleModal();
    }
})


