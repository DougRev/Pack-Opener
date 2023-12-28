
document.getElementById('startGame').addEventListener('click', function() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('packSelection').classList.remove('hidden');
});

document.getElementById('registerButton').addEventListener('click', function() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    register(username, password);
});

document.getElementById('loginButton').addEventListener('click', function() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    login(username, password);
});

document.querySelectorAll('.pack-option').forEach(pack => {
    pack.addEventListener('click', function() {
        document.getElementById('packSelection').classList.add('hidden');
        document.getElementById('packOpening').classList.remove('hidden');
        initializePackOpening();
    });
});

document.getElementById('backToPackSelection').addEventListener('click', function() {
    document.getElementById('packOpening').classList.add('hidden');
    document.getElementById('packSelection').classList.remove('hidden');
    resetPackOpening(); // This will clean up and reset the card display
});

document.getElementById('backToHomeFromPackSelection').addEventListener('click', function() {
    document.getElementById('packSelection').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
});

function initializePackOpening() {
    // Assuming the cards have been freshly created by resetPackOpening
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Attach event listener to each card
        card.addEventListener('click', function() {
            revealCard(card);
        });
    });
}

function resetPackOpening() {
    // Get the container holding the cards
    const packOpeningContainer = document.getElementById('packOpening');
    
    // Clear the container's innerHTML to remove all card elements and their event listeners
    packOpeningContainer.innerHTML = '';

    // Now create the card elements again
    for (let i = 1; i <= 5; i++) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.id = 'card' + i;
        // Append each new card to the container
        packOpeningContainer.appendChild(cardDiv);
    }

    // Add a button to go back to pack selection
    const backButton = document.createElement('button');
    backButton.id = 'backToPackSelection';
    backButton.textContent = 'Back to Packs';
    backButton.addEventListener('click', function() {
        document.getElementById('packOpening').classList.add('hidden');
        document.getElementById('packSelection').classList.remove('hidden');
        resetPackOpening();
    });
    packOpeningContainer.appendChild(backButton);
}

function revealCard(card) {
    if (!card.classList.contains('flipped')) {
        // Start flipping animation
        gsap.to(card, { duration: 0.3, rotationY: 90 });
        
        // Fetch a random card data
        getRandomCard().then(cardData => {
            setTimeout(function() {
                // Set the background image of the card to the image from the JSON
                card.style.backgroundImage = `url('${cardData.image}')`;

                // Complete the flip animation
                gsap.to(card, { duration: 0.3, rotationY: 180 });
                
                // Add flipped class to keep it in a flipped state
                card.classList.add('flipped');

                // Show the modal with card details
                showModal(cardData);
            }, 300); // Wait for half flip animation
        });
    }
}
function getRandomCard() {
    // For simplicity, using local JSON file. This could be an API call.
    return fetch('cards.json')
        .then(response => response.json())
        .then(cards => {
            const randomIndex = Math.floor(Math.random() * cards.length);
            return cards[randomIndex];
        });
}

function showModal(cardData, cardElement) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${cardData.image}" alt="${cardData.name}" />
            <h2>${cardData.name}</h2>
            <p>${cardData.description}</p>
        </div>
    `;
    

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close');
    closeButton.onclick = function() {
        // Close the modal and remove it from the DOM
        modal.style.display = 'none';
        modal.remove();
        // Don't reset the card's background image, it should display the card face now
    };

    modal.style.display = 'block';
}

const BASE_URL = 'http://localhost:5000/api'; // Change to your actual server URL

async function login(username, password) {
    try {
        // Make sure BASE_URL is just the domain and port, e.g., http://localhost:5000
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Handle non-JSON responses
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
    if (data.token) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        alert('Logged in successfully!');
        // Redirect or load user profile/dashboard
    } else {
        // If the backend response includes a message, display it
        console.error('Login failed:', data.message || "No token returned");
        alert('Login failed: ' + (data.message || "No token returned"));
    }
    } catch (error) {
        console.error('Login error:', error);
        // Display an error message to the user
        alert('Login error: ' + (error.message || error));
    }
}


async function register(username, password) {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Registration successful:', data);
            // Clear the input fields
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerPassword').value = '';
            // Display a success message to the user
            alert('Account Registered!'); // This can be replaced with a more elegant notification
        } else {
            console.error('Registration failed:', data.message);
            // Optionally display an error message to the user
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration error: ' + error);
    }
}



async function loadInventory() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/inventory`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const cards = await response.json();
        if (response.ok) {
            displayInventory(cards);
        } else {
            console.error('Failed to load inventory:', cards.message);
        }
    } catch (error) {
        console.error('Failed to load inventory:', error);
    }
}

async function addCardToInventory(cardId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/inventory/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardId })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Card added to inventory:', result);
        } else {
            console.error('Failed to add card:', result.message);
        }
    } catch (error) {
        console.error('Failed to add card:', error);
    }
}

function displayInventory(cards) {
    const inventoryDiv = document.getElementById('inventoryContainer');
    inventoryDiv.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <h3>${card.name}</h3>
            <img src="${card.imageUrl}" alt="${card.name}" />
            <p>${card.description}</p>
        `;
        inventoryDiv.appendChild(cardElement);
    });
}