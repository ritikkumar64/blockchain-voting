let candidates = JSON.parse(localStorage.getItem('candidates')) || [];

// Add a candidate (Admin function)
function addCandidate() {
    const name = document.getElementById('candidateName').value;
    const party = document.getElementById('partyName').value;
    const imageFile = document.getElementById('candidateImage').files[0];

    if (name && party && imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const candidate = {
                id: Date.now(),
                name: name,
                party: party,
                image: e.target.result,
                votes: 0
            };
            candidates.push(candidate);
            localStorage.setItem('candidates', JSON.stringify(candidates));
            displayCandidates();
            alert('Candidate added successfully!');
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert('Please fill all fields and select an image.');
    }
}

// Display the list of candidates (Admin function)
function displayCandidates() {
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = '<h3>Candidate List</h3>';
    candidates.forEach(candidate => {
        const div = document.createElement('div');
        div.className = 'candidate-item';
        div.innerHTML = `
            <strong>${candidate.name}</strong><br>
            Party: ${candidate.party}<br>
            <img src="${candidate.image}" alt="${candidate.name}">
        `;
        candidateList.appendChild(div);
    });
}

// Register a user and show candidates for voting (User function)
function registerUser() {
    const name = document.getElementById('userName').value;
    const age = document.getElementById('userAge').value;

    if (name && age >= 18) {
        localStorage.setItem('user', JSON.stringify({ name, age }));
        displayVotingCandidates();
    } else {
        alert('Please enter your name and ensure you are at least 18 years old.');
    }
}

// Display the candidates for voting (User function)
function displayVotingCandidates() {
    const candidateList = document.getElementById('candidateList');
    const user = localStorage.getItem('hasVoted');

    if (user) {
        candidateList.innerHTML = '<h3>You have already voted.</h3>';
        displayResults();
        return;
    }

    candidateList.innerHTML = '<h3>Vote for a Candidate</h3>';
    candidates.forEach(candidate => {
        const div = document.createElement('div');
        div.className = 'candidate-item';
        div.innerHTML = `
            <strong>${candidate.name}</strong><br>
            Party: ${candidate.party}<br>
            <img src="${candidate.image}" alt="${candidate.name}"><br>
            <button onclick="vote(${candidate.id})" class="btn">Vote</button>
        `;
        candidateList.appendChild(div);
    });
}

// Cast a vote (User function)
function vote(candidateId) {
    candidates = candidates.map(candidate => {
        if (candidate.id === candidateId) {
            candidate.votes += 1;
        }
        return candidate;
    });
    localStorage.setItem('candidates', JSON.stringify(candidates));
    localStorage.setItem('hasVoted', true);
    alert('Thank you for voting!');
    displayVotingCandidates();
    displayResults();
}

// Display the voting results (User function)
function displayResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Voting Results</h3>';
    candidates.forEach(candidate => {
        const div = document.createElement('div');
        div.className = 'candidate-item';
        div.innerHTML = `
            <strong>${candidate.name}</strong><br>
            Votes: ${candidate.votes}
        `;
        resultsDiv.appendChild(div);
    });
}

// On page load (Admin or User)
window.onload = function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        displayVotingCandidates();
    } else if (document.getElementById('candidateList')) {
        displayCandidates();
    }
};
