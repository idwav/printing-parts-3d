document.querySelectorAll('.pp3d-tech__card').forEach((card) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      card.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(card);
});
