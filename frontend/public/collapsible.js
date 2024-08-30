document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-followers');
    const followersList = document.getElementById('followers-list');
  
    toggleButton.addEventListener('click', () => {
      if (followersList.style.display === 'none') {
        followersList.style.display = 'block';
        toggleButton.textContent = 'Show Less';
      } else {
        followersList.style.display = 'none';
        toggleButton.textContent = 'Show All';
      }
    });
  });