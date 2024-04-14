document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('github-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('search').value;
        searchUsers(username)
            .then(data => displayUserInformation(data.items))
            .catch(error => console.error('Error fetching user data:', error));
    });
});

async function searchUsers(username) {
    const url = `https://api.github.com/search/users?q=${username}`;
    
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

function displayUserInformation(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; 

    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <h3>${user.login}</h3>
            <img src="${user.avatar_url}" alt="${user.login}'s avatar">
            <a href="${user.html_url}" target="_blank">View Profile</a>
        `;
        
        userItem.addEventListener('click', function() {
            getUserRepos(user.login)
                .then(data => displayRepos(data))
                .catch(error => console.error('Error fetching repositories:', error));
        });

        userList.appendChild(userItem);
    });
}

async function getUserRepos(username) {
    const url = `https://api.github.com/users/${username}/repos`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

function displayRepos(repos) {
    const reposList = document.getElementById('repos-list');
    reposList.innerHTML = ''; 

    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        reposList.appendChild(repoItem);
    });
}
