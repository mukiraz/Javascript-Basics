// Selected all required elements
const form = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo');
const todoList = document.querySelector('.list-group');
const firstCardBody = document.querySelectorAll('.card-body')[0];
const secondCardBody = document.querySelectorAll('.card-body')[1];
const filter = document.querySelector('#filter')
const clearButton = document.querySelector("#clear-todos")

eventListeners();

function eventListeners() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){

    if (confirm("Tümünü silmek istediğinizden emin misiniz?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");        
    }    
}

function filterTodos(e){
    const filteredValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item.d-flex.justify-content-between");
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filteredValue) === -1) {
            listItem.setAttribute("style","display: none !important;");
        } else {
            console.log("bulundu");
            listItem.setAttribute("style","display: block;");
        }
    })    
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        showAlert("danger", "Lütfen bir todo girin");
    }
    else {
        let todos = getTodosFromStorage();
        
        if (todos.includes(newTodo)) {
            showAlert("warning", `${newTodo} isimli todo'yu zaten eklediniz.`)
        } else {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success", "Todo eklendi");
            todoInput.focus();

        }
    }
    e.preventDefault();
}

function deleteTodo(e){
    if (e.target.className === "fa fa-remove") {        
        e.target.parentElement.parentElement.remove();
        let todo = e.target.parentElement.parentElement.textContent;
        deleteFromLocalStorage(todo);
        showAlert("success", "todo başarı ile silindi")
    }
}

function deleteFromLocalStorage(todo) {
    let todos = getTodosFromStorage();
    /*
    let index = todos.indexOf(todo);
    if (index > -1) {
        todos.splice(index, 1);
    }
    */
    //or

    todos.forEach(function(todo, index) {
        todos.splice(index, 1);
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    if (todos.length == 0) {
        showAlert("warning", "Henüz bir todo yok. Todo ekleyin")
    } else {
        todos.forEach(todo => {
            addTodoToUI(todo);
        });
    } 
}

function getTodosFromStorage() {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }

    return todos;

}

function addTodoToStorage(newTodo) {

    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));


}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.setAttribute("role", "alert");
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 1500);



}

function addTodoToUI(newTodo) {

    /* <li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>
                        
    */
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.className = "delete-item";
    link.href = "#";
    link.innerHTML = '<i class = "fa fa-remove"></i>';

    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    todoList.appendChild(listItem);
    todoInput.value = ""


}