(function () {
  const year = new Date().getFullYear();
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = String(year);

  const form = document.querySelector('form[data-formspree]');
  if (!form) return;

  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    if (!window.fetch) return;

    e.preventDefault();

    if (statusEl) {
      statusEl.classList.remove('is-success', 'is-error');
      statusEl.textContent = 'Sending…';
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        form.reset();
        if (statusEl) {
          statusEl.classList.add('is-success');
          statusEl.textContent = 'Thank you — your inquiry has been sent. We’ll reply as soon as possible.';
        }
        return;
      }

      let msg = 'Sorry — something went wrong. Please try again.';
      try {
        const data = await res.json();
        if (data && Array.isArray(data.errors) && data.errors.length) {
          msg = data.errors.map((x) => x.message).filter(Boolean).join(' ');
        }
      } catch {
        // Ignore JSON parse errors.
      }

      if (statusEl) {
        statusEl.classList.add('is-error');
        statusEl.textContent = msg;
      }
    } catch {
      if (statusEl) {
        statusEl.classList.add('is-error');
        statusEl.textContent = 'Network error — please check your connection and try again.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
      }
    }
  });
})();
