document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ExtensionLocalizationForm');
  if (!form) return;

  const disclosures = form.querySelectorAll('.disclosure');

  disclosures.forEach(disclosure => {
    const button = disclosure.querySelector('.disclosure__button');
    const list = disclosure.querySelector('.disclosure__list');
    const input = disclosure.querySelector('input[type="hidden"]');

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      disclosures.forEach(d => {
        d.querySelector('.disclosure__button').setAttribute('aria-expanded', 'false');
        d.querySelector('.disclosure__list').hidden = true;
      });

      button.setAttribute('aria-expanded', !isExpanded);
      list.hidden = isExpanded;
    });

    list.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        input.value = link.dataset.value;
        form.submit();
      });
    });
  });

  document.addEventListener('click', () => {
    disclosures.forEach(d => {
      d.querySelector('.disclosure__button').setAttribute('aria-expanded', 'false');
      d.querySelector('.disclosure__list').hidden = true;
    });
  });
});
