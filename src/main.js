// Simple, direct JavaScript that WILL work
document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded successfully');
    
    // Show/hide sections
    function showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Hide all sections
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            console.log('Section shown:', sectionId);
        }
        
        // Update nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Navigation links
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            const sectionId = href.substring(1);
            showSection(sectionId);
        }
        
        if (e.target.classList.contains('analysis-cta') ||
            e.target.classList.contains('get-started-cta')) {
            e.preventDefault();
            showSection('book-call');
        }
        
        if (e.target.matches('.cta-button') || e.target.matches('.hero-cta')) {
            e.preventDefault();
            showSection('book-call');
        }
        
        if (e.target.matches('.thank-you-cta')) {
            e.preventDefault();
            showSection('home');
        }
        
        // Blog card clicks
        if (e.target.closest('.blog-card')) {
            e.preventDefault();
            const blogCard = e.target.closest('.blog-card');
            const blogId = blogCard.getAttribute('data-blog-id');
            if (blogId) {
                showSection(`blog-post-${blogId}`);
            }
        }
        
        // FAQ items
        if (e.target.closest('.faq-question')) {
            e.preventDefault();
            const faqItem = e.target.closest('.faq-item');
            faqItem.classList.toggle('active');
            console.log('FAQ toggled');
        }
    });
    
    // Initialize with home page
    showSection('home');
    console.log('Initialization complete');
    
    // Form submission handling
    const bookCallForm = document.getElementById('bookCallForm');
    
    if (bookCallForm) {
        bookCallForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission
            
            // Get the submit button to show loading state
            const submitButton = bookCallForm.querySelector('.form-submit-btn');
            const originalButtonText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                // Collect form data
                const formData = new FormData(event.target);
                const data = {};
                
                // Convert FormData to regular object
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                console.log('Form data:', data);
                
                // Send to Formspree
                const response = await fetch('https://formspree.io/f/mzzayvao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Success - show success message
                    showSection('thank-you');
                    
                    // Reset the form
                    event.target.reset();
                    
                    console.log('Form submitted successfully');
                } else {
                    // Handle errors
                    const errorData = await response.json();
                    console.error('Form submission error:', errorData);
                    alert('There was an error submitting your form. Please try again or contact us directly.');
                }
                
            } catch (error) {
                console.error('Network error:', error);
                alert('An unexpected error occurred. Please check your internet connection and try again.');
            } finally {
                // Restore button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});