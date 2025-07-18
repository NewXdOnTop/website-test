// Check if user is already logged in on page load
window.addEventListener('load', async function () {
  try {
    const response = await fetch('/api/auth/check-auth');
    const data = await response.json();

    if (data.isAuthenticated) {
      // User is already logged in, redirect to profile
      window.location.href = 'profile';
      return;
    }
  } catch (error) {
    console.log('Not authenticated');
  }
});

function togglePasswordVisibility() {
  const passwords = document.querySelectorAll('.password');
  const eyeButton = document.getElementById('eye-button');

  passwords.forEach(password => {
    if (password.type === 'password') {
      password.type = 'text';
      eyeButton.textContent = '🙈 Hide Passwords';
    } else {
      password.type = 'password';
      eyeButton.textContent = '👁 Show Passwords';
    }
  });
}

document.addEventListener('DOMContentLoaded', async function (e) {
  document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm').value;
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');

    // Clear previous error
    errorMessage.style.display = 'none';

    // Password does not match!
    if (password !== confirmPassword) {
      errorMessage.textContent = 'Passwords do not match';
      errorMessage.style.display = 'block';
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    try {
      const formData = new FormData(this);
      const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name')
      };

      const response = await fetch('/api/auth/register', { // make a request
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) { // We can process now
        window.location.href = 'profile';
      } else {
        errorMessage.textContent = data.message || 'Registration failed';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      console.error('Registration error:', error);
      errorMessage.textContent = 'Network error. Please try again.';
      errorMessage.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
});
