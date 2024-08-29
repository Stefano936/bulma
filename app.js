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
});

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
        
        // Mover el botón al final de la columna
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
}d