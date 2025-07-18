
// When webpage is loaded this script will run
document.addEventListener('DOMContentLoaded', function () {
  // Check authentication status when account button is clicked
  const accountButton = document.getElementById('account-info');

  if (accountButton) {
    accountButton.addEventListener('click', async function (e) {
      e.preventDefault();

      try {
        const response = await fetch('/api/auth/check-auth');
        const data = await response.json();

        if (data.isAuthenticated) {
          window.location.href = 'profile';
        } else {
          window.location.href = 'signup';
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Fallback to accounts page if there's an error
        window.location.href = 'signup';
      }
    });
  }

  // Optional: Check authentication status on page load and update UI
  checkAuthStatus();
});

async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/check-auth');
    const data = await response.json();

    const accountButton = document.getElementById('account-info');
    if (accountButton && data.isAuthenticated) {
      // User is logged In
      accountButton.title = `Logged in as ${data.user.email}`;

      // Change border
      const accountImg = accountButton.querySelector('img');
      if (accountImg) {
        accountImg.style.border = '2px solid #28a745';
        accountImg.style.borderRadius = '50%';
      }
    }
  } catch (error) {
    console.log('Not authenticated or server error');
  }
}
