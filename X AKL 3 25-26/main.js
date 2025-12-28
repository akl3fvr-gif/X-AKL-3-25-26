/********************************************************************
 *  WEBSITE KELAS AKUNTANSI – SINGLE PAGE APPLICATION (SPA)
 *  Fitur:
 *  - Router sendiri (tanpa lib)
 *  - Lazy-load gambar About Us (IntersectionObserver)
 *  - Filter pencarian nama di About Us
 *  - LocalStorage feedback
 *******************************************************************/
(() => {
  "use strict";

  /* ---------- DATA SISWA + GURU ---------- */
  const people = [
    {name:"Bapak Suryanto, S.Pd.",role:"Guru Akuntansi",img:"assets/img/teacher.jpg"},
    ...Array.from({length:35},(_,i)=>({
      name:`Siswa ${String(i+1).padStart(2,'0')}`,
      role:"Siswa",
      img:`assets/img/student_${String(i+1).padStart(2,'0')}.jpg`
    }))
  ];

  /* ---------- ROUTER ---------- */
  const navButtons = document.querySelectorAll(".nav-menu button");
  const app = document.getElementById("app");

  const routes = {
    home:    ()=>`<section class="page home-wrap active">
                    <h1>Selamat Datang di Kelas Akuntansi</h1>
                    <p>Explore halaman kami: daftar siswa, agenda kegiatan, berikan feedback, dan ikuti media sosial kami.</p>
                    <button class="cta-btn" onclick="router.go('about')">Lihat Anggota Kelas</button>
                  </section>`,

    about:   ()=>`<section class="page">
                    <div class="about-header">
                      <h2>About Us – Kelas Akuntansi</h2>
                      <div class="search-box">
                        <input id="searchInput" type="text" placeholder="Cari nama ..." />
                        <button onclick="about.filter()">Cari</button>
                      </div>
                    </div>
                    <div id="gallery" class="grid-gallery"></div>
                  </section>`,

    agenda:  ()=>`<section class="page">
                    <div class="agenda-wrap">
                      <h2>Agenda Kegiatan</h2>
                      <div class="timeline">
                        <div class="timeline-item">
                          <h4>Januari – Perkenalan Konsep Akuntansi</h4>
                          <p>Pemapasan dasar akuntansi, jurnal, dan pembukuan sederhana.</p>
                        </div>
                        <div class="timeline-item">
                          <h4>Februari – Studi Lapangan ke Perusahaan</h4>
                          <p>Kunjungan ke PT. Makmur Abadi untuk melihat praktik akuntansi.</p>
                        </div>
                        <div class="timeline-item">
                          <h4>Maret – Ujian Tengah Semester</h4>
                          <p>Evaluasi pengetahuan setengah semester dengan studi kasus.</p>
                        </div>
                        <div class="timeline-item">
                          <h4>April – Workshop Software Akuntansi</h4>
                          <p>Pelatihan penggunaan aplikasi Accurate & Zoho Books.</p>
                        </div>
                        <div class="timeline-item">
                          <h4>Mei – Proyek Akhir & Pentas Akuntansi</h4>
                          <p>Presentasi laporan keuangan fiktif + pentas kreatif bertema "Balance Sheet of Life".</p>
                        </div>
                      </div>
                    </div>
                  </section>`,

    feedback:()=>`<section class="page">
                    <div class="feedback-wrap">
                      <h2>Feedback untuk Kami</h2>
                      <form class="feedback-form" onsubmit="feedback.send(event)">
                        <textarea id="feedbackText" placeholder="Tulis saran / pesan ..." required></textarea>
                        <button type="submit">Kirim Feedback</button>
                      </form>
                      <div id="feedbackStatus"></div>
                    </div>
                  </section>`,

    follow:  ()=>`<section class="page">
                    <div class="follow-wrap">
                      <h2>Follow Us!</h2>
                      <p>Terhubung lewat media sosial untuk update kegiatan.</p>
                      <div class="social-icons">
                        <a href="https://instagram.com" target="_blank"><img src="assets/icon/instagram.svg" alt="IG"></a>
                        <a href="https://youtube.com" target="_blank"><img src="assets/icon/youtube.svg" alt="YT"></a>
                        <a href="https://tiktok.com" target="_blank"><img src="assets/icon/tiktok.svg" alt="TT"></a>
                      </div>
                    </div>
                  </section>`
  };

  const router = {
    go(page){
      history.pushState({page},null,"#"+page);
      router.resolve(page);
    },
    resolve(page){
      app.innerHTML = routes[page]();
      navButtons.forEach(b=>b.classList.toggle("active",b.dataset.page===page));
      if(page==="about") about.init();
    }
  };
  window.router = router; // supaya onclick html bisa akses

  /* ---------- ABOUT US – FILTER & LAZY LOAD ---------- */
  const about = {
    init(){
      about.render(people);
      about.observer = new IntersectionObserver(about.reveal,{threshold:.15});
      document.querySelectorAll(".card").forEach(c=>about.observer.observe(c));
      document.getElementById("searchInput").addEventListener("keyup",about.filter);
    },
    render(list){
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = list.map(p=>`
        <div class="card" data-name="${p.name.toLowerCase()}">
          <img loading="lazy" src="${p.img}" alt="${p.name}" />
          <div class="info">
            <div class="name">${p.name}</div>
            <div class="role">${p.role}</div>
          </div>
        </div>`).join("");
    },
    filter(){
      const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
      document.querySelectorAll(".card").forEach(c=>{
        const match = c.dataset.name.includes(keyword);
        c.style.display = match ? "" : "none";
      });
    },
    reveal(entries,observer){
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }
  };
  window.about = about;

  /* ---------- FEEDBACK – LOCALSTORAGE ---------- */
  const feedback = {
    send(e){
      e.preventDefault();
      const txt = document.getElementById("feedbackText").value.trim();
      if(!txt) return;
      const arr = JSON.parse(localStorage.getItem("feedbackAkuntansi")||"[]");
      arr.push({date:new Date().toISOString(),text:txt});
      localStorage.setItem("feedbackAkuntansi",JSON.stringify(arr));
      document.getElementById("feedbackStatus").textContent = "Terima kasih! Feedback tersimpan.";
      e.target.reset();
    }
  };
  window.feedback = feedback;

  /* ---------- TAHUN OTOMATIS ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- LOAD HALAMAN AWAL ---------- */
  window.addEventListener("popstate",e=>router.resolve(e.state?.page||"home"));
  router.resolve(location.hash.slice(1)||"home");
})();
