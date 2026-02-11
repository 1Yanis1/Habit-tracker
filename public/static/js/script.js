document.addEventListener('DOMContentLoaded', () => {
    loadHabits();
    checkAdminAccess();
});


function toggleAddForm() {
    document.getElementById('add-habit-section').classList.toggle('hidden');
}

function setHabit(name) {
    document.getElementById('habit-name').value = name;
}


async function loadHabits() {
    const container = document.getElementById('habits-container');
    const res = await fetch('/habits');
    const habits = await res.json();
    container.innerHTML = '';

    habits.forEach(habit => {
    const id = habit.habit_id; 
    const name = habit.description; 
    const goal = habit.amount;
    const streak = 5; 

    const div = document.createElement('div');
    div.className = 'habit-card';
    div.innerHTML = `
        <div class="habit-header">
            <h3 class="habit-title">${name} <span class="streak-badge">${streak} 🔥</span></h3>
            <div class="habit-actions">
                <button class="btn-icon" onclick="openEditModal(${id},'${name}','${habit.frequency_type}',${goal})">✏️</button>
                <button class="btn-icon" onclick="askDelete(${id})">🗑️</button>
            </div>
        </div>
        <div class="mini-calendar">
            ${[1,1,0,1,1,0,1].map(d => `<div class="calendar-dot ${d ? 'active' : ''}"></div>`).join('')}
            <span class="report-text">Седмичен отчет</span>
        </div>
        <div class="progress-container">
            <div id="bar-${id}" class="progress-bar"></div>
        </div>
        <div class="habit-footer">
            <span id="text-${id}" class="progress-text">Напредък: 0/${goal}</span>
            <button class="btn-plus" onclick="markDone(${id}, ${goal})">+1</button>
        </div>
    `;
    container.appendChild(div);
    });
}

function markDone(id, goal) {
    const bar = document.getElementById(`bar-${id}`);
    const text = document.getElementById(`text-${id}`);
    let parts = text.innerText.split(': ')[1].split('/');
    let curr = parseInt(parts[0]);
    if (curr < goal) {
        curr++;
        bar.style.width = (curr/goal)*100 + "%";
        text.innerText = `Напредък: ${curr}/${goal}`;
        if(curr === goal) bar.style.backgroundColor = "#27ae60";
    }
}


function toggleChatbot() {
    document.getElementById('chatbot-window').classList.toggle('hidden');
    const ChatContainer = document.getElementById('chatbot-container');
        if (ChatContainer.style.display === 'none') {
            ChatContainer.style.display = 'lflex';

        } 
        else {
            ChatContainer.style.display = 'none';
        }
}

async function sendChatMsg() {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('chatbot-messages');
    let val = input.value.trim();
    if (!val) return;

    
    msgArea.innerHTML += `<div class="user-msg">${val}</div>`;
    input.value = '';

    
    const typingId = "typing-" + Date.now();
    msgArea.innerHTML += `<div class="bot-msg" id="${typingId}">🤖 Мисля...</div>`;
    msgArea.scrollTop = msgArea.scrollHeight;

    

    try {
        
        if (val.toLowerCase() === "идеи") { 
        val =`Дай ми три кратки предложения за нов навик, който да развия, свързан с физическата активност.`;
        }

        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: val })
        });
        
        const data = await res.json();
        
        
        const formattedReply = data.reply.replace(/\n/g, "<br>");
        document.getElementById(typingId).innerHTML = formattedReply;
    } catch (e) {
        console.error("Грешка:", e);
        document.getElementById(typingId).innerText = "Грешка при връзката със сървъра.";
    }
    msgArea.scrollTop = msgArea.scrollHeight;
}


async function addHabit() {
    const desc = document.getElementById('habit-name').value;
    const freq = document.getElementById('habit-freq').value;
    const amt = document.getElementById('habit-amount').value;
    if(!desc) return alert("Въведи име!");
    
    await fetch('/habits', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ description: desc, frequency: freq, amount: amt })
    });
    document.getElementById('habit-name').value = '';
    toggleAddForm(); 
    loadHabits();
}

function askDelete(id) { 
    window.toDel = id; 
    document.getElementById('deleteModal').style.display='flex'; 
}

function closeDeleteModal() { 
    document.getElementById('deleteModal').style.display='none'; 
}

async function confirmDelete() { 
    await fetch(`/habits/${window.toDel}`, {method:'DELETE'}); 
    closeDeleteModal(); 
    loadHabits(); 
}

function openEditModal(id, n, f, a) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-desc').value = n;
    document.getElementById('edit-freq').value = f;
    document.getElementById('edit-amount').value = a;
    document.getElementById('editModal').style.display='flex';
}

function closeEditModal() { 
    document.getElementById('editModal').style.display='none'; 
}

async function saveEdit() {
    const id = document.getElementById('edit-id').value;
    await fetch(`/habits/${id}`, {
        method: 'PUT', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            description: document.getElementById('edit-desc').value,
            frequency: document.getElementById('edit-freq').value,
            amount: document.getElementById('edit-amount').value
        })
    });
    closeEditModal(); 
    loadHabits();
}


function checkAdminAccess() {
    const role = document.cookie.split('; ').find(row => row.startsWith('role='))?.split('=')[1];
    if (role === 'admin') {
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.classList.remove('hidden');
    }
}

function logout() { 
    fetch('/logout').then(() => window.location.href='/login.html'); 
}