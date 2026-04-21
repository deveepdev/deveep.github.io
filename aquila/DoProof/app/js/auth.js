  const authBtn = document.getElementById('authBtn');
  const authBackdrop = document.getElementById('authModalBackdrop');
  const closeAuthModal = document.getElementById('closeAuthModal');

  const openModal = () => {
    authBackdrop.classList.add('open');
    authBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const emailField = authBackdrop.querySelector('input[type="email"]');
    emailField?.focus();
  };

  const closeModal = () => {
    authBackdrop.classList.remove('open');
    authBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  authBtn?.addEventListener('click', openModal);
  closeAuthModal?.addEventListener('click', closeModal);
  const togglePassword = document.getElementById('togglePassword');

  togglePassword?.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.textContent = isPassword ? 'Hide' : 'Show';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && authBackdrop?.classList.contains('open')) closeModal();
  });