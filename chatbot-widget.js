(() => {
    if (window.__quizNationChatbotInitialized) return;
    window.__quizNationChatbotInitialized = true;

    const STORAGE_KEY = 'qn_chatbot_history_v1';
    const MAX_HISTORY = 18;
    const BOT_NAME = 'QuizNation Care';
    const BASE_QUICK_ACTIONS = [
        { label: 'Cara login', prompt: 'Bagaimana cara login?' },
        { label: 'Cari materi', prompt: 'Carikan materi tentang grammar dasar' },
        { label: 'Progress saya', prompt: 'Bagaimana cara melihat progres saya?' },
        { label: 'Mulai belajar', prompt: 'Saya baru mulai belajar, sebaiknya dari mana?' },
        { label: 'Mode fokus', prompt: 'Bagaimana cara memakai mode fokus dan pomodoro?' },
        { label: 'Data hilang', prompt: 'Bagaimana jika progres atau data saya hilang?' },
        { label: 'Hubungi admin', prompt: 'Bagaimana cara menghubungi customer service?' }
    ];

    const PAGE_TIPS = {
        'index.html': 'Di beranda ini, Anda bisa mulai dari level Bahasa Inggris, Smart Tools, dan kartu SNBT.',
        'evaluasi.html': 'Di halaman evaluasi, Anda bisa memilih soal dan memantau progres pengerjaan.',
        'materi.html': 'Di halaman materi, Anda bisa membuka topik belajar dan membaca panduan tiap subbab.',
        'library.html': 'Di halaman library, Anda bisa menelusuri kumpulan referensi dan materi tambahan.',
        'statistik.html': 'Di halaman statistik, Anda bisa melihat skor, progres, dan performa belajar Anda.',
        'pengaturan.html': 'Di halaman pengaturan, Anda bisa menyesuaikan preferensi akun dan tampilan aplikasi.',
        'feedback.html': 'Di halaman feedback, Anda bisa mengirim kritik, saran, atau kendala langsung ke admin.',
        'pencapaian.html': 'Di halaman pencapaian, Anda bisa melihat badge, progres, dan target belajar yang sudah dibuka.',
        'login.html': 'Di halaman login, Anda bisa masuk, daftar, atau melanjutkan penggunaan akun.',
        'snbt.html': 'Di halaman SNBT, Anda bisa fokus ke strategi, latihan, dan informasi kampus atau passing grade.'
    };

    const PAGE_ACTIONS = {
        'index.html': [
            { label: 'Cek fitur', prompt: 'Fitur utama QuizNation apa saja?' },
            { label: 'Tips belajar', prompt: 'Ada tips agar saya lebih konsisten belajar?' },
            { label: 'Cari materi', prompt: 'Carikan materi tentang grammar dasar' }
        ],
        'evaluasi.html': [
            { label: 'Tips evaluasi', prompt: 'Ada tips agar lebih siap mengerjakan evaluasi SNBT?' },
            { label: 'Strategi SNBT', prompt: 'Strategi cepat mengerjakan soal SNBT bagaimana?' }
        ],
        'statistik.html': [
            { label: 'Arti statistik', prompt: 'Bagaimana cara membaca statistik saya?' },
            { label: 'Cek skor', prompt: 'Skor dan bintang saya sekarang berapa?' }
        ],
        'pengaturan.html': [
            { label: 'Atur akun', prompt: 'Bagaimana cara mengatur akun dan preferensi saya?' },
            { label: 'Ubah tema', prompt: 'Bagaimana cara mengganti tema dan musik?' }
        ],
        'materi.html': [
            { label: 'Pilih materi', prompt: 'Materi mana yang sebaiknya saya pelajari dulu?' },
            { label: 'Cari topik', prompt: 'Carikan materi tentang tenses' }
        ],
        'library.html': [
            { label: 'Gunakan library', prompt: 'Bagaimana cara memakai library dengan efektif?' },
            { label: 'Cari referensi', prompt: 'Carikan materi tentang penalaran logis' }
        ],
        'feedback.html': [
            { label: 'Kirim kendala', prompt: 'Kalau ada bug, info apa saja yang harus saya kirim ke admin?' }
        ]
    };

    const FAQ_GROUPS = {
        akun: [
            'cara login atau daftar akun',
            'mode tamu vs akun login',
            'kendala lupa password / reset akses'
        ],
        belajar: [
            'mulai belajar dari mana',
            'pilih materi atau level yang cocok',
            'tips belajar efektif dan konsisten'
        ],
        evaluasi: [
            'cara mulai evaluasi SNBT',
            'strategi mengerjakan soal',
            'cara membaca hasil evaluasi'
        ],
        progres: [
            'cek skor, bintang, streak, dan statistik',
            'arti progress dan pencapaian',
            'cara backup / restore data'
        ],
        teknis: [
            'sidebar, tampilan mobile, atau bug loading',
            'pengaturan tema, musik, dan focus mode',
            'cara menghubungi admin lewat feedback'
        ]
    };

    const PAGE_FAQ_FALLBACKS = {
        'index.html': {
            title: 'Bantuan cepat beranda',
            items: [
                'mulai dari level yang sesuai lalu cek Smart Tools',
                'gunakan saya untuk cari materi atau strategi SNBT',
                'pantau progres lewat Statistik dan Pencapaian'
            ],
            prompts: ['mulai belajar dari mana', 'carikan materi grammar dasar', 'cara cek passing grade']
        },
        'evaluasi.html': {
            title: 'Bantuan cepat evaluasi',
            items: [
                'pilih kategori soal yang paling ingin dikuasai',
                'minta strategi manajemen waktu atau tips evaluasi',
                'cek hasil Anda lagi di Statistik setelah selesai'
            ],
            prompts: ['tips evaluasi', 'strategi SNBT', 'cara membaca hasil evaluasi']
        },
        'materi.html': {
            title: 'Bantuan cepat materi',
            items: [
                'minta saya carikan topik grammar, reading, atau numerik',
                'pilih materi dari dasar dulu lalu lanjut latihan',
                'gabungkan materi dengan evaluasi agar hasilnya lebih stabil'
            ],
            prompts: ['carikan materi tentang tenses', 'materi untuk pemula', 'topik grammar apa yang cocok']
        },
        'library.html': {
            title: 'Bantuan cepat library',
            items: [
                'cari referensi sesuai topik yang ingin dipelajari',
                'gunakan kata kunci seperti geometri, vocab, atau penalaran',
                'buka halaman yang paling relevan dari hasil pencarian'
            ],
            prompts: ['carikan materi penalaran logis', 'referensi vocabulary context', 'materi geometri']
        },
        'statistik.html': {
            title: 'Bantuan cepat statistik',
            items: [
                'cek skor total, bintang, dan streak belajar Anda',
                'minta bantuan membaca arti statistik dan progres',
                'gunakan hasil statistik untuk menentukan materi berikutnya'
            ],
            prompts: ['arti statistik saya', 'skor saya sekarang', 'cara naikkan progres']
        },
        'pengaturan.html': {
            title: 'Bantuan cepat pengaturan',
            items: [
                'atur tema, musik, dan preferensi tampilan',
                'backup data sebelum reset atau pindah perangkat',
                'cek login akun bila progres terasa tidak sinkron'
            ],
            prompts: ['cara ganti tema', 'backup data progres', 'pengaturan akun saya']
        },
        'feedback.html': {
            title: 'Bantuan cepat feedback',
            items: [
                'kirim nama halaman, perangkat, dan langkah sebelum bug muncul',
                'jelaskan kendala secara singkat agar admin cepat paham',
                'sertakan screenshot jika diperlukan'
            ],
            prompts: ['cara lapor bug', 'info yang perlu dikirim ke admin', 'customer service']
        },
        default: {
            title: 'Bantuan cepat untuk halaman ini',
            items: [
                'tanya saya tentang login, progres, evaluasi, atau materi',
                'minta saya carikan halaman belajar yang relevan',
                'laporkan bug atau kendala lewat Feedback bila perlu'
            ],
            prompts: ['cara login', 'carikan materi yang relevan', 'progress saya']
        }
    };

    const SEARCHABLE_PAGE_PATHS = [
        'materi.html',
        'library.html',
        'evaluasi.html',
        'snbt.html',
        'tenses.html',
        'materi-adjectives-adverbs.html',
        'materi-advanceread.html',
        'materi-berbicara.html',
        'materi-direct-indirect-speech.html',
        'materi-email-formal.html',
        'materi-essay-artikel.html',
        'materi-kosakata.html',
        'materi-listening-mendengarkan.html',
        'materi-membacateks.html',
        'materi-menulis-kalimat.html',
        'materi-modal-verbs.html',
        'materi-nouns-pronouns.html',
        'materi-passive-voice.html',
        'materi-pengenalan-kalimat.html',
        'materi-prepositions-conjunctions.html',
        'materi-readcom.html',
        'materi-temakhusus.html',
        'materi-vocab-bisnis.html',
        'lib-aljabar.html',
        'lib-analisis-argumen.html',
        'lib-aritmatika.html',
        'lib-asumsi-evaluasi-argumen.html',
        'lib-ejaan-tanda-baca.html',
        'lib-fungsi-kuadrat-optimasi.html',
        'lib-geometri.html',
        'lib-grammar-structure.html',
        'lib-inference-main-idea.html',
        'lib-kalimat-efektif.html',
        'lib-memahami-teks.html',
        'lib-penalaran-analitis.html',
        'lib-penalaran-induktif.html',
        'lib-penalaran-kausal.html',
        'lib-penalaran-keruangan.html',
        'lib-penalaran-logis.html',
        'lib-pk-kombinatorika-peluang.html',
        'lib-pk-logika-kuantitatif.html',
        'lib-pk-numerik.html',
        'lib-pk-persen-bunga.html',
        'lib-pk-rasio-proporsi.html',
        'lib-pk-tabel-grafik.html',
        'lib-pu-strategi-logika.html',
        'lib-reading-comprehension.html',
        'lib-ringkasan-parafrase.html',
        'lib-statistika.html',
        'lib-text-structure-reference.html',
        'lib-vocabulary-context.html'
    ];

    const SEARCH_STOP_WORDS = new Set([
        'yang', 'dan', 'atau', 'untuk', 'dengan', 'tentang', 'materi', 'halaman', 'tolong',
        'dong', 'saya', 'aku', 'ingin', 'mau', 'cari', 'carikan', 'search', 'apa', 'ada',
        'bisa', 'lebih', 'lagi', 'nih', 'ya'
    ]);

    const searchCache = new Map();

    const els = {};
    const state = {
        typingTimer: null,
        sidebarRefreshQueued: false,
        unreadCount: 0
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getCurrentPage() {
        const path = (window.location.pathname || '').split('/').pop();
        return path || 'index.html';
    }

    function makeLink(href, label) {
        return `<a class="qn-chatbot-link" href="${href}">${label}</a>`;
    }

    function getTimeGreeting() {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat pagi';
        if (hour < 15) return 'Selamat siang';
        if (hour < 18) return 'Selamat sore';
        return 'Selamat malam';
    }

    function matchesAny(text, patterns) {
        return (patterns || []).some((pattern) => pattern.test(text));
    }

    function normalizeText(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function stripHtmlTags(value) {
        return String(value || '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function prettifyPageName(path) {
        return String(path || '')
            .replace(/\.html$/i, '')
            .replace(/^(materi-|lib-)/i, '')
            .split('-')
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }

    function humanizeReply(content, options = {}) {
        const page = options.page || getCurrentPage();
        const tone = options.tone || 'info';
        const fallback = PAGE_FAQ_FALLBACKS[page] || PAGE_FAQ_FALLBACKS.default || { prompts: [] };
        const prompts = Array.isArray(fallback.prompts) ? fallback.prompts.slice(0, 3) : [];

        const intros = {
            info: 'Tentu, saya bantu ya.',
            warm: 'Siap, saya bantu dengan santai ya.',
            issue: 'Tenang, kita cek pelan-pelan bareng.',
            search: 'Saya coba carikan yang paling relevan untuk Anda.',
            page: 'Saya sesuaikan jawabannya dengan halaman yang sedang Anda buka.'
        };

        const closers = {
            info: 'Kalau mau, Anda bisa lanjut tanya tanpa formal-formal juga 😊',
            warm: 'Kalau masih ada yang ingin ditanyakan, lanjutkan saja ya.',
            issue: 'Kalau masih belum beres, sebutkan nama halaman dan kendalanya ya.',
            search: prompts.length
                ? `Kalau belum pas, coba kata kunci seperti <em>${prompts.map((item) => escapeHtml(item)).join('</em>, <em>')}</em>.`
                : 'Kalau belum pas, coba pakai kata kunci yang lebih spesifik ya.',
            page: prompts.length
                ? `Coba juga pertanyaan cepat seperti <em>${prompts.map((item) => escapeHtml(item)).join('</em>, <em>')}</em>.`
                : 'Kalau mau, saya bisa bantu arahkan langkah berikutnya juga.'
        };

        const intro = intros[tone] || intros.info;
        const closer = closers[tone] || closers.info;

        return `${intro ? `<div style="margin-bottom:8px;">${intro}</div>` : ''}${content}${closer ? `<div style="margin-top:8px;">${closer}</div>` : ''}`;
    }

    function createPageFallback(page) {
        const fallback = PAGE_FAQ_FALLBACKS[page] || PAGE_FAQ_FALLBACKS.default;
        const prompts = (fallback.prompts || []).map((item) => `<em>${escapeHtml(item)}</em>`).join(', ');
        return createInfoList(fallback.title, fallback.items, prompts ? `Coba juga: ${prompts}.` : '');
    }

    function buildSearchPreview(text, tokens) {
        const sourceText = String(text || '').replace(/\s+/g, ' ').trim();
        if (!sourceText) return 'Ringkasan materi tersedia pada halaman ini.';

        const lowered = sourceText.toLowerCase();
        let firstIndex = -1;

        (tokens || []).forEach((token) => {
            const index = lowered.indexOf(String(token || '').toLowerCase());
            if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
                firstIndex = index;
            }
        });

        if (firstIndex === -1) {
            return `${sourceText.slice(0, 160)}${sourceText.length > 160 ? '…' : ''}`;
        }

        const start = Math.max(0, firstIndex - 70);
        const end = Math.min(sourceText.length, firstIndex + 150);
        return `${start > 0 ? '…' : ''}${sourceText.slice(start, end).trim()}${end < sourceText.length ? '…' : ''}`;
    }

    function scoreSearchEntry(tokens, entry) {
        const titleText = normalizeText(entry && entry.title);
        const keywordText = normalizeText((entry && entry.keywords || []).join(' '));
        const bodyText = normalizeText(entry && entry.text);
        let score = 0;

        (tokens || []).forEach((token) => {
            if (!token) return;
            if (titleText.includes(token)) score += 6;
            if (keywordText.includes(token)) score += 4;
            if (bodyText.includes(token)) score += 2;
        });

        if ((tokens || []).length && (tokens || []).every((token) => titleText.includes(token) || keywordText.includes(token) || bodyText.includes(token))) {
            score += 6;
        }

        if (entry && entry.href === getCurrentPage()) {
            score += 1;
        }

        return score;
    }

    function getCurrentDocumentSearchEntry() {
        const page = getCurrentPage();
        const title = stripHtmlTags(document.title) || prettifyPageName(page) || 'Halaman saat ini';
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, .card-title, .lesson-title, .section-title'))
            .map((node) => stripHtmlTags(node.textContent))
            .filter(Boolean)
            .slice(0, 24);
        const bodyText = stripHtmlTags(document.body ? (document.body.innerText || document.body.textContent || '') : '');

        return {
            href: page,
            title,
            keywords: headings,
            text: `${title} ${headings.join(' ')} ${bodyText}`,
            previewText: bodyText,
            source: 'current'
        };
    }

    async function fetchSearchEntry(path) {
        if (!path) return null;
        if (searchCache.has(path)) {
            return searchCache.get(path);
        }

        const entryPromise = (async () => {
            if (path === getCurrentPage()) {
                return getCurrentDocumentSearchEntry();
            }

            const fallbackTitle = prettifyPageName(path) || path;
            const fallbackEntry = {
                href: path,
                title: fallbackTitle,
                keywords: fallbackTitle.split(' '),
                text: `${fallbackTitle} ${path.replace(/[-_.]/g, ' ')}`,
                previewText: `Materi atau referensi terkait ${fallbackTitle}.`,
                source: 'catalog'
            };

            if (typeof fetch !== 'function' || typeof DOMParser === 'undefined') {
                return fallbackEntry;
            }

            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const title = stripHtmlTags(
                    (doc.querySelector('title') && doc.querySelector('title').textContent)
                    || (doc.querySelector('h1, h2') && doc.querySelector('h1, h2').textContent)
                    || fallbackTitle
                ) || fallbackTitle;
                const headings = Array.from(doc.querySelectorAll('h1, h2, h3, .card-title, .lesson-title, .section-title'))
                    .map((node) => stripHtmlTags(node.textContent))
                    .filter(Boolean)
                    .slice(0, 24);
                const bodyText = stripHtmlTags(doc.body ? (doc.body.textContent || '') : '');

                return {
                    href: path,
                    title,
                    keywords: headings,
                    text: `${title} ${headings.join(' ')} ${bodyText}`,
                    previewText: bodyText,
                    source: 'live'
                };
            } catch (error) {
                return fallbackEntry;
            }
        })();

        searchCache.set(path, entryPromise);
        return entryPromise;
    }

    async function searchMaterialContent(userMessage) {
        const normalizedQuery = normalizeText(userMessage)
            .replace(/\b(tolong|dong|please|saya|aku|ingin|mau|cari|carikan|search|temukan|materi|topik|halaman|jelaskan|tentang|mengenai|belajar)\b/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const tokens = normalizedQuery
            .split(' ')
            .filter((token) => token.length > 2 && !SEARCH_STOP_WORDS.has(token));

        if (!tokens.length) {
            return '';
        }

        const prioritizedPaths = SEARCHABLE_PAGE_PATHS.filter((path) => {
            const slugText = normalizeText(path.replace(/\.html$/i, '').replace(/[-_]/g, ' '));
            return tokens.some((token) => slugText.includes(token));
        });

        const candidatePaths = Array.from(new Set([
            getCurrentPage(),
            'materi.html',
            'library.html',
            ...prioritizedPaths.slice(0, 12),
            ...SEARCHABLE_PAGE_PATHS.slice(0, 10)
        ]));

        const entries = (await Promise.all(candidatePaths.map((path) => fetchSearchEntry(path)))).filter(Boolean);
        const results = entries
            .map((entry) => ({ entry, score: scoreSearchEntry(tokens, entry) }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        if (!results.length) {
            return '';
        }

        const listMarkup = results.map(({ entry }) => {
            const preview = buildSearchPreview(entry.previewText || entry.text, tokens);
            return `
                <li style="margin-bottom:10px;">
                    <strong>${escapeHtml(entry.title || prettifyPageName(entry.href))}</strong><br>
                    <span>${escapeHtml(preview)}</span>
                    <div style="margin-top:4px;">${makeLink(entry.href, 'Buka materi ini')}</div>
                </li>
            `;
        }).join('');

        const hasLiveResult = results.some(({ entry }) => entry.source === 'live' || entry.source === 'current');
        const footer = hasLiveResult
            ? 'Saya tampilkan yang paling dekat dengan kata kunci Anda. Kalau mau, sebutkan topik yang lebih spesifik lagi.'
            : 'Hasil diambil dari halaman aktif dan katalog materi. Jika situs dijalankan lewat browser/server lokal, pencarian isi halaman akan jadi lebih lengkap.';

        return `
            <strong>Hasil pencarian materi</strong>
            <div style="margin-top:6px;">Saya menemukan beberapa halaman yang kemungkinan paling relevan untuk <em>${escapeHtml(stripHtmlTags(userMessage))}</em>:</div>
            <ul style="margin:10px 0 0; padding-left:18px;">${listMarkup}</ul>
            <div style="margin-top:8px;">${footer}</div>
        `;
    }

    function getLearningSnapshot() {
        const lessonScore = parseInt(localStorage.getItem('totalScore') || '0', 10);
        const snbtScore = parseInt(localStorage.getItem('snbt_totalScore') || '0', 10);
        const bonusScore = parseInt(localStorage.getItem('qn_bonus_score') || '0', 10);
        const stars = parseInt(localStorage.getItem('starBalance') || '0', 10);
        const streak = parseInt(localStorage.getItem('streakDays') || '0', 10);
        const isGuest = localStorage.getItem('isGuest') !== 'false';
        const currentUser = localStorage.getItem('currentUser') || '';

        return {
            lessonScore,
            snbtScore,
            bonusScore,
            totalScore: lessonScore + snbtScore + bonusScore,
            stars,
            streak,
            isGuest,
            currentUser
        };
    }

    function getDynamicQuickActions() {
        const page = getCurrentPage();
        const merged = [...(PAGE_ACTIONS[page] || []), ...BASE_QUICK_ACTIONS];
        const deduped = new Map();

        merged.forEach((item) => {
            if (!item || !item.label || deduped.has(item.label)) return;
            deduped.set(item.label, item);
        });

        return Array.from(deduped.values()).slice(0, 7);
    }

    function createInfoList(title, items, footer = '') {
        const listMarkup = (items || [])
            .map((item) => `<li style="margin-bottom:4px;">${item}</li>`)
            .join('');

        return `<strong>${title}</strong><div style="margin-top:6px;"><ul style="margin:0; padding-left:18px;">${listMarkup}</ul></div>${footer ? `<div style="margin-top:8px;">${footer}</div>` : ''}`;
    }

    function createFaqOverview() {
        return `
            <strong>FAQ QuizNation</strong>
            <div style="margin-top:8px; line-height:1.65;">
                Saya punya bantuan untuk beberapa topik utama berikut:
            </div>
            <div style="margin-top:8px;">
                <strong>1. Akun & Login</strong>
                <ul style="margin:6px 0 8px; padding-left:18px;">
                    ${FAQ_GROUPS.akun.map((item) => `<li>${item}</li>`).join('')}
                </ul>
                <strong>2. Belajar & Materi</strong>
                <ul style="margin:6px 0 8px; padding-left:18px;">
                    ${FAQ_GROUPS.belajar.map((item) => `<li>${item}</li>`).join('')}
                </ul>
                <strong>3. Evaluasi & SNBT</strong>
                <ul style="margin:6px 0 8px; padding-left:18px;">
                    ${FAQ_GROUPS.evaluasi.map((item) => `<li>${item}</li>`).join('')}
                </ul>
                <strong>4. Progress & Statistik</strong>
                <ul style="margin:6px 0 8px; padding-left:18px;">
                    ${FAQ_GROUPS.progres.map((item) => `<li>${item}</li>`).join('')}
                </ul>
                <strong>5. Kendala Teknis</strong>
                <ul style="margin:6px 0 0; padding-left:18px;">
                    ${FAQ_GROUPS.teknis.map((item) => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-top:8px;">Anda bisa tanya langsung dengan bahasa santai, misalnya <em>cara login</em>, <em>data saya hilang</em>, atau <em>tips evaluasi</em>.</div>
        `;
    }

    function formatMessageTime(value) {
        const date = value ? new Date(value) : new Date();
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    function scrollMessagesToBottom() {
        if (els.messages) {
            els.messages.scrollTop = els.messages.scrollHeight;
        }
    }

    function setFabBadge(count) {
        state.unreadCount = Math.max(0, count || 0);
        if (!els.launcher) return;

        if (state.unreadCount > 0) {
            els.launcher.setAttribute('data-badge', String(Math.min(state.unreadCount, 9)));
        } else {
            els.launcher.removeAttribute('data-badge');
        }
    }

    function queueSidebarRefresh() {
        if (state.sidebarRefreshQueued) return;
        state.sidebarRefreshQueued = true;

        requestAnimationFrame(() => {
            state.sidebarRefreshQueued = false;
            injectSidebarButtons();
        });
    }

    function injectStyles() {
        if (document.getElementById('qnChatbotStyles')) return;

        const style = document.createElement('style');
        style.id = 'qnChatbotStyles';
        style.textContent = `
            body.qn-chatbot-open {
                overflow: hidden !important;
                overscroll-behavior: none;
            }

            .qn-chatbot-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(7, 10, 20, 0.58);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: opacity 0.25s ease, visibility 0.25s ease;
                z-index: 12040;
            }

            .qn-chatbot-backdrop.active {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }

            .qn-chatbot-fab {
                position: fixed;
                right: 18px;
                bottom: calc(18px + env(safe-area-inset-bottom, 0px));
                width: 58px;
                height: 58px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #8b5cf6, #4f46e5);
                color: #fff;
                font-size: 1.35rem;
                box-shadow: 0 14px 30px rgba(79, 70, 229, 0.35);
                cursor: pointer;
                z-index: 12050;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                animation: qnChatbotFabFloat 3.2s ease-in-out infinite;
            }

            .qn-chatbot-fab:hover {
                transform: translateY(-2px) scale(1.02);
                box-shadow: 0 18px 34px rgba(79, 70, 229, 0.42);
            }

            .qn-chatbot-fab[data-badge]::after {
                content: attr(data-badge);
                position: absolute;
                top: 2px;
                right: 0;
                min-width: 18px;
                height: 18px;
                padding: 0 5px;
                border-radius: 999px;
                background: #f43f5e;
                color: #fff;
                font-size: 0.64rem;
                font-weight: 800;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 16px rgba(244, 63, 94, 0.28);
            }

            @keyframes qnChatbotFabFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }

            .qn-chatbot-panel {
                position: fixed;
                right: 22px;
                bottom: calc(96px + env(safe-area-inset-bottom, 0px));
                width: min(620px, calc(100vw - 40px));
                max-height: min(86vh, 840px);
                min-height: 640px;
                display: flex;
                flex-direction: column;
                border-radius: 26px;
                overflow: hidden;
                background: rgba(9, 13, 28, 0.96);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 24px 60px rgba(0, 0, 0, 0.34);
                transform: translateY(14px) scale(0.98);
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s ease;
                z-index: 12060;
                color: #eef2ff;
                font-family: 'Inter', 'Segoe UI', sans-serif;
            }

            .qn-chatbot-panel.active {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
                transform: translateY(0) scale(1);
            }

            .qn-chatbot-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 14px 16px;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.92), rgba(79, 70, 229, 0.92));
            }

            .qn-chatbot-title-wrap {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 0;
            }

            .qn-chatbot-avatar {
                width: 36px;
                height: 36px;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.16);
                font-size: 1rem;
                flex-shrink: 0;
            }

            .qn-chatbot-title {
                font-size: 0.95rem;
                font-weight: 800;
                margin: 0;
            }

            .qn-chatbot-subtitle {
                font-size: 0.72rem;
                opacity: 0.9;
                margin: 2px 0 0;
            }

            .qn-chatbot-status {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                margin-top: 4px;
                padding: 4px 8px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.16);
                font-size: 0.68rem;
                font-weight: 700;
            }

            .qn-chatbot-actions {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
            }

            .qn-chatbot-clear,
            .qn-chatbot-close {
                border: none;
                background: rgba(255, 255, 255, 0.14);
                color: #fff;
                width: 34px;
                height: 34px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1rem;
                flex-shrink: 0;
            }

            .qn-chatbot-messages {
                padding: 18px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 14px;
                min-height: 420px;
                background:
                    radial-gradient(circle at top right, rgba(139, 92, 246, 0.12), transparent 38%),
                    rgba(9, 13, 28, 0.96);
            }

            .qn-chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }

            .qn-chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(196, 181, 253, 0.35);
                border-radius: 999px;
            }

            .qn-chatbot-message {
                display: flex;
            }

            .qn-chatbot-message.user {
                justify-content: flex-end;
            }

            .qn-chatbot-stack {
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-width: 88%;
            }

            .qn-chatbot-meta {
                font-size: 0.68rem;
                color: rgba(255, 255, 255, 0.56);
                padding: 0 2px;
            }

            .qn-chatbot-message.user .qn-chatbot-meta {
                text-align: right;
            }

            .qn-chatbot-bubble {
                max-width: 100%;
                padding: 12px 14px;
                border-radius: 15px;
                font-size: 0.92rem;
                line-height: 1.72;
                word-break: break-word;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
            }

            .qn-chatbot-message.bot .qn-chatbot-bubble {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.08);
            }

            .qn-chatbot-message.user .qn-chatbot-bubble {
                background: linear-gradient(135deg, #8b5cf6, #4f46e5);
                color: #fff;
            }

            .qn-chatbot-message.typing .qn-chatbot-bubble {
                display: inline-flex;
                align-items: center;
                min-height: 40px;
            }

            .qn-chatbot-typing-dots {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .qn-chatbot-typing-dots span {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.72);
                animation: qnTypingPulse 1s infinite ease-in-out;
            }

            .qn-chatbot-typing-dots span:nth-child(2) {
                animation-delay: 0.15s;
            }

            .qn-chatbot-typing-dots span:nth-child(3) {
                animation-delay: 0.3s;
            }

            @keyframes qnTypingPulse {
                0%, 80%, 100% { transform: translateY(0); opacity: 0.55; }
                40% { transform: translateY(-3px); opacity: 1; }
            }

            .qn-chatbot-link {
                color: #c4b5fd;
                font-weight: 700;
                text-decoration: none;
            }

            .qn-chatbot-link:hover {
                text-decoration: underline;
            }

            .qn-chatbot-quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 0 14px 12px;
            }

            .qn-chatbot-chip {
                border: 1px solid rgba(139, 92, 246, 0.34);
                background: rgba(139, 92, 246, 0.12);
                color: #e9ddff;
                border-radius: 999px;
                padding: 8px 10px;
                font-size: 0.72rem;
                font-weight: 700;
                cursor: pointer;
                transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
            }

            .qn-chatbot-chip:hover {
                transform: translateY(-1px);
                background: rgba(139, 92, 246, 0.2);
                border-color: rgba(196, 181, 253, 0.52);
            }

            .qn-chatbot-footer {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 8px;
                padding: 12px 14px 14px;
                border-top: 1px solid rgba(255, 255, 255, 0.08);
                background: rgba(7, 10, 20, 0.92);
            }

            .qn-chatbot-input {
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.06);
                color: #fff;
                padding: 12px 13px;
                outline: none;
                font-size: 0.82rem;
            }

            .qn-chatbot-input::placeholder {
                color: rgba(255, 255, 255, 0.58);
            }

            .qn-chatbot-send {
                min-width: 52px;
                border: none;
                border-radius: 12px;
                background: linear-gradient(135deg, #8b5cf6, #4f46e5);
                color: #fff;
                font-weight: 800;
                cursor: pointer;
                padding: 0 14px;
            }

            .qn-chatbot-inline {
                margin-top: 16px;
                padding: 12px;
                border-radius: 16px;
                background: rgba(99, 102, 241, 0.12);
                border: 1px solid rgba(139, 92, 246, 0.22);
            }

            .qn-chatbot-inline-note {
                margin: 8px 0 0;
                font-size: 0.72rem;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.78);
            }

            .qn-chatbot-sidebar-btn {
                width: 100%;
                min-height: 42px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                border: none;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.92), rgba(79, 70, 229, 0.92));
                color: #fff;
                font-size: 0.82rem;
                font-weight: 800;
                cursor: pointer;
                padding: 10px 12px;
                text-align: center;
            }

            .qn-chatbot-sidebar-btn .qn-chatbot-btn-icon {
                font-size: 0.95rem;
            }

            @media (max-width: 1280px) {
                .qn-chatbot-panel {
                    width: min(540px, calc(100vw - 32px));
                    min-height: 580px;
                    max-height: min(82vh, 760px);
                }
            }

            @media (max-width: 1100px) {
                .qn-chatbot-panel {
                    width: min(460px, calc(100vw - 28px));
                    min-height: 520px;
                    max-height: min(80vh, 700px);
                }
            }

            @media (max-width: 640px) {
                .qn-chatbot-panel {
                    right: 12px;
                    left: 12px;
                    width: auto;
                    bottom: calc(82px + env(safe-area-inset-bottom, 0px));
                    min-height: auto;
                    max-height: 78vh;
                }

                .qn-chatbot-fab {
                    right: 12px;
                    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
                    width: 54px;
                    height: 54px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function loadHistory() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function saveHistory(history) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
        } catch (error) {
            /* ignore storage issues */
        }
    }

    function renderMessage(role, content, isHtml, persist, options = {}) {
        if (!els.messages) return;

        const timestamp = options.time || Date.now();
        const messageEl = document.createElement('div');
        messageEl.className = `qn-chatbot-message ${role}`;

        const stackEl = document.createElement('div');
        stackEl.className = 'qn-chatbot-stack';

        const metaEl = document.createElement('div');
        metaEl.className = 'qn-chatbot-meta';
        metaEl.textContent = `${role === 'user' ? 'Anda' : BOT_NAME} • ${formatMessageTime(timestamp)}`;

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'qn-chatbot-bubble';

        if (isHtml) {
            bubbleEl.innerHTML = content;
        } else {
            bubbleEl.textContent = content;
        }

        stackEl.appendChild(metaEl);
        stackEl.appendChild(bubbleEl);
        messageEl.appendChild(stackEl);
        els.messages.appendChild(messageEl);
        scrollMessagesToBottom();

        if (persist) {
            const history = loadHistory();
            history.push({ role, content, isHtml: !!isHtml, time: timestamp });
            saveHistory(history);
        }
    }

    function clearTypingIndicator() {
        const typingEl = els.messages && els.messages.querySelector('.qn-chatbot-message.typing');
        if (typingEl) typingEl.remove();
    }

    function showTypingIndicator() {
        if (!els.messages) return;
        clearTypingIndicator();

        const typingEl = document.createElement('div');
        typingEl.className = 'qn-chatbot-message bot typing';
        typingEl.innerHTML = `
            <div class="qn-chatbot-stack">
                <div class="qn-chatbot-meta">${BOT_NAME} • sedang mengetik...</div>
                <div class="qn-chatbot-bubble">
                    <span class="qn-chatbot-typing-dots"><span></span><span></span><span></span></span>
                </div>
            </div>
        `;

        els.messages.appendChild(typingEl);
        scrollMessagesToBottom();
    }

    function getWelcomeMessage() {
        const page = getCurrentPage();
        const pageTip = PAGE_TIPS[page] || 'Saya bisa bantu untuk login, progres, evaluasi, materi, dan kontak admin QuizNation.';
        return `
            <div>${getTimeGreeting()}! Saya <strong>${BOT_NAME}</strong> 👋</div>
            <div style="margin-top:6px;">${pageTip}</div>
            <div style="margin-top:10px;"><strong>Saya bisa bantu:</strong></div>
            <div style="margin-top:6px; line-height:1.7;">
                • login & akun<br>
                • progres, skor, dan bintang<br>
                • evaluasi SNBT & materi belajar<br>
                • carikan materi atau halaman yang relevan<br>
                • arahan saat ada kendala atau bug
            </div>
        `;
    }

    async function getBotReply(userMessage) {
        const rawText = String(userMessage || '').trim();
        const text = rawText.toLowerCase();
        const snapshot = getLearningSnapshot();
        const page = getCurrentPage();
        const pageTip = PAGE_TIPS[page] || 'Saya siap membantu penggunaan fitur-fitur utama QuizNation.';
        const scoreText = `${snapshot.totalScore.toLocaleString('id-ID')} poin`;
        const starsText = `${snapshot.stars.toLocaleString('id-ID')} bintang`;
        const streakText = `${snapshot.streak} hari`;
        const wantsDynamicSearch = matchesAny(text, [
            /\b(cari|carikan|search|temukan)\b/i,
            /\bmateri tentang\b/i,
            /\btopik tentang\b/i,
            /\bjelaskan tentang\b/i,
            /\bada materi\b/i
        ]);

        if (!text) {
            return humanizeReply('Silakan tulis pertanyaan Anda, nanti saya bantu jawab dengan ringkas dan jelas.', { tone: 'warm', page });
        }

        if (matchesAny(text, [/(halo|hai|hello|permisi|assalamualaikum|oi)/i])) {
            return humanizeReply(`${getTimeGreeting()}! Saya <strong>${BOT_NAME}</strong>. Ceritakan saja kebutuhan Anda, nanti saya bantu arahkan dengan cepat dan santai.`, { tone: 'warm', page });
        }

        if (matchesAny(text, [/(halaman ini|di halaman ini|fitur halaman ini|bantuan halaman ini)/i])) {
            return humanizeReply(createPageFallback(page), { tone: 'page', page });
        }

        if (matchesAny(text, [/(faq|faq lengkap|bantuan lengkap|daftar bantuan|menu bantuan|help menu|pusat bantuan)/i])) {
            return humanizeReply(createFaqOverview(), { tone: 'page', page });
        }

        if (wantsDynamicSearch) {
            const searchReply = await searchMaterialContent(rawText);
            if (searchReply) {
                return humanizeReply(searchReply, { tone: 'search', page });
            }
        }

        if (matchesAny(text, [/(fitur|fitur utama|bisa apa|apa saja fiturnya)/i])) {
            return humanizeReply(createInfoList('Fitur utama QuizNation saat ini meliputi:', [
                'Level Bahasa Inggris bertahap',
                'Evaluasi SNBT per kategori',
                'Materi belajar dan library referensi',
                'Statistik, pencapaian, streak, dan bintang',
                'Smart Tools seperti focus mode, pomodoro, export/import data'
            ], `Tip untuk halaman ini: ${pageTip}`), { tone: 'info', page });
        }

        if (matchesAny(text, [/(baru mulai|mulai dari mana|bingung mulai|mulai belajar|pemula)/i])) {
            return humanizeReply(createInfoList('Kalau baru mulai, urutan yang paling aman adalah:', [
                `${makeLink('index.html#englishLevelsGrid', 'Pilih Level Bahasa Inggris')} untuk latihan bertahap`,
                `${makeLink('materi.html', 'Buka Materi')} jika ingin belajar konsep dulu`,
                `${makeLink('evaluasi.html', 'Masuk Evaluasi SNBT')} kalau ingin simulasi soal`,
                `${makeLink('statistik.html', 'Cek Statistik')} untuk memantau progres`
            ], 'Kalau Anda mau, bilang target Anda, misalnya <em>fokus SNBT</em>, <em>belajar grammar</em>, atau <em>naikkan skor</em>.'), { tone: 'warm', page });
        }

        if (matchesAny(text, [/(tips belajar|belajar efektif|biar konsisten|gimana biar rajin|strategi belajar)/i])) {
            return humanizeReply(createInfoList('Tips belajar yang paling efektif:', [
                'Mulai dari target kecil 15–25 menit per sesi',
                'Gunakan mode fokus dan pomodoro agar tidak cepat lelah',
                'Selesaikan 1–3 level dulu, lalu cek statistik',
                'Ulangi materi yang paling sering salah sebelum lanjut',
                'Gabungkan latihan soal dengan ringkasan singkat di catatan'
            ]), { tone: 'warm', page });
        }

        if (matchesAny(text, [/(grammar|vocabulary|reading|listening|speaking|writing|bahasa inggris|english)/i])) {
            return humanizeReply(createInfoList('Untuk belajar Bahasa Inggris, Anda bisa pilih fokus berikut:', [
                'Grammar dan structure untuk dasar aturan bahasa',
                'Vocabulary untuk tambah kosakata',
                'Reading untuk pemahaman teks',
                'Listening / speaking / writing sesuai kebutuhan latihan'
            ], `Buka ${makeLink('materi.html', 'Materi')} atau mulai dari ${makeLink('index.html#englishLevelsGrid', 'level Bahasa Inggris')}.`), { tone: 'info', page });
        }

        if (matchesAny(text, [/(matematika|numerik|logika|kuantitatif|aritmatika|statistika|geometri)/i])) {
            return humanizeReply(createInfoList('Untuk topik numerik dan penalaran, Anda bisa mulai dari:', [
                'Penalaran kuantitatif dan numerik',
                'Aritmatika, rasio, persen, dan tabel/grafik',
                'Geometri, statistika, dan logika kuantitatif'
            ], `Coba buka ${makeLink('materi.html', 'halaman Materi')} atau kategori terkait di ${makeLink('library.html', 'Library')}.`), { tone: 'info', page });
        }

        if (matchesAny(text, [/(penalaran|logika|analitis|induktif|kausal|verbal)/i])) {
            return humanizeReply(createInfoList('Untuk latihan penalaran dan logika, fokuskan pada:', [
                'memahami pola soal lebih dulu',
                'latihan bertahap dari mudah ke sulit',
                'mencatat jenis kesalahan yang paling sering muncul'
            ], `Anda bisa menemukan banyak subtopik terkait di ${makeLink('library.html', 'Library')} dan modul evaluasi.`), { tone: 'info', page });
        }

        if (matchesAny(text, [/(login|masuk|daftar|akun)/i])) {
            const footer = snapshot.isGuest
                ? 'Saat ini Anda kemungkinan masih berada di mode tamu. Login akan membantu progres tersimpan lebih rapi.'
                : `Akun yang aktif terdeteksi sebagai <strong>${escapeHtml(snapshot.currentUser || 'pengguna')}</strong>.`;
            return humanizeReply(createInfoList('Untuk akses akun:', [
                `Buka ${makeLink('login.html', 'halaman Login')}`,
                'Pilih masuk atau daftar sesuai kebutuhan',
                'Jika status masih tamu, login ulang agar progres tersimpan di perangkat'
            ], footer), { tone: 'warm', page });
        }

        if (matchesAny(text, [/(guest|tamu|mode tamu)/i])) {
            return humanizeReply('Mode tamu tetap bisa dipakai untuk mencoba fitur, tetapi kalau ingin progres lebih aman dan mudah dipantau, sebaiknya login dengan akun Anda.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(lupa|password|sandi|reset)/i])) {
            return humanizeReply(`Jika ada kendala akun atau butuh bantuan reset, silakan buka ${makeLink('feedback.html', 'halaman Feedback')} lalu kirim detail masalah Anda agar admin dapat membantu lebih lanjut.`, { tone: 'issue', page });
        }

        if (matchesAny(text, [/(skor saya|bintang saya|streak saya|progress saya|progres saya|data saya sekarang)/i])) {
            return humanizeReply(createInfoList('Data lokal Anda saat ini:', [
                `<strong>Total skor:</strong> ${scoreText}`,
                `<strong>Bintang:</strong> ${starsText}`,
                `<strong>Streak:</strong> ${streakText}`
            ], `Untuk rincian lengkap, buka ${makeLink('statistik.html', 'Statistik')} atau ${makeLink('pencapaian.html', 'Pencapaian')}.`), { tone: 'info', page });
        }

        if (matchesAny(text, [/(progress|progres|statistik|skor|bintang|pencapaian|streak)/i])) {
            return humanizeReply(createInfoList('Untuk memantau hasil belajar Anda:', [
                `${makeLink('statistik.html', 'Statistik')} untuk melihat skor dan performa`,
                `${makeLink('pencapaian.html', 'Pencapaian')} untuk melihat badge dan progres`,
                `Saat ini data lokal Anda terbaca sekitar <strong>${scoreText}</strong> dan <strong>${starsText}</strong>`
            ]), { tone: 'info', page });
        }

        if (matchesAny(text, [/(evaluasi|snbt|ujian|quiz|tryout|latihan soal)/i])) {
            return humanizeReply(createInfoList('Untuk mulai latihan SNBT:', [
                `Buka ${makeLink('evaluasi.html', 'Evaluasi SNBT')} atau ${makeLink('snbt.html', 'halaman SNBT')}`,
                'Pilih kategori soal yang ingin dikerjakan',
                'Kerjakan bertahap dan cek statistik setelah selesai',
                'Jika ingin lebih santai, mulai dulu dari materi lalu lanjut ke evaluasi'
            ]), { tone: 'info', page });
        }

        if (matchesAny(text, [/(nilai|hasil evaluasi|hasil ujian|skor evaluasi|predikat)/i])) {
            return humanizeReply(createInfoList('Untuk membaca hasil evaluasi:', [
                'lihat total skor dan persentase benar',
                'cek kategori yang paling lemah untuk bahan review',
                'bandingkan hasil terbaru dengan statistik sebelumnya',
                'gunakan hasil itu untuk menentukan materi berikutnya'
            ], `Detail performa biasanya paling mudah dilihat lewat ${makeLink('statistik.html', 'Statistik')}.`), { tone: 'info', page });
        }

        if (matchesAny(text, [/(tips evaluasi|strategi snbt|cara ngerjain|cepat ngerjain|manajemen waktu)/i])) {
            return humanizeReply(createInfoList('Strategi mengerjakan evaluasi/SNBT:', [
                'Kerjakan soal yang paling yakin lebih dulu',
                'Jangan terlalu lama di satu soal',
                'Catat pola kesalahan yang sering muncul',
                'Setelah selesai, ulangi materi yang nilainya paling rendah'
            ]), { tone: 'warm', page });
        }

        if (matchesAny(text, [/(materi|belajar|lesson|level|library|buku|referensi)/i])) {
            return humanizeReply(createInfoList('Untuk belajar materi dan latihan:', [
                `${makeLink('materi.html', 'Halaman Materi')} untuk topik belajar utama`,
                `${makeLink('library.html', 'Library')} untuk referensi tambahan`,
                `${makeLink('index.html#englishLevelsGrid', 'Level Bahasa Inggris')} untuk latihan bertahap`
            ], 'Kalau Anda bingung memilih materi, sebutkan dulu topik yang ingin dipelajari atau minta saya untuk mencarikannya.'), { tone: 'page', page });
        }

        if (matchesAny(text, [/(quest|misi|harian|hadiah|reward|gift|gacha|tukar bintang)/i])) {
            return humanizeReply(createInfoList('Tentang misi harian dan hadiah:', [
                'Selesaikan target harian untuk klaim bintang',
                'Bintang bisa dipakai untuk membuka gift atau hadiah tertentu',
                'Pantau status quest langsung dari beranda agar tidak terlewat'
            ], `Bintang Anda saat ini terbaca sekitar <strong>${starsText}</strong>.`), { tone: 'info', page });
        }

        if (matchesAny(text, [/(streak|hari berturut|login harian|check in harian)/i])) {
            return humanizeReply(`Streak harian Anda saat ini terbaca sekitar <strong>${streakText}</strong>. Supaya tetap jalan, usahakan buka dan pakai QuizNation secara rutin setiap hari.`, { tone: 'warm', page });
        }

        if (matchesAny(text, [/(fokus|pomodoro|timer|produktif|shortcut|mode fokus)/i])) {
            return humanizeReply(createInfoList('Fitur produktivitas yang bisa dipakai:', [
                'Mode fokus untuk mengurangi distraksi di beranda',
                'Pomodoro timer untuk sesi belajar 25 menit',
                'Shortcut keyboard seperti /, R, F, dan ? untuk akses cepat',
                'Quick notes untuk menyimpan rangkuman kecil'
            ]), { tone: 'info', page });
        }

        if (matchesAny(text, [/(tema|theme|gelap|terang|dark mode|light mode)/i])) {
            return humanizeReply('Anda bisa mengganti mode gelap atau terang dari toggle tema di sidebar. Kalau perubahan belum terlihat, refresh halaman sekali lalu coba lagi.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(musik|backsound|audio|sound|volume)/i])) {
            return humanizeReply('Untuk mengatur backsound, buka sidebar lalu gunakan toggle musik dan slider volume. Anda juga bisa memilih track langsung dari panel musik di beranda.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(pengaturan|setting|preferensi|atur akun|ubah profil|ubah tampilan)/i])) {
            return humanizeReply(`Semua pengaturan utama bisa dibuka dari ${makeLink('pengaturan.html', 'halaman Pengaturan')}. Di sana Anda dapat mengatur preferensi tampilan dan beberapa opsi akun.`, { tone: 'page', page });
        }

        if (matchesAny(text, [/(avatar|foto profil|profil saya|nama akun)/i])) {
            return humanizeReply('Jika ada opsi profil atau avatar di halaman tertentu, perubahan biasanya tersimpan lokal di browser. Setelah mengubahnya, refresh halaman jika tampilan belum langsung ikut berubah.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(export|import|backup|data progress|pindah data|restore data|simpan data)/i])) {
            return humanizeReply(`Di beranda tersedia fitur <strong>Export JSON</strong> dan <strong>Import JSON</strong> pada bagian Smart Tools. Gunakan fitur itu untuk backup atau memindahkan data progres Anda.`, { tone: 'info', page });
        }

        if (matchesAny(text, [/(hapus data|reset data|mulai dari awal|kosongkan progress)/i])) {
            return humanizeReply(createInfoList('Jika ingin mulai dari awal, lakukan dengan hati-hati:', [
                'backup dulu data memakai Export JSON',
                'pastikan Anda yakin sebelum menghapus data lokal',
                'kalau perlu, minta bantuan admin melalui Feedback agar lebih aman'
            ]), { tone: 'issue', page });
        }

        if (matchesAny(text, [/(data hilang|progress hilang|skor hilang|bintang hilang)/i])) {
            return humanizeReply(createInfoList('Kalau data terasa hilang, coba langkah ini dulu:', [
                'Pastikan Anda memakai browser/perangkat yang sama',
                'Cek apakah masih login atau sedang mode tamu',
                'Gunakan fitur import jika sebelumnya pernah export data',
                `Jika masih bermasalah, kirim laporan melalui ${makeLink('feedback.html', 'Feedback')}`
            ]), { tone: 'issue', page });
        }

        if (matchesAny(text, [/(sidebar|menu|hamburger|tertutup|terbuka|menu samping)/i])) {
            return humanizeReply('Untuk membuka menu, tap ikon ☰. Untuk menutupnya di HP, tap tombol ✕ atau area gelap di luar sidebar. Di Android, sidebar juga sudah disesuaikan agar lebih stabil.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(bug|error|gagal|tidak bisa|blank|macet|loading|load lama|bermasalah|lemot|lambat)/i])) {
            return humanizeReply(createInfoList('Agar saya bisa bantu lebih tepat, mohon siapkan info berikut:', [
                'nama halaman yang bermasalah',
                'jenis perangkat atau browser yang dipakai',
                'langkah singkat sebelum error muncul',
                `jika perlu, kirim detail lewat ${makeLink('feedback.html', 'Feedback')}`
            ], 'Saran cepat: refresh halaman, tutup-buka tab, lalu coba ulang sekali lagi.'), { tone: 'issue', page });
        }

        if (matchesAny(text, [/(tidak muncul|nggak muncul|tidak tampil|tombol hilang|fitur hilang)/i])) {
            return humanizeReply('Jika ada elemen yang tidak muncul, coba refresh halaman dulu. Kalau masih sama, sebutkan nama halaman dan fitur yang hilang agar lebih mudah ditelusuri.', { tone: 'issue', page });
        }

        if (matchesAny(text, [/(404|halaman tidak ditemukan|link rusak|tautan rusak)/i])) {
            return humanizeReply(`Jika ada link yang tidak bisa dibuka atau menuju halaman kosong, laporkan lewat ${makeLink('feedback.html', 'Feedback')} beserta nama halaman asal dan link yang ditekan.`, { tone: 'issue', page });
        }

        if (matchesAny(text, [/(android|iphone|ios|desktop|laptop|mobile|hp)/i])) {
            return humanizeReply('QuizNation dirancang agar tetap nyaman dipakai di desktop maupun mobile. Jika ada tampilan yang terasa aneh di perangkat tertentu, sebutkan nama halaman dan jenis perangkatnya ya.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(browser|chrome|edge|firefox|safari)/i])) {
            return humanizeReply('QuizNation umumnya paling nyaman dipakai di browser modern seperti Chrome atau Edge. Jika ada kendala di browser tertentu, mohon sebutkan nama browser dan versinya saat menghubungi admin.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(kontak|hubungi|customer service|cs|admin|feedback)/i])) {
            return humanizeReply(`Untuk bantuan lanjutan, silakan buka ${makeLink('feedback.html', 'halaman Feedback')} dan jelaskan nama halaman serta masalah yang dialami. Itu akan mempercepat penanganan oleh admin.`, { tone: 'warm', page });
        }

        if (matchesAny(text, [/(jadwal|utbk|tanggal snbt|snbt 2026)/i])) {
            return humanizeReply('Info umum SNBT 2026 yang ditampilkan di beranda saat ini: pendaftaran hingga 7 April 2026, pembayaran hingga 8 April 2026, pelaksanaan UTBK 21–30 April 2026, dan pengumuman hasil 25 Mei 2026.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(passing grade|universitas|kampus|ui|itb|ugm|telkom university)/i])) {
            return humanizeReply(`Informasi passing grade dan pilihan kampus bisa dilihat dari bagian SNBT di beranda. Gunakan dropdown universitas untuk melihat estimasi nilai dari beberapa kampus populer.`, { tone: 'info', page });
        }

        if (matchesAny(text, [/(jurusan|prodi|pilihan kampus|kampus mana)/i])) {
            return humanizeReply('Untuk eksplorasi kampus dan jurusan, lihat bagian passing grade SNBT di beranda. Anda bisa membandingkan beberapa kampus populer melalui dropdown universitas yang tersedia.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(gratis|biaya|bayar|harga|premium|langganan)/i])) {
            return humanizeReply('Saat ini QuizNation difokuskan sebagai platform belajar yang dapat digunakan secara gratis, termasuk materi, latihan, dan fitur progres dasarnya.', { tone: 'info', page });
        }

        if (matchesAny(text, [/(siapa kamu|siapa anda|siapa dirimu|ini bot apa)/i])) {
            return humanizeReply(`Saya adalah <strong>${BOT_NAME}</strong>, chatbot customer service yang membantu navigasi, akun, progres, penggunaan fitur, dan arahan saat terjadi kendala.`, { tone: 'warm', page });
        }

        if (matchesAny(text, [/(semangat|motivasi|capek belajar|bosan belajar|jenuh)/i])) {
            return humanizeReply('Tetap santai ya 😊 Coba target kecil dulu: 1 sesi pomodoro, 1 materi singkat, atau 1 level. Konsisten sedikit demi sedikit biasanya jauh lebih kuat daripada langsung banyak.', { tone: 'warm', page });
        }

        if (matchesAny(text, [/(terima kasih|makasih|thanks|thx)/i])) {
            return humanizeReply(`Sama-sama 😊 Kalau masih ada pertanyaan, lanjutkan saja chat di sini atau kirim detail masalah lewat ${makeLink('feedback.html', 'Feedback')}.`, { tone: 'warm', page });
        }

        return humanizeReply(createPageFallback(page), { tone: 'page', page });
    }

    function openChatbot() {
        if (!els.panel || !els.backdrop) return;

        els.panel.classList.add('active');
        els.backdrop.classList.add('active');
        els.panel.setAttribute('aria-hidden', 'false');
        if (els.launcher) els.launcher.setAttribute('aria-expanded', 'true');
        document.body.classList.add('qn-chatbot-open');
        setFabBadge(0);

        if (typeof window.__quizNationCloseSidebar === 'function' && window.matchMedia('(max-width: 1024px)').matches) {
            window.__quizNationCloseSidebar();
        }

        window.setTimeout(() => {
            if (els.input) els.input.focus();
        }, 80);
    }

    function closeChatbot() {
        if (!els.panel || !els.backdrop) return;

        clearTypingIndicator();
        els.panel.classList.remove('active');
        els.backdrop.classList.remove('active');
        els.panel.setAttribute('aria-hidden', 'true');
        if (els.launcher) els.launcher.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('qn-chatbot-open');
    }

    function toggleChatbot(forceOpen) {
        if (typeof forceOpen === 'boolean') {
            if (forceOpen) openChatbot();
            else closeChatbot();
            return;
        }

        if (els.panel && els.panel.classList.contains('active')) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }

    function sendMessage(rawText) {
        const text = String(rawText || '').trim();
        if (!text) return;

        renderMessage('user', text, false, true);
        if (els.input) els.input.value = '';

        clearTypingIndicator();
        showTypingIndicator();
        window.clearTimeout(state.typingTimer);
        state.typingTimer = window.setTimeout(async () => {
            try {
                const reply = await Promise.resolve(getBotReply(text));
                clearTypingIndicator();
                renderMessage('bot', reply, true, true);
            } catch (error) {
                clearTypingIndicator();
                renderMessage('bot', humanizeReply('Maaf, pencarian tadi belum sempat selesai dengan baik. Coba ulangi dengan kata kunci yang lebih singkat ya.', { tone: 'issue', page: getCurrentPage() }), true, true);
            }
        }, Math.min(900, 280 + (text.length * 12)));
    }

    function clearConversation() {
        if (!window.confirm('Hapus percakapan chatbot ini?')) return;
        saveHistory([]);
        if (els.messages) els.messages.innerHTML = '';
        renderMessage('bot', getWelcomeMessage(), true, true);
        setFabBadge(0);
    }

    function ensureHistory() {
        const history = loadHistory();
        if (history.length) {
            history.forEach((item) => {
                renderMessage(item.role || 'bot', item.content || '', !!item.isHtml, false, { time: item.time });
            });
            setFabBadge(0);
            return;
        }

        renderMessage('bot', getWelcomeMessage(), true, true);
        setFabBadge(1);
    }

    function injectSidebarButtons() {
        const sidebars = Array.from(document.querySelectorAll('.sidebar, nav.sidebar, aside.sidebar, #sidebar'));
        const uniqueSidebars = sidebars.filter((node, index, list) => node && list.indexOf(node) === index);

        uniqueSidebars.forEach((sidebar) => {
            if (!sidebar || sidebar.querySelector('.qn-chatbot-inline')) return;

            const container = sidebar.querySelector('.sidebar-body')
                || sidebar.querySelector('.sidebar-menu:last-of-type')
                || sidebar;

            const wrap = document.createElement('div');
            wrap.className = 'qn-chatbot-inline';
            wrap.innerHTML = `
                <button type="button" class="qn-chatbot-sidebar-btn" aria-label="Buka customer service chatbot">
                    <span class="qn-chatbot-btn-icon">💬</span>
                    <span>Chat Customer Service</span>
                </button>
                <p class="qn-chatbot-inline-note">Tanya akun, progres, error, atau cara memakai fitur QuizNation langsung dari sini.</p>
            `;

            container.appendChild(wrap);
        });
    }

    function buildWidget() {
        if (document.getElementById('qnChatbotPanel')) return;

        const backdrop = document.createElement('div');
        backdrop.className = 'qn-chatbot-backdrop';
        backdrop.id = 'qnChatbotBackdrop';
        backdrop.setAttribute('aria-hidden', 'true');

        const panel = document.createElement('section');
        panel.className = 'qn-chatbot-panel';
        panel.id = 'qnChatbotPanel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('aria-label', 'Chatbot customer service QuizNation');
        panel.innerHTML = `
            <div class="qn-chatbot-header">
                <div class="qn-chatbot-title-wrap">
                    <div class="qn-chatbot-avatar">🤖</div>
                    <div>
                        <p class="qn-chatbot-title">${BOT_NAME}</p>
                        <div class="qn-chatbot-status">🟢 Online • bantuan cepat</div>
                    </div>
                </div>
                <div class="qn-chatbot-actions">
                    <button type="button" class="qn-chatbot-clear" id="qnChatbotClear" aria-label="Reset percakapan">↺</button>
                    <button type="button" class="qn-chatbot-close" aria-label="Tutup chatbot">✕</button>
                </div>
            </div>
            <div class="qn-chatbot-messages" id="qnChatbotMessages"></div>
            <div class="qn-chatbot-quick-actions" id="qnChatbotQuickActions"></div>
            <div class="qn-chatbot-footer">
                <input type="text" class="qn-chatbot-input" id="qnChatbotInput" placeholder="Tulis pertanyaan atau cari topik materi..." maxlength="240" autocomplete="off" />
                <button type="button" class="qn-chatbot-send" id="qnChatbotSend">Kirim</button>
            </div>
        `;

        const launcher = document.createElement('button');
        launcher.type = 'button';
        launcher.className = 'qn-chatbot-fab';
        launcher.id = 'qnChatbotFab';
        launcher.setAttribute('aria-label', 'Buka chatbot customer service');
        launcher.textContent = '💬';

        document.body.appendChild(backdrop);
        document.body.appendChild(panel);
        document.body.appendChild(launcher);

        els.backdrop = backdrop;
        els.panel = panel;
        els.messages = panel.querySelector('#qnChatbotMessages');
        els.quickActions = panel.querySelector('#qnChatbotQuickActions');
        els.input = panel.querySelector('#qnChatbotInput');
        els.send = panel.querySelector('#qnChatbotSend');
        els.close = panel.querySelector('.qn-chatbot-close');
        els.clear = panel.querySelector('#qnChatbotClear');
        els.launcher = launcher;
    }

    function renderQuickActions() {
        if (!els.quickActions) return;
        els.quickActions.innerHTML = '';

        getDynamicQuickActions().forEach((item) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'qn-chatbot-chip';
            button.textContent = item.label;
            button.dataset.prompt = item.prompt;
            els.quickActions.appendChild(button);
        });
    }

    function bindEvents() {
        if (els.launcher) {
            els.launcher.addEventListener('click', () => toggleChatbot(true));
        }

        if (els.close) {
            els.close.addEventListener('click', closeChatbot);
        }

        if (els.clear) {
            els.clear.addEventListener('click', clearConversation);
        }

        if (els.backdrop) {
            els.backdrop.addEventListener('click', closeChatbot);
        }

        if (els.send) {
            els.send.addEventListener('click', () => sendMessage(els.input && els.input.value));
        }

        if (els.input) {
            els.input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage(els.input.value);
                }
            });
        }

        if (els.quickActions) {
            els.quickActions.addEventListener('click', (event) => {
                const chip = event.target.closest('.qn-chatbot-chip');
                if (!chip) return;
                sendMessage(chip.dataset.prompt || chip.textContent || 'Bantuan');
            });
        }

        document.addEventListener('click', (event) => {
            const trigger = event.target.closest('.qn-chatbot-sidebar-btn');
            if (!trigger) return;
            event.preventDefault();
            toggleChatbot(true);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && els.panel && els.panel.classList.contains('active')) {
                closeChatbot();
            }
        });
    }

    function init() {
        injectStyles();
        buildWidget();
        renderQuickActions();
        ensureHistory();
        queueSidebarRefresh();
        bindEvents();

        window.setTimeout(queueSidebarRefresh, 260);
        window.setTimeout(queueSidebarRefresh, 900);

        if (document.body && 'MutationObserver' in window) {
            const observer = new MutationObserver(() => queueSidebarRefresh());
            observer.observe(document.body, { childList: true, subtree: true });
        }

        window.openQuizNationChatbot = openChatbot;
        window.closeQuizNationChatbot = closeChatbot;
        window.toggleQuizNationChatbot = toggleChatbot;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
