function showSection(sectionId) {
    const allSections = document.querySelectorAll('.admin-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    const allNavItems = document.querySelectorAll('.sidebar li');
    allNavItems.forEach(li => {
        li.classList.remove('active');
    });

    const activeNav = document.getElementById('nav-' + sectionId);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    const titles = {
        'dashboard': 'Dashboard / Статистика',
        'users': 'Потребители / Списък',
        'habits': 'Глобални Навици / Управление',
        'settings': 'Настройки / Профил'
    };
    
    const pageTitle = document.getElementById('section-title');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionId];
    }
}

async function initDashboard() {
    try {
        const response = await fetch('/admin/stats');
        const stats = await response.json();
        
        document.getElementById('total-users').textContent = stats.totalUsers;
        document.getElementById('total-habits').textContent = stats.totalHabits;

        const ctxElement = document.getElementById('userGrowthChart');
        if (!ctxElement) return;

        const chartCtx = ctxElement.getContext('2d');
        if (window.myChart) { window.myChart.destroy(); }

        const currentCount = parseInt(stats.totalUsers) || 0;
        
        const labels = ['Начало', 'Преди 3 дни', 'Преди 2 дни', 'Вчера', 'Днес'];
        const dataValues = [0, Math.floor(currentCount * 0.3), Math.floor(currentCount * 0.6), Math.floor(currentCount * 0.8), currentCount];

        window.myChart = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Потребители',
                    data: dataValues, 
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { stepSize: 1, precision: 0 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    } catch (err) {
        console.log("Error dashboard");
    }
}

async function fetchGlobalHabits() {
    const container = document.getElementById('global-habits-list');
    if (!container) return;

    try {
        const response = await fetch('/admin/habits'); 
        const habits = await response.json(); 

        container.innerHTML = ''; 

        if (habits.length === 0) {
            container.innerHTML = '<p>Няма добавени навици в базата.</p>';
            return;
        }

        
        habits.forEach(h => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h4>${h.name}</h4>`;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Грешка при зареждане:", error);
    }
}

async function fetchUsers() {
    try {
        const response = await fetch('/admin/users');
        const users = await response.json();
        const tableBody = document.getElementById('admin-users-list');
        
        if (!tableBody) return;
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>ID: ${user.id}</td>
                <td><strong>${user.username}</strong></td>
                <td><span class="badge ${user.role}">${user.role}</span></td>
                <td>
                    <button class="btn-action edit">⚙️</button>
                    <button class="btn-action delete" onclick="deleteUser(${user.id})">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.log("Error users");
    }
}

async function loadAdminProfile() {
    try {
        const response = await fetch('/admin/me');
        const data = await response.json();
        const adminName = document.querySelector('.administrator-name');
        if (adminName) adminName.textContent = data.username;
        
        const adminImg = document.querySelector('.admin-avatar');
        if (adminImg) {
            
            adminImg.src = data.profile_picture || 'https://ui-avatars.com/api/?name=' + data.username;
        }
    } catch (err) {
        console.log("Error profile");
    }
}

async function saveSettings() {
    const newUsername = document.getElementById('admin-name-input').value;
    if (!newUsername) return;

    try {
        const response = await fetch('/admin/settings/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: newUsername })
        });

        if (response.ok) {
            loadAdminProfile();
            alert('Данните са обновени успешно!');
        }
    } catch (err) {
        console.log("Error update");
    }
}

async function deleteUser(id) {
    if (confirm('Изтриване?')) {
        const response = await fetch('/admin/users/' + id, { method: 'DELETE' });
        if (response.ok) {
            fetchUsers();
            initDashboard();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('dashboard');
    loadAdminProfile();
    initDashboard();
    fetchUsers();
    fetchGlobalHabits();
});