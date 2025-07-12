fetch('http://localhost:5000/api/users/public')
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById('users');
    div.innerHTML = data.map(user => `<p>${user.name} - Skills: ${user.skillsOffered.join(', ')}</p>`).join('');
  });
