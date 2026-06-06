const STORAGE_KEY = 'tp_todo_items_v1';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const clearDoneBtn = document.getElementById('clear-done');
const clearAllBtn = document.getElementById('clear-all');

let todos = load();

render();

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  const item = { id: Date.now().toString(), text, done: false };
  todos.unshift(item);
  save();
  render();
  input.value = '';
  input.focus();
});

list.addEventListener('click', e => {
  const id = e.target.closest('[data-id]')?.dataset.id;
  if(!id) return;
  if(e.target.matches('.toggle')) {
    toggleDone(id);
  } else if(e.target.matches('.delete')) {
    removeItem(id);
  }
});

clearDoneBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

clearAllBtn.addEventListener('click', () => {
  if(!confirm('Effacer toutes les tâches ?')) return;
  todos = [];
  save();
  render();
});

function render(){
  list.innerHTML = '';
  if(todos.length === 0){
    const el = document.createElement('li');
    el.className = 'todo-item';
    el.innerHTML = '<div class="text" style="color:var(--muted)">Aucune tâche — ajoute en une !</div>';
    list.appendChild(el);
    return;
  }
  for(const t of todos){
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.done ? ' done' : '');
    li.dataset.id = t.id;
    li.innerHTML = `
      <button class="toggle" title="Basculer">${t.done ? '✔' : '○'}</button>
      <div class="text">${escapeHtml(t.text)}</div>
      <button class="delete" title="Supprimer">🗑</button>
    `;
    list.appendChild(li);
  }
}

function toggleDone(id){
  const it = todos.find(t => t.id === id);
  if(!it) return;
  it.done = !it.done;
  save();
  render();
}

function removeItem(id){
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}