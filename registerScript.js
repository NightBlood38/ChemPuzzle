function submitForm() {
    const form = document.getElementById('registerForm');
    const username = document.getElementById('nameR').value;
    const password = document.getElementById('passwordR').value;
    const email = document.getElementById('email').value;

    fetch('register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'username': username,
            'password': password,
            'email': email,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('errorMessage').innerText = data.message;
        } else {
            document.getElementById('successMessage').innerText = data.message;
            document.getElementById('errorMessage').innerText = " ";
        }
    })
    .catch(error => console.error('Error:', error));
    event.preventDefault();
}
