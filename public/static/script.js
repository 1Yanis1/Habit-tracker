function loadHabits() {
    fetch('/habits')
        .then(res => {
            if (res.status === 401) {
                window.location.href = '/login.html'; 
                return null;
            }
            return res.json();
        })
        .then(data => {
            if (!data) return;

            const container = document.getElementById('habits-container');
            
            if (data.error) {
                container.innerHTML = `<p style="color:red">Грешка: ${data.error}</p>`;
                return;
            }

            let html = '';
            data.forEach(h => {
                const habitName = h.Description || h.Habit;
                const freq = h.Frequency_type || 'Daily'; 
                
                
                html += `
                    <div class="habit-card">
                        <div class="habit-info">
                            <strong>${habitName}</strong>
                            <span>${freq}</span> • <span>${h.Amount} пъти</span>
                        </div>
                        <div class="actions">
                            <button class="edit-btn" onclick="openEditModal(${h.Habit_ID}, '${habitName}', '${freq}', ${h.Amount})">
                                ✏️ Редактирай
                            </button>
                            <button class="delete-btn" onclick="deleteHabit(${h.Habit_ID})">
                                🗑️ Изтрий
                            </button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html || '<p style="text-align:center; color:#888;">Все още нямате добавени навици.</p>';
        })
        .catch(err => console.error("Грешка:", err));
}




function openEditModal(id, description, frequency, amount) {
    document.getElementById('editModal').style.display = 'flex'; 
    
    
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-desc').value = description;
    document.getElementById('edit-freq').value = frequency;
    document.getElementById('edit-amount').value = amount;
}


function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}


function saveEdit() {
    const id = document.getElementById('edit-id').value;
    const newDesc = document.getElementById('edit-desc').value;
    const newFreq = document.getElementById('edit-freq').value;
    const newAmount = document.getElementById('edit-amount').value;

    fetch('/habits/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            description: newDesc,
            frequency: newFreq,
            amount: newAmount
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.error) {
            alert("Грешка: " + data.error);
        } else {
            closeModal(); 
            loadHabits(); 
        }
    });
}


function deleteHabit(id) {
    if (confirm("Сигурни ли сте, че искате да изтриете този навик?")) {
        fetch('/habits/' + id, { method: 'DELETE' })
            .then(() => loadHabits());
    }
}


loadHabits();