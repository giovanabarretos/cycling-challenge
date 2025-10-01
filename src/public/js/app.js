// Utility function to show messages
function showMessage(message, isError = false) {
    // Remove any existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;

    const form = document.getElementById('submitForm');
    form.insertAdjacentElement('beforebegin', messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => messageDiv.remove(), 5000);
}

// Update the countdown timer
function updateTimer() {
    fetch('/api/timer')
        .then(response => response.json())
        .then(data => {
            const countdownElement = document.getElementById('countdown');
            countdownElement.textContent = `${data.days}d ${data.hours}h ${data.minutes}m ${data.seconds}s`;
        })
        .catch(error => {
            console.error('Error fetching timer:', error);
        });
}

// Update the leaderboard
function updateLeaderboard() {
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(users => {
            const leaderboardElement = document.getElementById('leaderboard');
            leaderboardElement.innerHTML = '';

            users.forEach((user, index) => {
                const entry = document.createElement('div');
                entry.className = 'leaderboard-entry';
                entry.innerHTML = `
                    <span class="rank">#${index + 1}</span>
                    <span class="username">${user.instagramUser}</span>
                    <span class="points">${user.totalPoints} pontos</span>
                `;
                leaderboardElement.appendChild(entry);
            });
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
        });
}

// Handle form submission
document.getElementById('submitForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const instagramUser = document.getElementById('instagramUser').value;
    const passcode = document.getElementById('passcode').value;

    try {
        const response = await fetch('/api/passcodes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instagramUser, passcode }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Passcode submitted successfully!');
            document.getElementById('passcode').value = '';
            updateLeaderboard();
        } else {
            showMessage(data.error, true);
        }
    } catch (error) {
        showMessage('An error occurred while submitting the passcode.', true);
        console.error('Error:', error);
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateLeaderboard();
    updateTimer();
    // Update timer every second
    setInterval(updateTimer, 1000);
    // Update leaderboard every minute
    setInterval(updateLeaderboard, 60000);
});