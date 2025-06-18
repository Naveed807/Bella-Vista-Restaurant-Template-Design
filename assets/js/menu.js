// Tab Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to show a specific tab
    function showTab(targetTab) {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Show target tab content
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            showTab(targetTab);
        });
    });

    // Initialize - show the first active tab or default to appetizers
    const initialActiveTab = document.querySelector('.tab-btn.active');
    if (initialActiveTab) {
        const initialTab = initialActiveTab.getAttribute('data-tab');
        showTab(initialTab);
    } else {
        showTab('appetizers');
    }
});