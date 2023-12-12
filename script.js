function submitForm() {
    var form = document.getElementById('loginForm');
    var username = document.getElementById('nameL').value;
    var password = document.getElementById('passwordL').value;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.error) {
                    document.getElementById('errorMessage').innerText = response.message;
                } else {
                    window.location.href = 'game.html';
                }
            } else {
                console.error('Error: ' + xhr.status);
            }
        }
    };

    xhr.open('POST', 'login.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password));
}
