function toggleForms() {
            const loginForm = document.getElementById('login-form');
            const regForm = document.getElementById('register-form');
            
            if (loginForm.style.display === 'none') {
                loginForm.style.display = 'block';
                regForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                regForm.style.display = 'block';
            }
        }

        function register() {
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const errorDiv = document.getElementById('reg-error');

            fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    errorDiv.innerText = data.error;
                    errorDiv.style.display = 'block';
                } else {
                    alert('Успешна регистрация! Сега можеш да влезеш.');
                    toggleForms(); 
                }
            });
        }

       
        function login() {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');

            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    errorDiv.innerText = data.error;
                    errorDiv.style.display = 'block';
                } else {
                    
                    window.location.href = '/'; 
                }
            });
        }