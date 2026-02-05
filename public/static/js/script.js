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
        const id = habit.Habit_ID;
        const name = habit.Description;
        const goal = habit.Amount;
        const streak = 5; 

        const div = document.createElement('div');
        div.className = 'habit-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items: center;">
                <h3 style="margin:0;">${name} <span class="streak-badge">${streak} 🔥</span></h3>
                <div>
                    <button style="border:none; background:none; cursor:pointer;" onclick="openEditModal(${id},'${name}','${habit.Frequency_type}',${goal})">✏️</button>
                    <button style="border:none; background:none; cursor:pointer;" onclick="askDelete(${id})">🗑️</button>
                </div>
            </div>
            <div class="mini-calendar">
                ${[1,1,0,1,1,0,1].map(d => `<div class="calendar-dot ${d?'active':''}"></div>`).join('')}
                <span style="font-size:0.7em; color:#999; margin-left:5px;">Седмичен отчет</span>
            </div>
            <div class="progress-container"><div id="bar-${id}" class="progress-bar"></div></div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span id="text-${id}" style="font-size:0.8em; color:#666;">Напредък: 0/${goal}</span>
                <button onclick="markDone(${id}, ${goal})" style="background:#3498db; color:white; border:none; padding:5px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">+1</button>
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
}

async function sendChatMsg() {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('chatbot-messages');
    const val = input.value.trim();
    if (!val) return;

    
    msgArea.innerHTML += `<div class="user-msg">${val}</div>`;
    input.value = '';

    
    const typingId = "typing-" + Date.now();
    msgArea.innerHTML += `<div class="bot-msg" id="${typingId}">🤖 Мисля...</div>`;
    msgArea.scrollTop = msgArea.scrollHeight;

    try {
        
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