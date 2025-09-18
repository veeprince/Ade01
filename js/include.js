async function includeHTML() {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
        const file = el.getAttribute('data-include');
        if (file) {
            try {
                // Try XMLHttpRequest which works with both http:// and file:// protocols
                const xhr = new XMLHttpRequest();
                xhr.open('GET', file, false);  // false makes it synchronous
                xhr.send();
                if (xhr.status === 200 || xhr.status === 0) { // 0 for local files
                    el.innerHTML = xhr.responseText;
                }
            } catch (err) {
                console.error(`Failed to load ${file}:`, err);
                // Fallback to fetch for http/https
                try {
                    const resp = await fetch(file);
                    if (resp.ok) {
                        el.innerHTML = await resp.text();
                    }
                } catch (fetchErr) {
                    console.error(`Fetch fallback failed for ${file}:`, fetchErr);
                }
            }
        }
    }
    // After all includes are loaded, initialize feather icons and other components
    if (window.feather) {
        feather.replace();
    }

    // Re-initialize mobile menu after header is loaded
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Set up smooth page transitions
    document.querySelectorAll('a').forEach(link => {
        if (link.href.includes(window.location.hostname) &&
            !link.href.includes('#') &&
            link.href !== window.location.href) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', includeHTML);
