document.addEventListener('DOMContentLoaded', function() {
    // Header'ı yükle
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        })
        .catch(error => console.error('Header yüklenirken hata:', error));

    // Footer'ı yükle
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        })
        .catch(error => console.error('Footer yüklenirken hata:', error));
});