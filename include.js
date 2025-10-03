// Set up event delegation immediately - works even if elements don't exist yet
document.addEventListener('click', function(e) {
    if (e.target.closest('#mobile-menu-button')) {
        const menu = document.getElementById('mobile-menu');
        const button = document.getElementById('mobile-menu-button');
        
        if (menu) {
            menu.classList.toggle('hidden');
            menu.classList.toggle('expanded');
            
            if (button) {
                const isExpanded = !menu.classList.contains('hidden');
                button.setAttribute('aria-expanded', isExpanded);
            }
        }
    }
});

// Define toggle function immediately - before any DOM processing
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('expanded');
        
        if (button) {
            const isExpanded = !menu.classList.contains('hidden');
            button.setAttribute('aria-expanded', isExpanded);
        }
    }
};

async function includeHTML() {
    const includes = document.querySelectorAll('[data-include]');
    
    // Process all includes
    for (const element of includes) {
        const file = element.getAttribute('data-include');
        if (!file) continue;
        
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            element.innerHTML = await response.text();
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
            element.innerHTML = `<p>Error loading ${file}</p>`;
        }
    }
    
    // Initialize components after all includes are loaded
    initializeComponents();
}

function initializeComponents() {
    // Initialize feather icons
    if (window.feather && typeof window.feather.replace === 'function') {
        feather.replace();
    }
    
    // Set up smooth page transitions
    setupPageTransitions();
}

function setupPageTransitions() {
    document.querySelectorAll('a').forEach(link => {
        // Skip if already has listener or is external/anchor link
        if (link.dataset.transitionReady || 
            !link.href.includes(window.location.hostname) ||
            link.href.includes('#') ||
            link.href === window.location.href) {
            return;
        }
        
        link.dataset.transitionReady = 'true';
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        });
    });
}

// Single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', includeHTML);