document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            link.classList.add('active');
            const tabId = link.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
        console.log('Refreshing...');
    });
    
    document.getElementById('settings-btn').addEventListener('click', () => {
        console.log('Opening settings...');
    });
    
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
    });
});