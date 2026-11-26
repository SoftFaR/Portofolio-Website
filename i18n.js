/* SoftSpace bilingual interface: English / Bahasa Indonesia. No API, framework or reload required. */
(() => {
  'use strict';

  const STORAGE_KEY = 'softspace-language';
  const DICT = {
    // Navigation, shared UI and metadata
    'SoftSpace — Muhamad Fadil': 'SoftSpace — Muhamad Fadil',
    'Lab — SoftSpace': 'Lab — SoftSpace',
    'INDEPENDENT DIGITAL STUDIO': 'STUDIO DIGITAL INDEPENDEN',
    'INDEPENDENT DIGITAL PRACTICE': 'PRAKTIK DIGITAL INDEPENDEN',
    'FOUNDED BY': 'DIDIRIKAN OLEH',
    'FIELD NOTE / 001': 'CATATAN LAPANGAN / 001',
    'FIELD NOTES / 001': 'CATATAN LAPANGAN / 001',
    'SIGNAL FIELD': 'MEDAN SINYAL',
    'WEB / INTERFACE / CREATIVE CODE': 'WEB / ANTARMUKA / KODE KREATIF',
    'Built for the web.': 'Dibangun untuk web.',
    'Driven by curiosity.': 'Digerakkan oleh rasa ingin tahu.',
    'A space for ideas to become experiences.': 'Ruang untuk ide menjadi pengalaman digital.',
    'A DIGITAL PRACTICE IN MOTION': 'PRAKTIK DIGITAL YANG TERUS BERGERAK',
    'FOUNDED BY MUHAMAD FADIL': 'DIDIRIKAN OLEH MUHAMAD FADIL',
    'BUILD': 'BANGUN', 'EXPLORE': 'JELAJAHI', 'REPEAT': 'ULANGI',
    'SOFTSPACE / DIGITAL STUDIO': 'SOFTSPACE / STUDIO DIGITAL',
    'ENTERING THE LAB': 'MEMASUKI LAB',
    'BACK TO THE STUDIO': 'KEMBALI KE STUDIO',
    'A SPACE FOR EXPERIMENTS, MOTION & CODE': 'RUANG UNTUK EKSPERIMEN, GERAK, & KODE',
    'IDEAS, INTERFACES & DIGITAL EXPERIENCES': 'IDE, ANTARMUKA, & PENGALAMAN DIGITAL',
    'Skip to content': 'Lewati ke konten',
    'Menu': 'Menu', 'Home': 'Beranda', 'Studio': 'Studio', 'Capabilities': 'Kapabilitas',
    'Services': 'Layanan', 'Work': 'Karya', 'Lab': 'Lab', 'Contact': 'Kontak',
    'Primary': 'Navigasi utama',
    'SoftSpace, back to top': 'SoftSpace, kembali ke atas',
    'SoftSpace, back to the portfolio': 'SoftSpace, kembali ke portofolio',
    'SoftSpace logo': 'Logo SoftSpace',
    'Fullscreen': 'Layar penuh', 'Exit': 'Keluar',
    'Toggle fullscreen for the workbench': 'Aktifkan atau keluar dari layar penuh workbench',
    'Live preview': 'Pratinjau langsung', 'Project': 'Proyek', 'Open in new tab': 'Buka di tab baru',
    'Loading live preview…': 'Memuat pratinjau langsung…',
    'Still loading. If nothing appears, open the site in a new tab.': 'Masih memuat. Jika tidak muncul, buka situs di tab baru.',
    'Close preview': 'Tutup pratinjau',

    // Home hero and studio
    'Independent digital practice': 'Praktik digital independen',
    'Bekasi — Jakarta · ID': 'Bekasi — Jakarta · ID',
    'An independent digital practice by': 'Praktik digital independen oleh',
    'Muhamad Fadil.': 'Muhamad Fadil.',
    'I build websites, design interfaces, and experiment with browser-based visuals and interactions.': 'Saya membangun situs web, merancang antarmuka, dan bereksperimen dengan visual serta interaksi berbasis browser.',
    'See selected work': 'Lihat karya pilihan',
    'Explore the Lab': 'Jelajahi Lab',
    'Web development': 'Pengembangan web',
    'Interface design': 'Desain antarmuka',
    'Creative code': 'Kode kreatif',
    'LIVE FIELD': 'MEDAN LANGSUNG',
    'MOVE TO DISTURB · CLICK TO RIPPLE': 'GERAKKAN POINTER · KLIK UNTUK MEMBUAT RIAK',
    'Scroll to explore': 'Gulir untuk menjelajah',
    'SOFTSPACE / BUILT IN THE BROWSER': 'SOFTSPACE / DIBANGUN DI DALAM BROWSER',
    'The Studio': 'Studio',
    'Digital work, built around curiosity.': 'Karya digital yang dibangun dari rasa ingin tahu.',
    'SoftSpace is an independent digital studio founded by Muhamad Fadil, exploring the space between web development, interface design and creative code.': 'SoftSpace adalah studio digital independen yang didirikan oleh Muhamad Fadil, mengeksplorasi irisan antara pengembangan web, desain antarmuka, dan kode kreatif.',
    'It brings practical website work and open-ended experiments into one practice. Each project is an opportunity to make something useful, understand a problem more clearly and discover a better way to shape the experience.': 'SoftSpace menyatukan pengerjaan situs web yang fungsional dengan eksperimen terbuka. Setiap proyek menjadi kesempatan untuk membuat sesuatu yang berguna, memahami masalah dengan lebih jelas, dan menemukan cara yang lebih baik dalam membentuk pengalaman.',
    'SoftSpace studio principles': 'Prinsip studio SoftSpace',
    '01 / STRUCTURE': '01 / STRUKTUR',
    'Clarity before decoration.': 'Kejelasan sebelum dekorasi.',
    'Start with the purpose, content and structure. Let the visual language support what the experience needs to do.': 'Mulai dari tujuan, konten, dan struktur. Biarkan bahasa visual mendukung fungsi yang perlu dicapai oleh pengalaman tersebut.',
    '02 / INTERACTION': '02 / INTERAKSI',
    'Motion with meaning.': 'Gerak yang punya makna.',
    'Animation should guide, respond or reveal something. It should never get in the way of using the website.': 'Animasi seharusnya memberi arahan, merespons, atau mengungkap sesuatu. Animasi tidak boleh mengganggu penggunaan situs.',
    '03 / CURIOSITY': '03 / RASA INGIN TAHU',
    'Keep exploring.': 'Terus bereksplorasi.',
    'Client-facing work and experimental builds belong side by side. Both are ways to learn by making.': 'Pengerjaan untuk klien dan eksperimen dapat berjalan berdampingan. Keduanya adalah cara untuk belajar dengan terus berkarya.',
    'MEET THE FOUNDER': 'KENALI PENDIRINYA',
    'The person behind SoftSpace': 'Sosok di balik SoftSpace',
    'One founder. A hands-on practice. Room to explore.': 'Satu pendiri. Praktik langsung. Ruang untuk bereksplorasi.',
    'SOFTSPACE / FOUNDER 001': 'SOFTSPACE / PENDIRI 001',
    'Founder · Developer': 'Pendiri · Developer',
    'FOUNDER': 'PENDIRI', 'DEVELOPER': 'DEVELOPER', 'CREATIVE CODER': 'CREATIVE CODER',
    'Hello, I\'m Muhamad Fadil.': 'Halo, saya Muhamad Fadil.',
    'I\'m the founder and developer behind SoftSpace. I enjoy building websites from the ground up and exploring how design, code, interaction and experimentation can come together.': 'Saya adalah pendiri sekaligus developer di balik SoftSpace. Saya senang membangun situs web dari awal dan mengeksplorasi bagaimana desain, kode, interaksi, serta eksperimen dapat berpadu.',
    'My work moves between frontend development, interface design and browser-based experiments. SoftSpace is where I put that curiosity into practice: building projects, refining ideas and documenting the process while continuing to learn.': 'Karya saya bergerak di antara pengembangan frontend, desain antarmuka, dan eksperimen berbasis browser. SoftSpace menjadi ruang untuk menerapkan rasa ingin tahu tersebut: membangun proyek, menyempurnakan ide, dan mendokumentasikan proses sambil terus belajar.',
    'CURRENT FOCUS': 'FOKUS SAAT INI',
    'GitHub profile': 'Profil GitHub', 'Explore my journey': 'Jelajahi perjalanan saya',
    'Founder Journey': 'Perjalanan Founder',
    'A documented learning curve.': 'Perjalanan belajar yang terdokumentasi.',
    'A record of what I actually shipped, in order. Dates come from public repository activity, not from estimates.': 'Catatan karya yang benar-benar saya publikasikan, disusun berdasarkan urutan. Tanggal mengacu pada aktivitas repositori publik, bukan perkiraan.',
    'Learning journey from 2023 to 2026': 'Perjalanan belajar dari 2023 hingga 2026',
    'Compiled from the public repositories I built while learning. The 2023 start is confirmed by me; no public repository from that year survives. Where GitHub shows only a single commit, the entry describes the work without inflating it.': 'Disusun dari repositori publik yang saya buat selama belajar. Awal perjalanan pada 2023 telah saya konfirmasi, tetapi tidak ada repositori publik dari tahun tersebut yang masih tersedia. Jika GitHub hanya menunjukkan satu commit, catatan ini menjelaskan pekerjaan tersebut tanpa melebih-lebihkannya.',
    'A growing technology practice.': 'Praktik teknologi yang terus berkembang.',
    'Select a technology for context': 'Pilih teknologi untuk melihat keterangannya',
    'Capabilities are a living practice, not a claim of mastery. The labels below distinguish tools used in projects from technologies currently being explored.': 'Kapabilitas terus berkembang, bukan klaim bahwa semuanya sudah dikuasai. Label berikut membedakan teknologi yang pernah digunakan dalam proyek dengan teknologi yang masih dieksplorasi.',
    'In practice': 'Sudah diterapkan', 'Practicing': 'Sedang dipelajari', 'Exploring': 'Sedang dieksplorasi',
    'Select a technology for context': 'Pilih teknologi untuk melihat konteksnya',

    // Skills dynamic content
    'Frontend Development': 'Pengembangan Frontend',
    'Backend Development': 'Pengembangan Backend',
    'Programming Languages': 'Bahasa Pemrograman',
    'Database & Data': 'Basis Data & Data',
    'Creative Coding': 'Creative Coding',
    'UI & Interface Design': 'Desain UI & Antarmuka',
    'Tools & Workflow': 'Tools & Alur Kerja',
    'Semantic structure, accessible markup and page architecture.': 'Struktur semantik, markup yang aksesibel, dan arsitektur halaman.',
    'Custom properties, layout systems, responsive styling and motion.': 'Custom properties, sistem layout, styling responsif, dan animasi.',
    'Vanilla JavaScript for interface behaviour, data rendering and browser APIs.': 'JavaScript murni untuk perilaku antarmuka, penayangan data, dan Browser API.',
    'A typed layer for making larger JavaScript projects easier to maintain.': 'Lapisan tipe agar proyek JavaScript berskala besar lebih mudah dirawat.',
    'Component-based UI development for interactive web interfaces.': 'Pengembangan UI berbasis komponen untuk antarmuka web interaktif.',
    'Utility-first styling as an alternative workflow to hand-written CSS.': 'Styling berbasis utility sebagai alternatif dari penulisan CSS secara manual.',
    'A component and grid toolkit for building consistent layouts.': 'Toolkit komponen dan grid untuk membangun layout yang konsisten.',
    'Timeline-based motion and scroll-triggered animation with ScrollTrigger.': 'Animasi berbasis timeline dan pemicu scroll menggunakan ScrollTrigger.',
    'Server-side scripting for dynamic web pages and form-driven projects.': 'Scripting sisi server untuk halaman web dinamis dan proyek berbasis formulir.',
    'A PHP framework for structured routing, application logic and server-rendered experiences.': 'Framework PHP untuk routing terstruktur, logika aplikasi, dan pengalaman yang dirender di server.',
    'JavaScript runtime for tooling and server-side development.': 'Runtime JavaScript untuk tooling dan pengembangan sisi server.',
    'A common interface pattern for exchanging data between services.': 'Pola antarmuka umum untuk pertukaran data antar layanan.',
    'Small tools, programming exercises and experiments outside the browser.': 'Tools sederhana, latihan pemrograman, dan eksperimen di luar browser.',
    'Programming fundamentals and Arduino-based hardware experiments.': 'Dasar-dasar pemrograman dan eksperimen perangkat keras berbasis Arduino.',
    'Query language used to read, organize and update relational data.': 'Bahasa kueri untuk membaca, mengatur, dan memperbarui data relasional.',
    'Relational database commonly paired with PHP and Laravel.': 'Basis data relasional yang umum digunakan bersama PHP dan Laravel.',
    'Relational database for structured application data.': 'Basis data relasional untuk data aplikasi yang terstruktur.',
    'Lightweight relational database suited to local and embedded projects.': 'Basis data relasional ringan untuk proyek lokal dan embedded.',
    'Document-oriented data storage for flexible records.': 'Penyimpanan data berorientasi dokumen untuk struktur data yang fleksibel.',
    'Pointer-driven simulation, particles and generative drawing without a framework.': 'Simulasi berbasis pointer, partikel, dan gambar generatif tanpa framework.',
    'Browser-generated sound using oscillators, scheduling and audio nodes.': 'Suara yang dihasilkan browser menggunakan osilator, penjadwalan, dan node audio.',
    'Scalable vector shapes for icons, diagrams and interface details.': 'Bentuk vektor yang dapat diskalakan untuk ikon, diagram, dan detail antarmuka.',
    'A JavaScript library for real-time 3D graphics in the browser.': 'Library JavaScript untuk grafis 3D real-time di browser.',
    'Low-level browser graphics API for accelerated visual experiments.': 'Browser Graphics API tingkat rendah untuk eksperimen visual yang dipercepat.',
    'Layout, hierarchy and spacing decided before implementation.': 'Layout, hierarki, dan jarak yang ditentukan sebelum implementasi.',
    'A deliberate type scale pairing expressive display type with readable body copy.': 'Skala tipografi yang memadukan teks display ekspresif dengan teks isi yang mudah dibaca.',
    'Interface exploration, wireframes and visual direction.': 'Eksplorasi antarmuka, wireframe, dan arahan visual.',
    'Keyboard navigation, semantic structure, contrast and reduced-motion support.': 'Navigasi keyboard, struktur semantik, kontras, dan dukungan reduced motion.',
    'Layouts that adapt to different viewport sizes and input methods.': 'Layout yang menyesuaikan berbagai ukuran viewport dan metode input.',
    'Version control for tracking project changes.': 'Version control untuk melacak perubahan proyek.',
    'Code hosting, collaboration and static-site deployment.': 'Hosting kode, kolaborasi, dan deployment situs statis.',
    'Daily editor for writing, testing and debugging code.': 'Editor harian untuk menulis, menguji, dan melakukan debugging kode.',
    'A fast development server and frontend build tool.': 'Development server dan build tool frontend yang cepat.',
    'Browser inspection, responsive testing and performance debugging.': 'Inspeksi browser, pengujian responsif, dan debugging performa.',
    'AI as an assistant for speed; every result is reviewed, tested and corrected by hand.': 'AI sebagai asisten untuk mempercepat pekerjaan; setiap hasil tetap ditinjau, diuji, dan diperbaiki secara manual.',
    'Experience': 'Pengalaman', 'Example: ': 'Contoh: ',
    'SoftSpace and Masjid Al-Qalam': 'SoftSpace dan Masjid Al-Qalam',
    'SoftSpace design system': 'Sistem desain SoftSpace',
    'SoftSpace and Arunika Perfume': 'SoftSpace dan Arunika Perfume',
    'Swarm Simulation in the Lab': 'Simulasi Kawanan di Lab',
    'Sound Grid in the Lab': 'Grid Suara di Lab',
    'SoftSpace profile': 'Profil SoftSpace',

    // Services, process and projects
    'From a clear brief to a considered build.': 'Dari brief yang jelas menjadi karya yang matang.',
    'What SoftSpace can help with': 'Hal yang dapat dikerjakan SoftSpace',
    'Focused digital services for people and small teams who need a considered web presence or a more expressive interface.': 'Layanan digital terarah bagi individu dan tim kecil yang membutuhkan kehadiran web yang matang atau antarmuka yang lebih ekspresif.',
    '01 / BUILD': '01 / MEMBANGUN', 'Website Development': 'Pengembangan Website',
    'Purpose-built websites that communicate clearly and work across screen sizes.': 'Website yang dirancang sesuai tujuan, menyampaikan informasi dengan jelas, dan bekerja di berbagai ukuran layar.',
    'Landing pages': 'Landing page', 'Company profile websites': 'Website profil perusahaan',
    'Personal portfolios': 'Portofolio personal', 'Product and service showcases': 'Etalase produk dan layanan',
    '02 / SHAPE': '02 / MERANCANG', 'Interface & UI Design': 'Desain UI & Antarmuka',
    'Visual systems and page structures that make information easier to understand.': 'Sistem visual dan struktur halaman yang membuat informasi lebih mudah dipahami.',
    'Website layout direction': 'Arahan layout website', 'Visual hierarchy and typography': 'Hierarki visual dan tipografi',
    'Responsive interface design': 'Desain antarmuka responsif', 'Design refinement': 'Penyempurnaan desain',
    '03 / EXPLORE': '03 / BEREKSPLORASI', 'Creative Web Experience': 'Pengalaman Web Kreatif',
    'Small interactive details that give a digital experience its own character.': 'Detail interaktif yang memberikan karakter tersendiri pada pengalaman digital.',
    'Canvas-based visuals': 'Visual berbasis Canvas', 'Purposeful motion and transitions': 'Animasi dan transisi yang terarah',
    'Interactive web components': 'Komponen web interaktif', 'Creative coding prototypes': 'Prototipe creative coding',
    'PROCESS': 'PROSES', 'Our approach': 'Pendekatan Kami',
    'A small process, with every step considered.': 'Proses sederhana dengan setiap langkah yang diperhitungkan.',
    'Discover': 'Temukan', 'Understand the goal, audience and real problem to solve.': 'Pahami tujuan, audiens, dan masalah nyata yang perlu diselesaikan.',
    'Shape': 'Bentuk', 'Set the structure, content direction and visual language.': 'Tentukan struktur, arah konten, dan bahasa visual.',
    'Build': 'Bangun', 'Develop the interface, interactions and responsive behaviour.': 'Kembangkan antarmuka, interaksi, dan perilaku responsif.',
    'Refine': 'Sempurnakan', 'Test, review and prepare the experience for launch.': 'Uji, tinjau, dan siapkan pengalaman untuk diluncurkan.',
    'Selected Work': 'Karya Pilihan',
    'Built with intent. Documented honestly.': 'Dibangun dengan tujuan. Didokumentasikan dengan jujur.',
    '05 selected projects': '05 proyek pilihan',
    'All': 'Semua', 'Portfolio': 'Portofolio', 'E-commerce': 'E-commerce', 'Website': 'Website',
    'In progress': 'Sedang dikerjakan', 'Demo build': 'Versi demo',
    '2024 · first public build': '2024 · karya publik pertama', '2025 · coursework': '2025 · tugas pembelajaran',
    'A personal portfolio and creative coding playground in plain HTML, CSS and JavaScript.': 'Portofolio personal dan ruang eksperimen creative coding yang dibangun dengan HTML, CSS, dan JavaScript murni.',
    'Built without a framework or build step. The hero uses a Canvas 2D signal field, section reveals use GSAP ScrollTrigger, and the Lab holds interactive browser experiments.': 'Dibangun tanpa framework atau proses build. Hero menggunakan medan sinyal Canvas 2D, reveal section memakai GSAP ScrollTrigger, dan Lab berisi eksperimen browser interaktif.',
    'Create a personal site that demonstrates both interface craft and working browser experiments.': 'Membuat situs personal yang menunjukkan keterampilan antarmuka sekaligus eksperimen browser yang berfungsi.',
    'Use semantic HTML, hand-written CSS, vanilla JavaScript, Canvas 2D and GSAP for purposeful motion.': 'Menggunakan HTML semantik, CSS yang ditulis langsung, JavaScript murni, Canvas 2D, dan GSAP untuk animasi yang terarah.',
    'A multi-section portfolio with a live signal field, project previews and an interactive Lab.': 'Portofolio multi-section dengan medan sinyal langsung, pratinjau proyek, dan Lab interaktif.',
    'Premium perfume reseller storefront with a brand showcase, filters, quick view and WhatsApp ordering.': 'Etalase reseller parfum premium dengan tampilan merek, filter, quick view, dan pemesanan melalui WhatsApp.',
    'Sells products from three brands: Mykonos, HMNS and SAFF. The repository is a demo; product data and the WhatsApp number are placeholders.': 'Menampilkan produk dari tiga merek: Mykonos, HMNS, dan SAFF. Repositori ini merupakan demo; data produk dan nomor WhatsApp masih berupa placeholder.',
    'Present a small perfume catalog in a way that makes browsing and product discovery straightforward.': 'Menyajikan katalog parfum sederhana agar penelusuran dan pencarian produk lebih mudah.',
    'Build a branded storefront with product categories, quick view and a WhatsApp ordering path.': 'Membangun etalase bermerek dengan kategori produk, quick view, dan jalur pemesanan melalui WhatsApp.',
    'A front-end demo. Product data and the WhatsApp destination remain placeholders, so it is not a live store.': 'Demo front-end. Data produk dan tujuan WhatsApp masih berupa placeholder sehingga belum menjadi toko aktif.',
    'A static HTML and CSS site built for BQ City in February 2024.': 'Situs statis HTML dan CSS yang dibuat untuk BQ City pada Februari 2024.',
    'The first public repository: seven commits in a single day, built end to end as a static site.': 'Repositori publik pertama: tujuh commit dalam satu hari, dibangun sepenuhnya sebagai situs statis.',
    'Create a simple web presence for a mosque and its community information.': 'Membuat kehadiran web sederhana untuk masjid dan informasi komunitasnya.',
    'Build a static page structure with HTML and CSS, keeping the implementation direct and lightweight.': 'Membangun struktur halaman statis dengan HTML dan CSS agar implementasinya langsung dan ringan.',
    'A published static website and the earliest verified public repository in the journey.': 'Website statis yang dipublikasikan dan repositori publik terawal yang terverifikasi dalam perjalanan ini.',
    'A car catalog website built as a coursework brief in September 2025.': 'Website katalog mobil yang dibuat sebagai tugas pembelajaran pada September 2025.',
    'Coursework brief: build a car catalog website. Kept as a record of the 2025 practice phase.': 'Tugas pembelajaran: membangun website katalog mobil. Disimpan sebagai catatan fase latihan tahun 2025.',
    'Organize vehicle information in a format that is easy to scan.': 'Menyusun informasi kendaraan dalam format yang mudah dipindai.',
    'Use a straightforward HTML and CSS layout to present vehicle cards and catalog content.': 'Menggunakan layout HTML dan CSS sederhana untuk menampilkan kartu kendaraan dan konten katalog.',
    'A coursework project that records practice with structured content and page layout.': 'Proyek pembelajaran yang mencatat latihan dalam menyusun konten dan layout halaman.',
    'A prayer-schedule page built with HTML, CSS and JavaScript in November 2025.': 'Halaman jadwal salat yang dibuat dengan HTML, CSS, dan JavaScript pada November 2025.',
    'Repository description: “Website Jadwal Solat”. A small utility page built around prayer times.': 'Deskripsi repositori: “Website Jadwal Solat”. Halaman utilitas sederhana yang berfokus pada jadwal salat.',
    'Make daily prayer-time information easy to find in a focused page.': 'Membuat informasi waktu salat harian mudah ditemukan dalam satu halaman terarah.',
    'Combine HTML, CSS and JavaScript into a small browser-based utility.': 'Menggabungkan HTML, CSS, dan JavaScript menjadi utilitas kecil berbasis browser.',
    'A published practice project. It is presented as a small utility build rather than a production service.': 'Proyek latihan yang telah dipublikasikan. Proyek ini disajikan sebagai utilitas sederhana, bukan layanan produksi.',
    'Challenge': 'Tantangan', 'Approach': 'Pendekatan', 'Outcome': 'Hasil',
    'Preview': 'Pratinjau', 'Live site': 'Situs aktif', 'Source': 'Kode sumber',
    'Details': 'Detail', 'Hide details': 'Sembunyikan detail',
    ' (opens in a new tab)': ' (terbuka di tab baru)',

    // Journey generated content
    'Owner-confirmed': 'Dikonfirmasi pemilik',
    'Learning the foundations': 'Mempelajari dasar-dasar',
    'Started with HTML and CSS, then JavaScript. No public repository from this year exists, so this entry records the start without attaching a project to it.': 'Memulai dengan HTML dan CSS, lalu JavaScript. Tidak ada repositori publik dari tahun ini, jadi catatan ini hanya menandai awal perjalanan tanpa mengaitkannya dengan proyek tertentu.',
    '2023 · no public artifact · start date confirmed by Muhamad Fadil': '2023 · tidak ada karya publik · tanggal mulai dikonfirmasi oleh Muhamad Fadil',
    'Feb 2024 · First public repository': 'Feb 2024 · Repositori publik pertama',
    'Published the first public build: an HTML and CSS site for BQ City, committed end to end in one day. It is the earliest verified public build.': 'Mempublikasikan karya pertama: situs HTML dan CSS untuk BQ City, dikerjakan dari awal hingga akhir dalam satu hari. Ini merupakan karya publik terawal yang terverifikasi.',
    '7 commits · HTML, CSS': '7 commit · HTML, CSS',
    'Feb — Aug 2025 · Practice': 'Feb — Agu 2025 · Latihan',
    'Deliberate exercises': 'Latihan terarah',
    'Small builds to isolate fundamentals: HTML basics, a personal profile card and responsive card layouts. Alongside them, Arduino experiments in C++ with LEDs, an LCD and an ultrasonic sensor.': 'Proyek kecil untuk memperkuat dasar: HTML, kartu profil personal, dan layout kartu responsif. Di saat yang sama, bereksperimen dengan Arduino menggunakan C++, LED, LCD, dan sensor ultrasonik.',
    'Practice repositories · HTML, CSS, C++': 'Repositori latihan · HTML, CSS, C++',
    'Aug — Dec 2025 · Project work': 'Agu — Des 2025 · Pengerjaan proyek',
    'Catalogs and a prayer schedule': 'Katalog dan jadwal salat',
    'Moved from exercises to small applications: a product catalog with JavaScript, a car catalog, and Jadwal-Solat, a prayer-time page built with HTML, CSS and JavaScript.': 'Beralih dari latihan ke aplikasi kecil: katalog produk dengan JavaScript, katalog mobil, dan Jadwal-Solat, halaman waktu salat yang dibangun dengan HTML, CSS, dan JavaScript.',
    '3 repositories · HTML, CSS, JavaScript': '3 repositori · HTML, CSS, JavaScript',
    'Apr — Jun 2026 · Portfolio and camp': 'Apr — Jun 2026 · Portofolio dan camp',
    'A portfolio and a coding camp': 'Portofolio dan coding camp',
    'Built a personal portfolio over 23 commits, made kicau-cing, and completed a RevoU Coding Camp mini project in JavaScript, CSS and HTML.': 'Membangun portofolio personal melalui 23 commit, membuat kicau-cing, dan menyelesaikan mini project RevoU Coding Camp menggunakan JavaScript, CSS, dan HTML.',
    '23 commits on My-Portfolio · 3 commits on the camp project': '23 commit pada My-Portfolio · 3 commit pada proyek camp',
    'Oct — Nov 2026 · Design and competition': 'Okt — Nov 2026 · Desain dan kompetisi',
    'Interface and competition work': 'Pengerjaan antarmuka dan kompetisi',
    'Worked on wireframes, the Wellora site, NusaProperty, a Sertikom competition prototype and an Arunika Perfume demo storefront.': 'Mengerjakan wireframe, situs Wellora, NusaProperty, prototipe kompetisi Sertikom, dan etalase demo Arunika Perfume.',
    '5 repositories · HTML, CSS, JavaScript': '5 repositori · HTML, CSS, JavaScript',
    'Nov 2026 · Current': 'Nov 2026 · Saat ini',
    'SoftSpace V2': 'SoftSpace V2',
    'Rebuilding this portfolio as SoftSpace with GSAP ScrollTrigger, a Canvas signal field and a browser-audio Lab. This is the work in progress you are looking at.': 'Membangun ulang portofolio ini sebagai SoftSpace dengan GSAP ScrollTrigger, medan sinyal Canvas, dan Lab audio berbasis browser. Inilah proyek yang sedang kamu lihat.',
    'Current build · HTML, CSS, JavaScript, GSAP': 'Versi saat ini · HTML, CSS, JavaScript, GSAP',

    // Contact and FAQ
    'Have a project in mind?': 'Punya proyek dalam pikiran?',
    'Tell me what you are trying to make, what is not working yet, or where you need a second perspective. Start with a brief — we can shape the details together.': 'Ceritakan apa yang ingin kamu buat, bagian yang belum berjalan, atau hal yang membutuhkan sudut pandang lain. Mulai dari brief singkat — kita bisa menyusun detailnya bersama.',
    'Topic (optional)': 'Topik (opsional)', 'Project type': 'Jenis proyek',
    'Not sure yet': 'Belum yakin', 'Website development': 'Pengembangan website',
    'Creative web experience': 'Pengalaman web kreatif', 'Collaboration': 'Kolaborasi',
    'Budget range (optional)': 'Kisaran anggaran (opsional)', 'Not decided': 'Belum ditentukan',
    'Under Rp1.000.000': 'Di bawah Rp1.000.000', 'Above Rp5.000.000': 'Di atas Rp5.000.000',
    'Preferred timeline (optional)': 'Target waktu (opsional)',
    'e.g. December 2026 or flexible': 'mis. Desember 2026 atau fleksibel',
    'Name': 'Nama', 'Email': 'Email', 'Message': 'Pesan', 'Leave empty': 'Biarkan kosong',
    'Send message': 'Kirim pesan', 'Sending...': 'Mengirim...',
    'Enter your name.': 'Masukkan nama kamu.',
    'Enter a valid email address, like name@example.com.': 'Masukkan alamat email yang valid, misalnya nama@example.com.',
    'Write at least 10 characters so I know how to help.': 'Tulis minimal 10 karakter agar saya tahu bagaimana membantu.',
    'Your message was kept. Clear it to use a starter.': 'Pesan kamu tetap disimpan. Hapus isinya untuk menggunakan contoh pesan.',
    'Fix the marked fields and send again.': 'Perbaiki kolom yang ditandai, lalu kirim kembali.',
    'Sending your message...': 'Pesan sedang dikirim...',
    'Message sent. Thanks for reaching out.': 'Pesan terkirim. Terima kasih sudah menghubungi.',
    'The message was not sent. Check your connection and try again. Your text is still in the form.': 'Pesan belum terkirim. Periksa koneksi dan coba lagi. Teks kamu masih tersimpan di formulir.',
    'FAQ': 'FAQ', 'Before we begin': 'Sebelum memulai',
    'A few useful things to know.': 'Beberapa hal yang perlu diketahui.',
    'A starting point for common project questions. Specific scope, timing and availability are discussed after the brief.': 'Jawaban awal untuk pertanyaan umum seputar proyek. Ruang lingkup, waktu, dan ketersediaan akan dibahas setelah brief diterima.',
    'What kind of websites can SoftSpace build?': 'Jenis website apa yang dapat dibuat SoftSpace?',
    'Current focus includes landing pages, company profile websites, personal portfolios and product or service showcases. Scope is agreed before work begins.': 'Fokus saat ini mencakup landing page, website profil perusahaan, portofolio personal, serta etalase produk atau layanan. Ruang lingkup disepakati sebelum pengerjaan dimulai.',
    'Can the design follow an existing brand?': 'Apakah desain dapat mengikuti brand yang sudah ada?',
    'Yes. Existing logos, colors and brand direction can be used as the starting point. The interface is then shaped around the content and goals.': 'Bisa. Logo, warna, dan arahan brand yang sudah ada dapat menjadi titik awal. Antarmuka kemudian disusun berdasarkan konten dan tujuan.',
    'How does a project usually start?': 'Bagaimana sebuah proyek biasanya dimulai?',
    'Send a short brief using the inquiry form. We can clarify the audience, pages, features, references and priorities before defining the scope.': 'Kirim brief singkat melalui formulir pertanyaan proyek. Kita dapat memperjelas audiens, halaman, fitur, referensi, dan prioritas sebelum menentukan ruang lingkup.',
    'Can I request revisions?': 'Apakah saya bisa meminta revisi?',
    'Revision rounds and what they cover are agreed in the project scope before development begins.': 'Jumlah putaran revisi dan cakupannya disepakati dalam ruang lingkup proyek sebelum pengembangan dimulai.',
    'Do you provide maintenance after launch?': 'Apakah tersedia maintenance setelah website diluncurkan?',
    'Maintenance and follow-up support can be discussed separately depending on the project, hosting setup and update needs.': 'Maintenance dan dukungan lanjutan dapat dibahas secara terpisah sesuai proyek, pengaturan hosting, dan kebutuhan pembaruan.',
    'Independent digital studio by Muhamad Fadil · Design, development & experiments': 'Studio digital independen oleh Muhamad Fadil · Desain, pengembangan, dan eksperimen',
    'Independent digital studio by Muhamad Fadil · Creative coding playground': 'Studio digital independen oleh Muhamad Fadil · Ruang eksperimen creative coding',
    'Suggest an experiment': 'Usulkan eksperimen',

    // Lab page and workbench
    'Back to portfolio': 'Kembali ke portofolio',
    'SoftSpace Lab': 'SoftSpace Lab',
    'Creative Lab': 'Lab Kreatif',
    'A playground for': 'Ruang untuk',
    'motion, sound & code.': 'gerak, suara, & kode.',
    'Enter the Lab': 'Masuk ke Lab',
    'Canvas 2D · Physics': 'Canvas 2D · Fisika',
    'Lab /': 'Lab /',
    'Boids follow three rules — separation, alignment and cohesion. The pointer adds attraction; clicks send a ripple through the flock.': 'Boids mengikuti tiga aturan — pemisahan, penyelarasan, dan kohesi. Pointer menambahkan gaya tarik; klik mengirim riak ke seluruh kawanan.',
    'Experiments in motion, sound & code.': 'Eksperimen dalam gerak, suara, dan kode.',
    'A working playground for testing ideas through motion, physics, sound and visual systems. Shape the fields, add sources, move the type and tune the palette — every experiment runs directly in the browser.': 'Ruang eksperimen untuk menguji ide melalui gerak, fisika, suara, dan sistem visual. Bentuk medan, tambahkan sumber gelombang, gerakkan tipografi, dan atur palet warna — setiap eksperimen berjalan langsung di browser.',
    '10 experiments': '10 eksperimen', 'Canvas 2D': 'Canvas 2D', 'Creative coding': 'Creative coding',
    'Web Audio API': 'Web Audio API', 'Sandboxed iframe': 'Iframe terisolasi', 'Pointer interactive': 'Interaktif dengan pointer',
    'Select experiment': 'Pilih eksperimen', 'Everything runs locally.': 'Semua berjalan secara lokal.',
    'No network calls from the experiments.': 'Eksperimen tidak melakukan panggilan jaringan.',
    'Select experiment': 'Pilih eksperimen', 'Lab experiments': 'Eksperimen Lab',
    'Swarm Simulation': 'Simulasi Kawanan', 'Sound Grid': 'Grid Suara', 'Code Playground': 'Arena Kode',
    'Gravity Playground': 'Arena Gravitasi', 'Generative Art': 'Seni Generatif',
    'Wave Interference': 'Interferensi Gelombang', 'Digital Terrain': 'Bentang Digital',
    'Type in Motion': 'Tipografi Bergerak', 'Color Laboratory': 'Laboratorium Warna', 'Sound Visualizer': 'Visualisator Suara',
    'Canvas 2D · Boids': 'Canvas 2D · Boids', 'Web Audio · Sequencer': 'Web Audio · Sequencer',
    'HTML · CSS sandbox': 'Sandbox HTML · CSS', 'Canvas · Physics': 'Canvas · Fisika',
    'Procedural drawing': 'Gambar prosedural', 'Canvas · Oscillation': 'Canvas · Osilasi',
    'Procedural landscape': 'Lanskap prosedural', 'Canvas · Typography': 'Canvas · Tipografi',
    'Color systems': 'Sistem warna', 'Web Audio · Canvas': 'Web Audio · Canvas',
    'Lab / ': 'Lab / ', 'Running': 'Berjalan', 'Paused': 'Dijeda', 'Pause': 'Jeda', 'Play': 'Putar',
    'Move / drag to attract': 'Gerakkan / seret untuk menarik', 'Click to ripple': 'Klik untuk membuat riak',
    '90 boids': '90 partikel', 'C5': 'C5', 'A4': 'A4', 'G4': 'G4', 'E4': 'E4',
    'Markup': 'Markup', 'Styles': 'Gaya', 'Ready': 'Siap',
    'Move to pull · click to place a gravity well · right-click to remove': 'Gerakkan untuk menarik · klik untuk menempatkan pusat gravitasi · klik kanan untuk menghapus',
    'Physics / 2D': 'Fisika / 2D', '80 bodies': '80 objek',
    'Move to bend the field · click to reseed the composition': 'Gerakkan untuk membelokkan medan · klik untuk membuat komposisi baru',
    'Generative / 01': 'Generatif / 01', 'Flow field': 'Medan aliran',
    'Click anywhere to add a wave source · clear to start over': 'Klik di mana saja untuk menambah sumber gelombang · hapus untuk memulai ulang',
    'Wave system': 'Sistem gelombang', 'Live interference': 'Interferensi langsung',
    'Move to shift the depth · click to regenerate the landscape': 'Gerakkan untuk menggeser kedalaman · klik untuk membuat ulang lanskap',
    'Terrain / 2D': 'Bentang / 2D', '4 layers': '4 lapisan',
    'Move to displace the glyphs · click to change the phrase': 'Gerakkan untuk menggeser karakter · klik untuk mengganti frasa',
    'Type / Motion': 'Tipografi / Gerak', 'Variable position': 'Posisi variabel',
    'Move to tune the palette · click a swatch to copy its HEX': 'Gerakkan untuk mengatur palet · klik swatch untuk menyalin kode HEX',
    'Color / HSL': 'Warna / HSL', 'Hue 210°': 'Corak 210°',
    'Switch visual modes · start audio to connect a live signal': 'Ganti mode visual · mulai audio untuk menghubungkan sinyal langsung',
    'Audio off': 'Audio mati', 'Presets': 'Preset', 'Calm': 'Tenang', 'Dense': 'Padat', 'Dynamic': 'Dinamis',
    'Count': 'Jumlah', 'Speed': 'Kecepatan', 'Reset': 'Atur ulang', 'Start': 'Mulai', 'Clear': 'Hapus',
    'Step': 'Langkah', 'Tempo': 'Tempo', 'Volume': 'Volume', 'Rhythm': 'Ritme',
    'Pulse': 'Denyut', 'Arp': 'Arpeggio', 'Sparse': 'Jarang',
    'Audio is off. Press Start or toggle a cell to enable sound.': 'Audio mati. Tekan Mulai atau aktifkan salah satu sel untuk menyalakan suara.',
    'Reset code': 'Atur ulang kode', 'Fullscreen preview': 'Pratinjau layar penuh',
    'Sandbox': 'Sandbox', 'scripts off': 'skrip nonaktif', 'Debounce': 'Debounce',
    'The preview is a sandboxed iframe. Scripts are disabled; only HTML and CSS are rendered.': 'Pratinjau menggunakan iframe terisolasi. Skrip dinonaktifkan; hanya HTML dan CSS yang ditampilkan.',
    'Reset field': 'Atur ulang medan', 'Trails: On': 'Jejak: Aktif', 'Trails: Off': 'Jejak: Nonaktif',
    'Gravity': 'Gravitasi', 'A live particle field with movable attractors. Click to place up to five gravity wells; right-click to remove the most recent. Adjust gravity and toggle trails to change the motion.': 'Medan partikel langsung dengan titik penarik yang dapat dipindahkan. Klik untuk menempatkan hingga lima pusat gravitasi; klik kanan untuk menghapus yang terakhir. Atur gravitasi dan jejak untuk mengubah gerakan.',
    'New seed': 'Seed baru', 'Mode': 'Mode', 'Flow': 'Aliran', 'Orbit': 'Orbit', 'Bloom': 'Mekar',
    'Switch between three procedural compositions. The pointer bends the field; a click creates a new seed.': 'Beralih di antara tiga komposisi prosedural. Pointer membelokkan medan; klik untuk membuat seed baru.',
    'Restore sources': 'Pulihkan sumber', 'Clear sources': 'Hapus sumber',
    'Each click adds a new point source. Overlapping circular waves create bright and dark interference bands; clear the field to compose your own system.': 'Setiap klik menambahkan sumber titik baru. Gelombang melingkar yang saling bertumpuk menciptakan pola interferensi terang dan gelap; hapus medan untuk menyusun sistem sendiri.',
    'Regenerate terrain': 'Buat ulang bentang',
    'A layered synthetic landscape with a moving sky, atmospheric sun and four depth planes. Pointer movement shifts the ridgelines at different rates.': 'Lanskap sintetis berlapis dengan langit bergerak, matahari atmosferik, dan empat bidang kedalaman. Gerakan pointer menggeser garis pegunungan dengan kecepatan berbeda.',
    'Reset type': 'Atur ulang tipografi', 'Next phrase': 'Frasa berikutnya',
    'Each glyph responds independently to a nearby pointer field. Click the stage or cycle through four phrases to change the composition.': 'Setiap karakter merespons secara mandiri terhadap pointer di sekitarnya. Klik area eksperimen atau telusuri empat frasa untuk mengubah komposisi.',
    'Reset palette': 'Atur ulang palet', 'Surprise me': 'Beri kejutan', 'Copy selected HEX': 'Salin HEX terpilih',
    'Move horizontally to tune hue and vertically to tune saturation. Select any swatch to copy its HEX value.': 'Gerakkan secara horizontal untuk mengatur corak dan vertikal untuk mengatur saturasi. Pilih swatch apa pun untuk menyalin nilai HEX-nya.',
    'Mode: Radial': 'Mode: Radial', 'Mode: Waveform': 'Mode: Waveform', 'Start audio': 'Mulai audio', 'Stop audio': 'Hentikan audio',
    'Audio is off. The synthetic signal is always visible; start audio to connect a generated tone and tune it with pointer movement.': 'Audio mati. Sinyal sintetis selalu terlihat; mulai audio untuk menghubungkan nada buatan dan mengaturnya dengan gerakan pointer.',
    'Boids follow separation, alignment and cohesion. The pointer adds a fourth force; clicks ripple through the flock.': 'Boids mengikuti tiga aturan: pemisahan, penyelarasan, dan kohesi. Pointer menambahkan gaya keempat; klik mengirim riak ke seluruh kawanan.',
    'Engine': 'Mesin', 'State': 'Status', 'SoftSpace Lab · 2026': 'SoftSpace Lab · 2026',
    'Vanilla JavaScript · Canvas 2D · Web Audio API · GSAP': 'JavaScript murni · Canvas 2D · Web Audio API · GSAP',
    'Suggest an experiment': 'Usulkan eksperimen',
    'Swarm Simulation. Boids flock together; move or drag over the canvas to attract them, and click to send a ripple.': 'Simulasi kawanan. Boids bergerak bersama; gerakkan atau seret pointer di atas kanvas untuk menariknya, lalu klik untuk mengirim riak.',
    'Step sequencer, four notes by eight steps': 'Sequencer langkah, empat nada dengan delapan langkah',
    'Live preview of the HTML and CSS you write. Scripts are disabled.': 'Pratinjau langsung HTML dan CSS yang kamu tulis. Skrip dinonaktifkan.',
    'Particles falling and responding to pointer forces': 'Partikel jatuh dan merespons gaya pointer',
    'Procedurally generated flowing line artwork': 'Karya garis mengalir yang dibuat secara prosedural',
    'Animated wave interference patterns': 'Pola interferensi gelombang bergerak',
    'Layered procedural digital terrain landscape': 'Lanskap bentang digital prosedural berlapis',
    'Large responsive typography moving around the pointer': 'Tipografi responsif besar yang bergerak mengikuti pointer',
    'Interactive color palette laboratory responding to pointer position': 'Laboratorium palet warna interaktif yang merespons posisi pointer',
    'Animated sound waveform visualizer, with optional generated tone': 'Visualisator gelombang suara bergerak dengan nada sintetis opsional',

    // Lab runtime statuses and controls
    'Audio is on. Press Start to play the loop.': 'Audio aktif. Tekan Mulai untuk memutar pola.',
    'Web Audio is not supported in this browser.': 'Web Audio tidak didukung di browser ini.',
    'Playing at': 'Berjalan pada',
    'Stopped.': 'Dihentikan.', 'Pattern cleared.': 'Pola dihapus.',
    'Pattern cleared while playing.': 'Pola dihapus saat sedang diputar.',
    'Press Start to play.': 'Tekan Mulai untuk memutar.',
    'Audio is off. Press Start or toggle a cell to enable sound.': 'Audio mati. Tekan Mulai atau aktifkan salah satu sel untuk menyalakan suara.',
    'Scripts off': 'Skrip nonaktif', 'Starter code restored. The preview updated immediately.': 'Kode awal dipulihkan. Pratinjau langsung diperbarui.',
    'Fullscreen preview could not start in this browser.': 'Pratinjau layar penuh tidak dapat dijalankan di browser ini.',
    'Fullscreen is not supported in this browser.': 'Layar penuh tidak didukung di browser ini.',
    'Fullscreen could not start in this browser.': 'Mode layar penuh tidak dapat dimulai di browser ini.',
    'Exit preview': 'Keluar dari pratinjau',
    'A quiet generated tone is connected. Move the pointer horizontally to tune it.': 'Nada sintetis dengan volume rendah telah terhubung. Gerakkan pointer secara horizontal untuk mengaturnya.',
    'Audio could not start. Check browser audio permissions.': 'Audio tidak dapat dimulai. Periksa izin audio browser.',
    'Audio could not start.': 'Audio tidak dapat dimulai.',
    'Select a swatch to read its value': 'Pilih swatch untuk melihat nilainya',
    'Color copied': 'Warna disalin', 'New phrase': 'Frasa baru', 'New palette': 'Palet baru',
    'Reset': 'Atur ulang', 'Reset field': 'Atur ulang medan',
    'Audio live': 'Audio aktif', 'Synthetic signal': 'Sinyal sintetis', 'Live preview': 'Pratinjau langsung',
    'COMPOSITION /': 'KOMPOSISI /', 'FIELD / GRAVITY · CLICK TO ADD A WELL': 'MEDAN / GRAVITASI · KLIK UNTUK MENAMBAH PUSAT',
    'INTERFERENCE FIELD / CLICK TO ADD A SOURCE': 'MEDAN INTERFERENSI / KLIK UNTUK MENAMBAH SUMBER',
    'SYNTHETIC LANDSCAPE / MOVE TO SHIFT THE RIDGES': 'BENTANG SINTETIS / GERAKKAN UNTUK MENGGESER PEGUNUNGAN',
    'MOVE TO DISPLACE · CLICK TO CHANGE THE WORD': 'GERAKKAN UNTUK MENGGESER · KLIK UNTUK MENGGANTI KATA',
    'MOVE TO TUNE · CLICK A SWATCH TO SELECT / COPY': 'GERAKKAN UNTUK MENGATUR · KLIK SWATCH UNTUK MEMILIH / MENYALIN',
    'SIGNAL LIVE': 'SINYAL AKTIF', 'SIGNAL / IDLE': 'SINYAL / SIAGA',
    'RADIAL MODE': 'MODE RADIAL', 'WEB AUDIO / FREQUENCY DATA': 'WEB AUDIO / DATA FREKUENSI',
    'SYNTHETIC SIGNAL / AUDIO NOT CONNECTED': 'SINYAL SINTETIS / AUDIO BELUM TERHUBUNG',
    'No active wave sources': 'Tidak ada sumber gelombang aktif',
    'CLICK ANYWHERE TO ADD A SOURCE': 'KLIK DI MANA SAJA UNTUK MENAMBAH SUMBER',
    'No sources · click to add': 'Belum ada sumber · klik untuk menambahkan',
    '4 depth layers · live': '4 lapisan kedalaman · aktif',
    'phrase': 'frasa', 'paths': 'jalur', 'bodies': 'objek', 'wells': 'pusat gravitasi',
    'wave sources': 'sumber gelombang', 'active source': 'sumber aktif', 'active sources': 'sumber aktif',
    'copied': 'disalin', 'composition': 'komposisi',
    "Hi Fadil, I'd like to build a website. Here's what I need:\n\n": "Halo Fadil, saya ingin membuat website. Berikut kebutuhan saya:\n\n",
    "Hi Fadil, I'd like to discuss a web app. Here's what it should do:\n\n": "Halo Fadil, saya ingin mendiskusikan web app. Berikut fungsi yang saya butuhkan:\n\n",
    "Hi Fadil, I need help with UI design. Here's the project:\n\n": "Halo Fadil, saya membutuhkan bantuan desain UI. Berikut proyeknya:\n\n",
    "Hi Fadil, just saying hi! ": "Halo Fadil, sekadar menyapa! ",
    'Resume': 'Lanjutkan',
    'Still loading. If nothing appears, open the site in a new tab.': 'Masih memuat. Jika tidak muncul, buka situs di tab baru.',
    'Not sure yet': 'Belum yakin',
    'E-commerce': 'E-commerce',
    'A space for experiments, motion & code.': 'Ruang untuk eksperimen, gerak, dan kode.',
    'Move to explore': 'Gerakkan pointer untuk menjelajah',
    'No active wave sources': 'Tidak ada sumber gelombang aktif',
    'No sources · click to add': 'Belum ada sumber · klik untuk menambahkan',
    '4 depth layers · live': '4 lapisan kedalaman · aktif',
    'Audio could not start. Check browser audio permissions.': 'Audio tidak dapat dimulai. Periksa izin audio browser.',
    'Sound is off. Press Start or toggle a cell to enable sound.': 'Suara mati. Tekan Mulai atau aktifkan salah satu sel untuk menyalakan suara.',
  };

  const reverse = new Map();
  Object.entries(DICT).forEach(([english, indonesian]) => {
    if (!reverse.has(indonesian)) reverse.set(indonesian, english);
  });

  const normalizeBase = (value) => reverse.get(value) || value;
  const translateText = (value) => {
    const base = normalizeBase(String(value));
    return currentLanguage === 'id' ? (DICT[base] || translatePattern(base)) : base;
  };

  function translatePattern(value) {
    let match;
    if ((match = value.match(/^(\d+) boids$/i))) return `${match[1]} partikel`;
    if ((match = value.match(/^(\d+) bodies$/i))) return `${match[1]} objek`;
    if ((match = value.match(/^(\d+) paths$/i))) return `${match[1]} jalur`;
    if ((match = value.match(/^(\d+) active sources?$/i))) return `${match[1]} sumber aktif`;
    if ((match = value.match(/^Step (.+) \/ 08$/i))) return `Langkah ${match[1]} / 08`;
    if ((match = value.match(/^(.+), step (\d+)$/i))) return `${match[1]}, langkah ${match[2]}`;
    if ((match = value.match(/^Hue (\d+)°$/i))) return `Corak ${match[1]}°`;
    if ((match = value.match(/^Playing at (.+) BPM, in eighth notes\.$/i))) return `Berjalan pada ${match[1]} BPM, dalam not seperdelapan.`;
    if ((match = value.match(/^(.+) rhythm loaded\. Press Start to play\.$/i))) return `Pola ritme ${translateText(match[1])} dimuat. Tekan Mulai untuk memutar.`;
    if ((match = value.match(/^(.+) rhythm loaded\.$/i))) return `Pola ritme ${translateText(match[1])} dimuat.`;
    if ((match = value.match(/^(.+) composition$/i))) return `Komposisi ${translateText(match[1])}`;
    if ((match = value.match(/^(.+) · copied$/i))) return `${match[1]} · disalin`;
    return value;
  }

  let currentLanguage = 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'id' || saved === 'en') currentLanguage = saved;
  } catch (_) { /* Local files or private browsing may block storage. */ }

  const ignoredTextParents = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'NOSCRIPT']);
  const attrNames = ['aria-label', 'aria-description', 'title', 'placeholder', 'alt'];

  function applyTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.nodeValue || !node.nodeValue.trim()) return;
    const parent = node.parentElement;
    if (!parent || ignoredTextParents.has(parent.tagName) || parent.closest('script,style,textarea,code,pre,noscript,[data-no-translate]')) return;

    const raw = node.nodeValue;
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    const core = raw.slice(leading.length, raw.length - trailing.length || undefined);
    if (!core) return;
    const next = translateText(core);
    const output = leading + next + trailing;
    if (output !== raw) node.nodeValue = output;
  }

  function applyElementAttributes(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE || element.matches('#langToggle,[data-no-translate]')) return;
    attrNames.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      const value = element.getAttribute(name);
      const translated = translateText(value);
      if (translated !== value) element.setAttribute(name, translated);
    });
  }

  function walkAndTranslate(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { applyTextNode(root); return; }
    if (root.nodeType === Node.ELEMENT_NODE) applyElementAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) applyTextNode(node);
    if (root.querySelectorAll) root.querySelectorAll('*').forEach(applyElementAttributes);
  }

  function updateMetadata() {
    const isID = currentLanguage === 'id';
    const home = !/lab\.html$/i.test(location.pathname);
    document.title = home ? 'SoftSpace — Independent Digital Studio' : 'Lab — SoftSpace';
    const description = home
      ? (isID
        ? 'SoftSpace adalah studio digital independen oleh Muhamad Fadil, mengeksplorasi pengembangan web, desain antarmuka, dan pengalaman digital interaktif.'
        : 'SoftSpace is an independent digital studio by Muhamad Fadil, exploring web development, interface design and interactive digital experiences.')
      : (isID
        ? 'Lab SoftSpace: eksperimen interaktif dalam fisika, visual generatif, tipografi, warna, audio browser, dan kode.'
        : 'The SoftSpace Lab: interactive experiments in physics, generative visuals, typography, color, browser audio and code.');
    const meta = document.querySelector('meta[name="description"]');
    const og = document.querySelector('meta[property="og:description"]');
    if (meta) meta.content = description;
    if (og) og.content = description;
  }

  function updateToggle() {
    const button = document.getElementById('langToggle');
    if (!button) return;
    const label = button.querySelector('[data-lang-label]');
    const isEnglish = currentLanguage === 'en';
    if (label) label.textContent = isEnglish ? 'ID' : 'EN';
    const accessible = isEnglish ? 'Ganti bahasa ke Bahasa Indonesia' : 'Switch language to English';
    button.setAttribute('aria-label', accessible);
    button.setAttribute('title', accessible);
    button.setAttribute('aria-pressed', String(!isEnglish));
  }

  function applyLanguage() {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dataset.language = currentLanguage;
    walkAndTranslate(document.body);
    updateMetadata();
    updateToggle();
    document.dispatchEvent(new CustomEvent('softspace:language-change', { detail: { language: currentLanguage } }));
  }

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === 'characterData') applyTextNode(record.target);
      else if (record.type === 'attributes') applyElementAttributes(record.target);
      else record.addedNodes.forEach((node) => walkAndTranslate(node));
    });
  });

  function setLanguage(language) {
    if (language !== 'en' && language !== 'id') return;
    if (language === currentLanguage) return;
    currentLanguage = language;
    try { localStorage.setItem(STORAGE_KEY, currentLanguage); } catch (_) { /* Language still changes for this page. */ }
    applyLanguage();
  }

  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'id' : 'en'));

  applyLanguage();
  if (document.body) observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: attrNames
  });

  window.SoftSpaceI18n = {
    get language() { return currentLanguage; },
    setLanguage,
    toggle: () => setLanguage(currentLanguage === 'en' ? 'id' : 'en'),
    t: translateText
  };
})();
