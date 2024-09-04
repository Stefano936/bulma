document.addEventListener('DOMContentLoaded', () => {
    const tasks = document.querySelectorAll('.box');
    const columns = document.querySelectorAll('.column');
    const addTaskButtons = document.querySelectorAll('.add-task-button');

    tasks.forEach(task => {
        task.setAttribute('draggable', true);
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
        task.addEventListener('click', () => editTask(task));
    });

    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('dragenter', dragEnter);
        column.addEventListener('dragleave', dragLeave);
        column.addEventListener('drop', dragDrop);
    });

    addTaskButtons.forEach(button => {
        button.addEventListener('click', () => addNewTask(button));
    });

    if (darkModeButton) {
        console.log('Dark mode button found');
        darkModeButton.addEventListener('click', toggleDarkMode);
    } else {
        console.error('Dark mode button not found');
    }
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.header').classList.toggle('dark-mode');
    document.querySelectorAll('.box').forEach(box => box.classList.toggle('dark-mode'));
    document.querySelectorAll('.column').forEach(column => column.classList.toggle('dark-mode'));
    document.querySelectorAll('.add-task-button').forEach(button => button.classList.toggle('dark-mode'));
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault(); 
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function dragDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');

    const draggingTask = document.querySelector('.dragging');
    if (draggingTask && e.target.classList.contains('column')) {
        e.target.appendChild(draggingTask);
        
        const addTaskButton = e.target.querySelector('.add-task-button');
        if (addTaskButton) {
            e.target.appendChild(addTaskButton);
        }
    }
}

function editTask(taskElement) {
    if (taskElement.querySelector('form')) return;

    const title = taskElement.dataset.title || taskElement.textContent.trim();
    const description = taskElement.dataset.description || '';
    const assigned = taskElement.dataset.assigned || '';
    const priority = taskElement.dataset.priority || '';
    const dueDate = taskElement.dataset.dueDate || '';

    const form = document.createElement('form');
    form.className = 'task-edit-form';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = title;
    titleInput.placeholder = 'Título';
    titleInput.className = 'input is-small';
    titleInput.style.width = '100%';

    const descriptionInput = document.createElement('textarea');
    descriptionInput.placeholder = 'Descripción';
    descriptionInput.className = 'textarea is-small';
    descriptionInput.style.width = '100%';
    descriptionInput.value = description;

    const assignedSelect = document.createElement('select');
    assignedSelect.className = 'input is-small';
    assignedSelect.innerHTML = `
        <option value="">Asignado a...</option>
        <option value="Usuario 1">Pedro</option>
        <option value="Usuario 2">Pepe</option>
        <option value="Usuario 3">Mariana</option>
    `;
    assignedSelect.value = assigned;

    const prioritySelect = document.createElement('select');
    prioritySelect.className = 'input is-small';
    prioritySelect.innerHTML = `
        <option value="">Prioridad</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
    `;
    prioritySelect.value = priority;

    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.className = 'input is-small';
    dueDateInput.style.width = '100%';
    dueDateInput.value = dueDate;

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Guardar';
    saveButton.className = 'button is-primary is-small';

    form.appendChild(titleInput);
    form.appendChild(descriptionInput);
    form.appendChild(assignedSelect);
    form.appendChild(prioritySelect);
    form.appendChild(dueDateInput);
    form.appendChild(saveButton);

    taskElement.textContent = '';
    taskElement.appendChild(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTask(form, taskElement);
    });
}

function saveTask(form, taskElement) {
    const title = form.querySelector('input[type="text"]').value.trim();
    const description = form.querySelector('textarea').value.trim();
    const assigned = form.querySelector('select').value;
    const priority = form.querySelectorAll('select')[1].value;
    const dueDate = form.querySelector('input[type="date"]').value;

    taskElement.dataset.title = title;
    taskElement.dataset.description = description;
    taskElement.dataset.assigned = assigned;
    taskElement.dataset.priority = priority;
    taskElement.dataset.dueDate = dueDate;

    taskElement.innerHTML = `
        <strong>${title || 'Untitled Task'}</strong><br>
        <em>${description}</em><br>
        Asignado a: ${assigned}<br>
        Prioridad: ${priority}<br>
        Fecha límite: ${dueDate}
    `;

    taskElement.onclick = () => editTask(taskElement);

    const taskData = {
        title,
        description,
        assigned,
        priority,
        dueDate
    };

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    }).then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
}

function addNewTask(button) {
    const column = button.parentElement;
    const newTask = document.createElement('div');
    newTask.className = 'box';
    newTask.setAttribute('draggable', true);
    newTask.textContent = 'Nueva Tarea';
    newTask.addEventListener('dragstart', dragStart);
    newTask.addEventListener('dragend', dragEnd);
    newTask.addEventListener('click', () => editTask(newTask));
    
    // Insertar la nueva tarea antes del botón
    column.insertBefore(newTask, button);
    
    // Mover el botón al final de la columna
    column.appendChild(button);
    
    // Editar la nueva tarea inmediatamente
    editTask(newTask);
}

let url = "http://localhost:3000/tasks";

async function fetchDataAW() {
    try {
        const response = await fetch(url, { method: "GET" });
        const data = await response.json(); 
        tasksResponse = data
        return data
    } catch (error) {
        console.log("Error fetching data: ", error);
    }
}

lista =  fetchDataAW().then(() => {
    tasksResponse.map((t) => {
        console.log(t)
        if (t.state != undefined) {
            let column = document.getElementById(t.state)
            const newTask = document.createElement('div');
            newTask.className = 'box';
            newTask.setAttribute('draggable', true);
            newTask.textContent = t.title;
            newTask.dataset.title = t.title;
            newTask.dataset.description = t.description;
            newTask.dataset.assigned = t.assigned;
            newTask.dataset.priority = t.priority;
            newTask.dataset.dueDate = t.dueDate;
            newTask.addEventListener('dragstart', dragStart);
            newTask.addEventListener('dragend', dragEnd);
            newTask.addEventListener('click', () => editTask(newTask));
            column.insertBefore(newTask, column.querySelector('.add-task-button'));
        }
    })
})