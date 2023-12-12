function submitForm() {
    const form = document.getElementById('loginForm');
    const username = document.getElementById('nameL').value;
    const password = document.getElementById('passwordL').value;

    fetch('login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'username': username,
            'password': password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('errorMessage').innerText = data.message;
        } else {
            window.location.href = 'game.html';
        }
    })
    .catch(error => console.error('Error:', error));
}
