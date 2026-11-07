/**
 * Contact form: validates the fields, then opens the visitor's email app with a
 * composed mailto: link. The site never sends or stores anything.
 * The composed URL is also written to `data-mailto` so tests can assert it.
 */
type Field = 'name' | 'email' | 'message';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function buildMailto(to: string, name: string, email: string, message: string): string {
  const subject = `Portfolio enquiry from ${name}`;
  const body = `${message}\n\n— ${name}\n${email}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function validate(values: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (values.name.length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL.test(values.email))
    errors.email = 'Please enter a valid email address, like name@example.com.';
  if (values.message.length < 10)
    errors.message = 'Please write a message of at least 10 characters.';
  return errors;
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const to = form.dataset.email ?? '';
  const summary = form.querySelector<HTMLElement>('[data-form-summary]');
  // Custom, accessible messages replace the browser's validation bubbles.
  form.noValidate = true;

  const control = (name: Field) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  const showErrors = (errors: Partial<Record<Field, string>>) => {
    (['name', 'email', 'message'] as const).forEach((name) => {
      const input = control(name);
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      const message = errors[name];
      input?.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (slot) {
        slot.textContent = message ?? '';
        slot.classList.toggle('hidden', !message);
      }
    });
    const count = Object.keys(errors).length;
    if (summary) {
      summary.textContent = count
        ? `Please fix ${count === 1 ? 'one field' : `${count} fields`} before opening your email app.`
        : '';
      summary.classList.toggle('hidden', count === 0);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = {
      name: control('name')?.value.trim() ?? '',
      email: control('email')?.value.trim() ?? '',
      message: control('message')?.value.trim() ?? '',
    };
    const errors = validate(values);
    showErrors(errors);
    const firstInvalid = (['name', 'email', 'message'] as const).find((f) => errors[f]);
    if (firstInvalid) {
      control(firstInvalid)?.focus();
      return;
    }
    const url = buildMailto(to, values.name, values.email, values.message);
    form.dataset.mailto = url;
    window.location.href = url;
  });
}
