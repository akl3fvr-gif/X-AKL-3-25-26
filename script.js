const siswaData = [
  {nama:"Ahmad Fauzan R.", pass:"af001", user:"ahmad"},
  {nama:"Anisa Aulia P.", pass:"aa002", user:"anisa"},
  {nama:"Ariza Syifa A.", pass:"as003", user:"ariza"},
  {nama:"Arjanti Nathania A.S.", pass:"an004", user:"arjanti"},
  {nama:"Aurelia Batrisya U.S.", pass:"ab005", user:"aurelia"},
  {nama:"Azka Bachtiar F.", pass:"6761", user:"azka"},
  {nama:"Davina Nasyifa", pass:"dn007", user:"davina"},
  {nama:"Dinda Sahfira P.", pass:"ds008", user:"dinda"},
  {nama:"Elica Senta A.", pass:"es009", user:"elica"},
  {nama:"Fatih Algis S.", pass:"fa010", user:"fatih"},
  {nama:"Hafiza Azha S.", pass:"ha011", user:"hafiza"},
  {nama:"Herliana", pass:"he012", user:"herliana"},
  {nama:"Ivanesya Aztana", pass:"ia013", user:"ivanesya"},
  {nama:"Jelita Sulistya N.", pass:"js014", user:"jelita"},
  {nama:"Kartika Syalom E.H.", pass:"ks015", user:"kartika"},
  {nama:"Levy Widya S.", pass:"lw016", user:"levy"},
  {nama:"Mahardika Febriansyah", pass:"mf017", user:"mahardika"},
  {nama:"Melda", pass:"me018", user:"melda"},
  {nama:"Millah Oktapiyah", pass:"mo019", user:"millah"},
  {nama:"M. Gilang A.", pass:"mg020", user:"gilang"},
  {nama:"Nazzellah Nur R.", pass:"nn021", user:"nazzellah"},
  {nama:"Novia Ardani", pass:"na022", user:"novia"},
  {nama:"Putri Inaya A.", pass:"pi023", user:"putri"},
  {nama:"Risma Musliyah", pass:"rm024", user:"risma"},
  {nama:"Safa Salsabila", pass:"ss025", user:"safa"},
  {nama:"Santri Yuliani", pass:"sy026", user:"santri"},
  {nama:"Shafa Nur F.", pass:"sn027", user:"shafa"},
  {nama:"Shafira Rahmadani", pass:"sr028", user:"shafira"},
  {nama:"Silva Rahma A.", pass:"sa029", user:"silva"},
  {nama:"Suci Rahmadiani A.", pass:"sr030", user:"suci"},
  {nama:"Tiara Wijaya", pass:"tw031", user:"tiara"},
  {nama:"Trissa Oktaviani", pass:"to032", user:"trissa"},
  {nama:"Vania Wulan O.", pass:"vw033", user:"vania"},
  {nama:"Zaki Abdussadad", pass:"za034", user:"zaki"},
  {nama:"Zivilia Nuurfatma", pass:"zn035", user:"zivilia"}
];

let currentUser = null;
let posts = JSON.parse(localStorage.getItem('xakl3_posts')) || [];

// ===== NAVIGASI =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  if (id === 'home') renderPosts();
  if (id === 'profil') loadSiswa();
}

// ===== LOGIN =====
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  const user = siswaData.find(s => s.user === u);
  if (!user) return alert('Username tidak ada');
  if (u === 'azka' && p === 'Ambabas') currentUser = {role:'topadmin', ...user};
  else if (p === 'Ambabas') currentUser = {role:'adminmember', ...user};
  else if (user.pass === p) currentUser = {role:'member', ...user};
  else return alert('Password salah');
  localStorage.setItem('user', JSON.stringify(currentUser));
  updateUI(); showPage('home');
});
function loginAsGuest() {
  currentUser = {role:'guest'}; localStorage.setItem('user', JSON.stringify(currentUser));
  updateUI(); showPage('home');
}
function logout() {
  localStorage.removeItem('user'); currentUser = null; updateUI(); showPage('login');
}
function updateUI() {
  const user = JSON.parse(localStorage.getItem('user'));
  document.getElementById('nav-login').classList.toggle('hidden', user);
  document.getElementById('nav-logout').classList.toggle('hidden', !user);
  document.getElementById('post-form-container').classList.toggle('hidden', !user || user.role === 'guest');
}

// ===== POST =====
document.getElementById('post-form').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('post-id').value;
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;
  if (id) { // edit
    const p = posts.find(x => x.id === id);
    if (p && p.author === currentUser.user) { p.title = title; p.body = body; }
  } else { // baru
    posts.unshift({id:Date.now().toString(), author:currentUser.user, authorName:currentUser.nama, title, body, liked:[], comments:[], recommended:false, date:new Date().toLocaleString('id-ID')});
  }
  savePosts(); cancelEdit(); renderPosts();
});
function cancelEdit() {
  document.getElementById('post-id').value = '';
  document.getElementById('post-title').value = '';
  document.getElementById('post-body').value = '';
}
function savePosts() {
  localStorage.setItem('xakl3_posts', JSON.stringify(posts));
}
function renderPosts() {
  const container = document.getElementById('posts-list');
  container.innerHTML = '';
  const list = [...posts].sort((a, b) => (b.recommended || 0) - (a.recommended || 0));
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <div class="post-header">
        <div>
          <div class="post-title">${p.title} ${p.recommended ? '⭐' : ''}</div>
          <div class="post-meta">Oleh ${p.authorName} • ${p.date}</div>
        </div>
        ${currentUser && p.author === currentUser.user ? `
          <div>
            <button onclick="editPost('${p.id}')">Edit</button>
            <button onclick="deletePost('${p.id}')">Hapus</button>
          </div>` : ''}
      </div>
      <div class="post-body">${p.body}</div>
      <div class="post-actions">
        <button onclick="toggleLike('${p.id}')">👍 ${p.liked.length}</button>
        ${currentUser && currentUser.role !== 'guest' ? `<button onclick="commentPost('${p.id}')">Komentar</button>` : ''}
        ${currentUser && (currentUser.role === 'topadmin' || currentUser.role === 'adminmember') ? `<button onclick="toggleRecommend('${p.id}')">${p.recommended ? 'Batal Rekomendasi' : 'Rekomendasikan'}</button>` : ''}
      </div>
      <div class="comments" id="comments-${p.id}">${p.comments.map(c => `<div class="comment-item">${c.authorName}: ${c.text}</div>`).join('')}</div>
    `;
    container.appendChild(card);
  });
}
function editPost(id) {
  const p = posts.find(x => x.id === id);
  if (!p || p.author !== currentUser.user) return;
  document.getElementById('post-id').value = p.id;
  document.getElementById('post-title').value = p.title;
  document.getElementById('post-body').value = p.body;
  document.getElementById('post-form-container').scrollIntoView();
}
function deletePost(id) {
  if (!confirm('Hapus post?')) return;
  posts = posts.filter(x => x.id !== id);
  savePosts(); renderPosts();
}
function toggleLike(id) {
  if (!currentUser) return alert('Login dulu');
  const p = posts.find(x => x.id === id);
  const idx = p.liked.indexOf(currentUser.user);
  if (idx > -1) p.liked.splice(idx, 1); else p.liked.push(currentUser.user);
  savePosts(); renderPosts();
}
function commentPost(id) {
  const text = prompt('Komentar:');
  if (!text) return;
  const p = posts.find(x => x.id === id);
  p.comments.push({authorName: currentUser.nama, text});
  savePosts(); renderPosts();
}
function toggleRecommend(id) {
  const p = posts.find(x => x.id === id);
  p.recommended = !p.recommended;
  savePosts(); renderPosts();
}

// ===== SISWA =====
function loadSiswa() {
  const container = document.getElementById('siswa-list');
  container.innerHTML = '';
  siswaData.forEach(s => {
    const card = document.createElement('div');
    card.className = 'siswa-card';
    card.innerHTML = `
      <img src="${s.foto}" onerror="this.src='assets/default.jpg'" alt="Foto ${s.nama}"/>
      <p>${s.nama}</p>
    `;
    container.appendChild(card);
  });
}

// ===== INIT =====
window.onload = () => {
  updateUI();
  showPage('login');
};
