var email = document.getElementById("email");
var password = document.getElementById("password");
var user_email = document.getElementById("user_email");
var login_container = document.getElementById("login_container");
var home_container = document.getElementById("home_container");
var note = document.getElementById("note");
var category = document.getElementById("category");
var filter_category = document.getElementById("filter_category");

function loginUser() {
  if (!email.value || !password.value)
    return alert("Please add email and password.");
  localStorage.setItem("email", email.value);
  checkIsUserLogin();
}

function checkIsUserLogin() {
  var email = localStorage.getItem("email");
  if (email) {
    login_container.classList.add("hidden");
    home_container.classList.remove("hidden");
    user_email.innerText = email;
    displayUserNotes();
  } else {
    login_container.classList.remove("hidden");
    home_container.classList.add("hidden");
  }
}

checkIsUserLogin();

function logout() {
  localStorage.removeItem("email");
  checkIsUserLogin();
}

function submitNote() {
  var email = localStorage.getItem("email");
  var obj = {
    email: email,
    note: note.value,
    category: category.value,
    datetime: new Date().toLocaleString(),
    id: Date.now(),
  };
  saveValueToLocalStorage(obj);
  note.value = "";
}

function saveValueToLocalStorage(obj) {
  var notes = localStorage.getItem("notes");
  if (notes) {
    notes = JSON.parse(notes);
    notes.push(obj);
    localStorage.setItem("notes", JSON.stringify(notes));
  } else {
    notes = [obj];
    localStorage.setItem("notes", JSON.stringify(notes));
  }
  displayUserNotes();
}

function displayUserNotes() {
  var notes = localStorage.getItem("notes");
  var list = document.getElementById("list");
  var currentUserEmail = localStorage.getItem("email");
  var selectedCategory = filter_category.value;

  if (notes) {
    list.innerHTML = "";
    notes = JSON.parse(notes);
    notes.forEach(function (data) {
      if (
        (data.email === currentUserEmail ||
          currentUserEmail === "admin@gmail.com") &&
        (selectedCategory === "" || data.category === selectedCategory)
      ) {
        var liElement = `
          <li class="border rounded p-4 bg-white shadow-md flex justify-between items-center">
            <div>
              <p class="font-medium">${data.note}</p>
              <p class="text-gray-500 text-sm">Category: ${data.category} | ${data.datetime}</p>
              <p class="text-gray-500 text-sm">${data.email}</p>
            </div>
            <span>
              <button onclick="editNotePrompt(${data.id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Edit</button>
              <button onclick="deleteNote(${data.id})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </span>
          </li>
        `;
        list.insertAdjacentHTML("beforeend", liElement);
      }
    });
  }
}

function filterNotesByCategory() {
  displayUserNotes();
}

function editNotePrompt(noteId) {
  var newNote = prompt("Edit your note:");
  if (newNote) {
    editNoteInLocalStorage(noteId, newNote);
  }
}

function editNoteInLocalStorage(noteId, newNote) {
  var notes = localStorage.getItem("notes");
  if (notes) {
    notes = JSON.parse(notes);
    notes = notes.map(function (note) {
      if (note.id === noteId) {
        return {
          ...note,
          note: newNote,
          datetime: new Date().toLocaleString(),
        };
      }
      return note;
    });
    localStorage.setItem("notes", JSON.stringify(notes));
    displayUserNotes();
  }
}

function deleteNote(noteId) {
  var notes = localStorage.getItem("notes");
  if (notes) {
    notes = JSON.parse(notes);
    notes = notes.filter(function (note) {
      return note.id !== noteId;
    });
    localStorage.setItem("notes", JSON.stringify(notes));
    displayUserNotes();
  }
}

filter_category.addEventListener("change", filterNotesByCategory);
