const siswa = [
  { nama: '"ISI-TEXT"', foto: 'assets/siswa1.jpg' },
  { nama: '"ISI-TEXT"', foto: 'assets/siswa2.jpg' },
  { nama: '"ISI-TEXT"', foto: 'assets/siswa3.jpg' },
  // ... tambahkan hingga 35
];

const galeri = [
  'assets/kegiatan1.jpg',
  'assets/kegiatan2.jpg',
  'assets/kegiatan3.jpg',
  // ... tambahkan foto kegiatan
];

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
}

function loadSiswa() {
  const container = document.getElementById('siswa-list');
  container.innerHTML = '';
  siswa.forEach(s => {
    const card = document.createElement('div');
    card.className = 'siswa-card';
    card.innerHTML = `
      <img src="${s.foto}" alt="Foto Siswa" onerror="this.src='assets/default.jpg'" />
      <p>${s.nama}</p>
    `;
    container.appendChild(card);
  });
}

function loadGaleri() {
  const container = document.getElementById('galeri-list');
  container.innerHTML = '';
  galeri.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'galeri-item';
    img.alt = 'Kegiatan';
    img.onerror = () => { img.src = 'assets/default.jpg'; };
    container.appendChild(img);
  });
}

// Reminder Admin Only
document.getElementById('reminder-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const mapel = document.getElementById('mapel').value;
  const deskripsi = document.getElementById('deskripsi').value;
  const list = document.getElementById('reminder-list');
  const li = document.createElement('li');
  li.textContent = `Ada tugas ${mapel}: ${deskripsi}`;
  list.appendChild(li);
  document.getElementById('reminder-form').reset();
});

// Init
window.onload = () => {
  loadSiswa();
  loadGaleri();
  showPage('profil');
};