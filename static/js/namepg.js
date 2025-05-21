document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js with enhanced configuration
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4CAF50"
            },
            "shape": {
                "type": "circle",
            },
            "opacity": {
                "value": 0.5,
                "random": false,
            },
            "size": {
                "value": 3,
                "random": true,
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4CAF50",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });

    // Load saved form data
    loadFormData();

    // Setup navigation buttons
    setupNavigation();

    // Update progress bar when changing sections
    updateProgressBar();

    // Add checkbox animation
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const container = this.closest('.checkbox-container');
            if (this.checked) {
                container.classList.add('selected');
            } else {
                container.classList.remove('selected');
            }
            // Save form data when checkbox changes
            saveFormData();
        });
    });

    // Add radio button animation
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Reset all in the same group
            const name = this.getAttribute('name');
            const groupRadios = document.querySelectorAll(`input[name="${name}"]`);
            
            groupRadios.forEach(groupRadio => {
                const container = groupRadio.closest('.radio-container');
                if (container) {
                    container.classList.remove('selected');
                }
            });
            
            // Style the selected one
            const container = this.closest('.radio-container');
            if (container) {
                container.classList.add('selected');
            }
            
            // Save form data when radio changes
            saveFormData();
        });
    });

    // Add input field focus animation
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
            saveFormData();
        });
        
        // For select and date inputs
        if (input.tagName === 'SELECT' || input.type === 'date') {
            input.addEventListener('change', function() {
                saveFormData();
                if (this.value !== '') {
                    this.parentElement.classList.add('has-value');
                } else {
                    this.parentElement.classList.remove('has-value');
                }
            });
        }
    });

    // Enhanced form submission with loading indicator and better error handling
    const submitBtn = document.getElementById('submit-btn');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-spinner';
    loadingIndicator.innerHTML = '<div class="spinner"></div>';
    
    // Simplified form submission
    if (submitBtn) {
        submitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
    
            if (!validateForm()) {
                return;
            }
    
            // Show loading state
            submitBtn.disabled = true;
            
            // Gather form data
            const formData = {
                name: document.getElementById('user-name').value.trim(),
                goals: Array.from(document.querySelectorAll('input[name="selections"]:checked')).map(cb => cb.value).join(','),
                workout_level: document.querySelector('input[name="workout_level"]:checked')?.value || '',
                gender: document.querySelector('input[name="gender"]:checked')?.value || '',
                birthdate: document.getElementById('birthdate').value,
                height: parseFloat(document.getElementById('height').value.trim()),
                weight: parseFloat(document.getElementById('weight').value.trim())
            };
    
            try {
                const response = await fetch('/api/fitness-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
    
                if (response.ok) {
                    // Success - show success section
                    showSection('section-6');
                    document.getElementById('user-greeting').textContent = 
                        `${formData.name}, your fitness journey is about to begin!`;
                    localStorage.removeItem('fitnessAppData');
                } else {
                    const errorData = await response.json();
                    showErrorMessage(errorData.error || 'Failed to save data');
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Network error. Please try again.');
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    // Function to submit data to API
    async function submitDataToAPI(formData) {
        return fetch('/api/fitness-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        });
    }

    // Function to handle successful form submission
    function handleSuccessfulSubmission(formData) {
        // Store the form data in sessionStorage for immediate access in profile
        sessionStorage.setItem('fitnessProfileData', JSON.stringify(formData));

        // Update user greeting with name from form
        if (formData.name) {
            document.getElementById('user-greeting').textContent = `${formData.name}, your fitness journey is about to begin!`;
        }

        // Navigate to success section (section-6)
        showSection('section-6');

        // Create confetti effect
        createConfetti();
        
        // Clean up loading state
        submitBtn.disabled = false;
        if (loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
        
        // Clear localStorage since data is now saved in the database
        localStorage.removeItem('fitnessAppData');
    }
    
    // Function to show error message
    function showErrorMessage(message) {
        // Create or find error message container
        let errorContainer = document.getElementById('form-error-message');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'form-error-message';
            errorContainer.className = 'error-message';
            submitBtn.parentNode.insertBefore(errorContainer, submitBtn);
        }
        
        errorContainer.textContent = `Error: ${message}`;
        errorContainer.style.display = 'block';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
    
    // Function to validate form before submission
    function validateForm() {
        const userName = document.getElementById('user-name').value.trim();
        const goals = document.querySelectorAll('input[name="selections"]:checked');
        const workoutLevel = document.querySelector('input[name="workout_level"]:checked');
        const gender = document.querySelector('input[name="gender"]:checked');
        const birthdate = document.getElementById('birthdate').value;
        const height = document.getElementById('height').value.trim();
        const weight = document.getElementById('weight').value.trim();
        
        let isValid = true;
        let errorMessage = '';
        
        // Validate name
        if (!userName) {
            errorMessage = 'Please enter your name';
            isValid = false;
        }
        // Validate goals
        else if (goals.length === 0) {
            errorMessage = 'Please select at least one fitness goal';
            isValid = false;
        }
        // Validate workout level
        else if (!workoutLevel) {
            errorMessage = 'Please select your workout level';
            isValid = false;
        }
        // Validate gender
        else if (!gender) {
            errorMessage = 'Please select your gender';
            isValid = false;
        }
        // Validate birthdate
        else if (!birthdate) {
            errorMessage = 'Please enter your birthdate';
            isValid = false;
        }
        // Validate height
        else if (!height) {
            errorMessage = 'Please enter your height';
            isValid = false;
        }
        // Validate weight
        else if (!weight) {
            errorMessage = 'Please enter your weight';
            isValid = false;
        }
        
        if (!isValid) {
            showErrorMessage(errorMessage);
            submitBtn.disabled = false;
        }
        
        return isValid;
    }

    // Keep "Go to Dashboard" button to just redirect to dashboard
    const goToDashboardBtn = document.querySelector('.btn.btn-next.pulse-button');
    if (goToDashboardBtn) {
        goToDashboardBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/dashboard';
        });
    }

    // Focus on the name input field
    const nameInput = document.getElementById('user-name');
    if (nameInput) {
        setTimeout(() => {
            nameInput.focus();
        }, 500);
    }

    // Check if input fields have values on load
    checkInputValues();
});

// Set up next/back navigation
function setupNavigation() {
    // Set up next buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const nextSection = this.getAttribute('data-next');
            if (nextSection) {
                showSection(nextSection);
                saveFormData();
                updateProgressBar();
            }
        });
    });
    
    // Set up back buttons
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const prevSection = this.getAttribute('data-prev');
            if (prevSection) {
                showSection(prevSection);
                updateProgressBar();
            }
        });
    });

    // Set up progress step clicks
    const progressSteps = document.querySelectorAll('.step');
    progressSteps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            showSection('section-' + stepNumber);
            updateProgressBar();
        });
    });
}

// Update progress bar
function updateProgressBar() {
    const activeSection = document.querySelector('.form-section.active');
    if (!activeSection) return;
    
    const sectionId = activeSection.id;
    const stepNumber = sectionId.split('-')[1];
    
    // Update progress indicator width
    const progress = ((stepNumber - 1) / 4) * 100; // 5 steps total, but last step is success
    document.getElementById('progress-indicator').style.width = `${progress}%`;
    
    // Update active step
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        const stepData = step.getAttribute('data-step');
        if (parseInt(stepData) <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Function to show a specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top of section
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Save form data to localStorage
function saveFormData() {
    const formData = {
        // Name section
        userName: document.getElementById('user-name')?.value || '',
        
        // Goals section
        goals: Array.from(document.querySelectorAll('input[name="selections"]:checked')).map(cb => cb.value),
        
        // Proficiency section
        workoutLevel: document.querySelector('input[name="workout_level"]:checked')?.value || '',
        
        // Personal info section
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        birthdate: document.getElementById('birthdate')?.value || '',
        location: document.getElementById('location')?.value || '',
        zipCode: document.getElementById('zip-code')?.value || '',
        
        // Body measurements section
        height: document.getElementById('height')?.value || '',
        weight: document.getElementById('weight')?.value || ''
    };
    
    localStorage.setItem('fitnessAppData', JSON.stringify(formData));
}

// Load form data from localStorage
function loadFormData() {
    const savedData = localStorage.getItem('fitnessAppData');
    if (!savedData) return;
    
    try {
        const formData = JSON.parse(savedData);
        
        // Name section
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').value = formData.userName || '';
            if (formData.userName) {
                document.getElementById('user-name').parentElement.classList.add('focused');
            }
        }
        
        // Goals section
        if (formData.goals && formData.goals.length) {
            formData.goals.forEach(goal => {
                const checkbox = document.querySelector(`input[value="${goal}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    const container = checkbox.closest('.checkbox-container');
                    if (container) {
                        container.classList.add('selected');
                    }
                }
            });
        }
        
        // Proficiency section
        if (formData.workoutLevel) {
            const workoutRadio = document.querySelector(`input[value="${formData.workoutLevel}"]`);
            if (workoutRadio) {
                workoutRadio.checked = true;
                const container = workoutRadio.closest('.radio-container');
                if (container) {
                    container.classList.add('selected');
                }
            }
        }
        
        // Personal info section
        if (formData.gender) {
            const genderRadio = document.querySelector(`input[value="${formData.gender}"]`);
            if (genderRadio) {
                genderRadio.checked = true;
                const container = genderRadio.closest('.radio-container');
                if (container) {
                    container.classList.add('selected');
                }
            }
        }
        
        if (formData.birthdate && document.getElementById('birthdate')) {
            document.getElementById('birthdate').value = formData.birthdate;
            document.getElementById('birthdate').parentElement.classList.add('has-value');
        }
        
        if (formData.location && document.getElementById('location')) {
            document.getElementById('location').value = formData.location;
            document.getElementById('location').parentElement.classList.add('has-value');
        }
        
        if (formData.zipCode && document.getElementById('zip-code')) {
            document.getElementById('zip-code').value = formData.zipCode;
            document.getElementById('zip-code').parentElement.classList.add('focused');
        }
        
        // Body measurements section
        if (formData.height && document.getElementById('height')) {
            document.getElementById('height').value = formData.height;
            document.getElementById('height').parentElement.classList.add('focused');
        }
        
        if (formData.weight && document.getElementById('weight')) {
            document.getElementById('weight').value = formData.weight;
            document.getElementById('weight').parentElement.classList.add('focused');
        }
        
    } catch (error) {
        console.error('Error loading saved form data:', error);
    }
}

// Check if input fields have values
function checkInputValues() {
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach(input => {
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
            if (input.tagName === 'SELECT' || input.type === 'date') {
                input.parentElement.classList.add('has-value');
            }
        }
    });
}

// Create confetti effect for success page
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    const colors = ['#4CAF50', '#388E3C', '#8BC34A', '#A5D6A7', '#FFFFFF'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const positionLeft = Math.random() * 100;
        const rotation = Math.random() * 360;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        // Apply styles
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${positionLeft}%`;
        confetti.style.backgroundColor = color;
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.animation = `confettiFall ${duration}s ${delay}s ease-in-out forwards`;
        
        confettiContainer.appendChild(confetti);
    }
    
    // Clean up confetti after animation completes
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000);
}