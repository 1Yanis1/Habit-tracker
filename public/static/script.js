let habitIdToDelete = null;

    document.addEventListener('DOMContentLoaded', loadHabits);

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

                if (data.length === 0) {
                    container.innerHTML = '<p style="text-align:center; color:#888;">Няма намерени навици. Добави първия!</p>';
                    return;
                }

                let html = '';
                data.forEach(h => {
                    const habitName = h.Description || h.Habit;
                    const freq = h.Frequency_type || 'Daily';
                    const amount = h.Amount || 1;

                    html += `
                        <div class="habit-card">
                            <div class="habit-info">
                                <strong>${habitName}</strong>
                                <span>${freq}</span> • <span>${amount} пъти</span>
                            </div>
                            <div class="actions">
                                <button class="edit-btn" onclick="openEditModal(${h.Habit_ID}, '${habitName}', '${freq}', ${amount})">
                                    ✏️ Редактирай
                                </button>
                                <button class="delete-btn" onclick="askDelete(${h.Habit_ID})">
                                    🗑️ Изтрий
                                </button>
                            </div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            })
            .catch(err => {
                console.error("Грешка:", err);
                document.getElementById('habits-container').innerHTML = '<p style="color:red">Грешка при връзката със сървъра.</p>';
            });
    }

    function addHabit() {
        const desc = document.getElementById('habit-desc').value;
        const freq = document.getElementById('habit-freq').value;
        const amount = document.getElementById('habit-amount').value;

        if(!desc) return alert("Моля напишете име!");

        fetch('/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: desc, frequency: freq, amount: amount })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) alert(data.error);
            else {
                document.getElementById('habit-desc').value = '';
                loadHabits();
            }
        });
    }

    function openEditModal(id, description, frequency, amount) {
        document.getElementById('editModal').style.display = 'flex';
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-desc').value = description;
        document.getElementById('edit-freq').value = frequency;
        document.getElementById('edit-amount').value = amount;
    }

    function closeEditModal() {
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
                closeEditModal();
                loadHabits();
            }
        });
    }

    function askDelete(id) {
        habitIdToDelete = id;
        document.getElementById('deleteModal').style.display = 'flex';
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        habitIdToDelete = null;
    }

    function confirmDelete() {
        if (!habitIdToDelete) return;
        
        fetch('/habits/' + habitIdToDelete, { method: 'DELETE' })
            .then(() => {
                closeDeleteModal();
                loadHabits();
            });
    }

    function logout() {
        fetch('/logout').then(() => window.location.href = '/login.html');
    }