
document.getElementById('menu').addEventListener('click', () => {
  document.querySelector('.navigation').classList.toggle('show');
  const menuBtn = document.getElementById('menu');
  menuBtn.textContent = menuBtn.textContent === '☰' ? '✖' : '☰';
});

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;