document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let age = 25;
    let height = 180;
    let weight = 80;
    let gender = 'male';
    let activityLevel = 'moderate';
    
    // DOM Elements
    const ageInput = document.getElementById('age');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const genderOptions = document.querySelectorAll('.gender-option');
    const activityCards = document.querySelectorAll('.activity-card');
    const numberInputs = document.querySelectorAll('.number-input');
    
    // Initialize Chart with smooth animation
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Calories Consumed',
                data: [2200, 2300, 2100, 2400, 2300, 2500, 2200],
                borderColor: '#7CB342',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(124, 179, 66, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#7CB342',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#7CB342',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#2C3E50',
                    bodyColor: '#2C3E50',
                    borderColor: '#7CB342',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Calories: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#7F8C8D',
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#7F8C8D',
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            }
        }
    });

    // Setup number inputs
    numberInputs.forEach(container => {
        const input = container.querySelector('input');
        const decreaseBtn = container.querySelector('.decrease');
        const increaseBtn = container.querySelector('.increase');
        const valueDisplay = container.parentElement.querySelector('.value');
        
        decreaseBtn.addEventListener('click', () => {
            const newValue = Math.max(parseInt(input.value) - 1, parseInt(input.min));
            updateInputValue(input, newValue, valueDisplay);
        });
        
        increaseBtn.addEventListener('click', () => {
            const newValue = Math.min(parseInt(input.value) + 1, parseInt(input.max));
            updateInputValue(input, newValue, valueDisplay);
        });
        
        input.addEventListener('change', () => {
            let newValue = parseInt(input.value);
            newValue = Math.min(Math.max(newValue, parseInt(input.min)), parseInt(input.max));
            updateInputValue(input, newValue, valueDisplay);
        });
    });

    function updateInputValue(input, value, display) {
        input.value = value;
        display.textContent = value;
        
        switch(input.id) {
            case 'age':
                age = value;
                break;
            case 'height':
                height = value;
                break;
            case 'weight':
                weight = value;
                break;
        }
        
        updateResults();
    }

    // Gender selection
    genderOptions.forEach(option => {
        option.addEventListener('click', () => {
            genderOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            gender = option.dataset.gender;
            updateResults();
        });
    });

    // Activity level selection
    activityCards.forEach(card => {
        card.addEventListener('click', () => {
            activityCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            activityLevel = card.dataset.level;
            updateResults();
        });
    });

    // Calculate BMR (Basal Metabolic Rate)
    function calculateBMR() {
        if (gender === 'male') {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    // Calculate Activity Multiplier
    function getActivityMultiplier() {
        const multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very-active': 1.9
        };
        return multipliers[activityLevel] || 1.55;
    }

    // Smooth value updates
    function updateValueWithAnimation(element, newValue) {
        const currentValue = parseInt(element.textContent);
        const difference = newValue - currentValue;
        const duration = 1000;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.round(currentValue + (difference * progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Update Results with animations
    function updateResults() {
        const bmr = calculateBMR();
        const activityMultiplier = getActivityMultiplier();
        const maintenanceCalories = Math.round(bmr * activityMultiplier);
        const weightLossCalories = Math.round(maintenanceCalories * 0.8);
        const weightGainCalories = Math.round(maintenanceCalories * 1.2);

        // Update DOM with animations
        updateValueWithAnimation(document.querySelector('#maintenance .calorie-value'), maintenanceCalories);
        updateValueWithAnimation(document.querySelector('#weight-loss .calorie-value'), weightLossCalories);
        updateValueWithAnimation(document.querySelector('#weight-gain .calorie-value'), weightGainCalories);

        // Add animation effect to result boxes
        const resultBoxes = document.querySelectorAll('.result-box');
        resultBoxes.forEach(box => {
            box.style.animation = 'none';
            box.offsetHeight; // Trigger reflow
            box.style.animation = 'pulse 0.5s ease-in-out';
        });

        // Update chart with new data
        const newData = Array.from({length: 7}, () => 
            Math.round(maintenanceCalories * (0.9 + Math.random() * 0.2))
        );
        progressChart.data.datasets[0].data = newData;
        progressChart.update('active');
    }

    // Initialize with default values
    updateResults();
});