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
    
    // Fix mailto forms and links to prevent mixed content issues
    fixMailtoForms();
    fixMailtoLinks();
    
    // Set up smooth page transitions
    setupPageTransitions();
}

function fixMailtoForms() {
    // Find any forms using mailto: action and convert them to proper contact links
    document.querySelectorAll('form[action^="mailto:"]').forEach(form => {
        const email = form.getAttribute('action').replace('mailto:', '');
        
        // Create a simple contact link instead
        const contactDiv = document.createElement('div');
        contactDiv.className = 'text-center p-4';
        contactDiv.innerHTML = `
            <p class="mb-4 text-gray-600">Contact me directly:</p>
            <a href="mailto:${email}" 
               class="bg-[#1C80A4] text-white px-6 py-3 rounded-md hover:bg-[#1890B4] transition inline-block"
               target="_blank" 
               rel="noopener noreferrer">
               Send Email
            </a>
        `;
        
        // Replace the form with the contact div
        form.parentNode.replaceChild(contactDiv, form);
    });
}

function fixMailtoLinks() {
    // Find all mailto links and ensure they don't cause mixed content issues
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Remove any form-like behavior
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            // Let browser handle mailto naturally
        });
    });
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