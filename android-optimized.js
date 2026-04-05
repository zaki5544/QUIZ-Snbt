(function () {
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
    const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    const reduceEffects = !!(isAndroid && (lowMemory || lowCpu));

    function readScreenState() {
        return {
            isSmallScreen: window.matchMedia('(max-width: 820px)').matches,
            isPhoneScreen: window.matchMedia('(max-width: 640px)').matches,
            isPortrait: window.matchMedia('(orientation: portrait)').matches
        };
    }

    function setDynamicVh() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--app-vh', vh + 'px');
    }

    function normalizeViewportMeta() {
        let vp = document.querySelector('meta[name="viewport"]');
        if (!vp) {
            vp = document.createElement('meta');
            vp.name = 'viewport';
            document.head.appendChild(vp);
        }
        vp.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover');
    }

    function ensureChatbotWidgetLoaded() {
        if (window.__quizNationChatbotInitialized || document.querySelector('script[data-quiznation-chatbot="true"]')) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'chatbot-widget.js';
        script.defer = true;
        script.dataset.quiznationChatbot = 'true';
        document.head.appendChild(script);
    }

    function applyDeviceClasses() {
        const { isSmallScreen, isPhoneScreen, isPortrait } = readScreenState();
        if (!document.body) return;

        document.body.classList.toggle('is-android', isAndroid);
        document.body.classList.toggle('is-touch-device', isTouchDevice);
        document.body.classList.toggle('is-small-screen', isSmallScreen);
        document.body.classList.toggle('is-phone-screen', isPhoneScreen);
        document.body.classList.toggle('is-portrait', isPortrait);
        document.body.classList.toggle('android-lite', reduceEffects);

        window.__QUIZNATION_PERF__ = {
            isAndroid,
            isTouchDevice,
            isSmallScreen,
            isPhoneScreen,
            isPortrait,
            lowMemory,
            lowCpu,
            reduceEffects,
            disableDecorations: reduceEffects
        };
    }

    function setupMobileSidebarFixes() {
        const sidebarSelectors = ['#sidebar', '.sidebar', 'nav.sidebar', 'aside.sidebar'];
        const backdropSelectors = ['#sidebarBackdrop', '#sidebarOverlay', '#backdrop', '.sidebar-backdrop', '.sidebar-overlay', '.backdrop'];
        const toggleSelectors = ['#hamburger', '#hamburgerBtn', '#ham', '#menuBtn', '.hamburger', '.menu-btn'];

        function uniqueNodes(selectors) {
            const seen = new Set();
            const nodes = [];
            selectors.forEach(function (selector) {
                document.querySelectorAll(selector).forEach(function (node) {
                    if (!seen.has(node)) {
                        seen.add(node);
                        nodes.push(node);
                    }
                });
            });
            return nodes;
        }

        function isMobileSidebarViewport() {
            return window.matchMedia('(max-width: 1024px), (hover: none) and (pointer: coarse)').matches;
        }

        function getSidebars() {
            return uniqueNodes(sidebarSelectors);
        }

        function getBackdrops() {
            return uniqueNodes(backdropSelectors);
        }

        function getToggles() {
            return uniqueNodes(toggleSelectors);
        }

        function clearForcedStyles(el, properties) {
            if (!el || !el.style) return;
            properties.forEach(function (property) {
                el.style.removeProperty(property);
            });
        }

        function isSidebarMarkedOpen(el) {
            if (!el || !el.classList) return false;
            return el.classList.contains('active')
                || el.classList.contains('open')
                || el.classList.contains('on')
                || el.getAttribute('data-mobile-sidebar-state') === 'open';
        }

        function applySidebarStyles(el, isOpen) {
            if (!el) return;

            if (!isMobileSidebarViewport()) {
                clearForcedStyles(el, ['transform', 'visibility', 'pointer-events', 'inset', 'left', 'height', 'max-height']);
                el.removeAttribute('data-mobile-sidebar-state');
                return;
            }

            el.setAttribute('data-mobile-sidebar-state', isOpen ? 'open' : 'closed');
            el.style.setProperty('transform', isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(calc(-100% - 18px), 0, 0)', 'important');
            el.style.setProperty('visibility', isOpen ? 'visible' : 'hidden', 'important');
            el.style.setProperty('pointer-events', isOpen ? 'auto' : 'none', 'important');
            el.style.setProperty('inset', '0 auto 0 0', 'important');
            el.style.setProperty('left', '0', 'important');
            el.style.setProperty('height', 'calc(var(--app-vh) * 100)', 'important');
            el.style.setProperty('max-height', 'calc(var(--app-vh) * 100)', 'important');
        }

        function applyBackdropStyles(el, isOpen) {
            if (!el) return;

            if (!isMobileSidebarViewport()) {
                clearForcedStyles(el, ['opacity', 'visibility', 'pointer-events']);
                el.removeAttribute('data-mobile-sidebar-state');
                return;
            }

            el.setAttribute('data-mobile-sidebar-state', isOpen ? 'open' : 'closed');
            el.style.setProperty('opacity', isOpen ? '1' : '0', 'important');
            el.style.setProperty('visibility', isOpen ? 'visible' : 'hidden', 'important');
            el.style.setProperty('pointer-events', isOpen ? 'auto' : 'none', 'important');
        }

        function setSidebarState(isOpen) {
            const sidebars = getSidebars();
            const backdrops = getBackdrops();
            const toggles = getToggles();

            sidebars.forEach(function (el) {
                el.classList.toggle('active', isOpen);
                el.classList.toggle('open', isOpen);
                el.classList.toggle('on', isOpen);
                el.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
                applySidebarStyles(el, isOpen);
            });

            backdrops.forEach(function (el) {
                el.classList.toggle('active', isOpen);
                el.classList.toggle('open', isOpen);
                el.classList.toggle('on', isOpen);
                applyBackdropStyles(el, isOpen);
            });

            toggles.forEach(function (el) {
                el.classList.toggle('sidebar-active', isOpen);
                el.classList.toggle('open', isOpen);
                if (el.hasAttribute('aria-expanded') || el.tagName === 'BUTTON') {
                    el.setAttribute('aria-expanded', String(isOpen));
                }
            });

            if (document.body) {
                document.body.classList.toggle('sidebar-open', isOpen);
                document.body.classList.toggle('nav-open', isOpen);
            }

            try {
                localStorage.setItem('eval_snbt_sidebar_open', isOpen ? '1' : '0');
            } catch (error) {
                /* ignore storage issues */
            }

            return isOpen;
        }

        function getCurrentSidebarState() {
            return getSidebars().some(isSidebarMarkedOpen);
        }

        function closeSidebarSafely() {
            return setSidebarState(false);
        }

        function openSidebarSafely() {
            return setSidebarState(true);
        }

        function toggleSidebarSafely(forceOpen) {
            if (typeof forceOpen === 'boolean') {
                return setSidebarState(forceOpen);
            }
            return setSidebarState(!getCurrentSidebarState());
        }

        window.__quizNationCloseSidebar = closeSidebarSafely;
        window.__quizNationOpenSidebar = openSidebarSafely;
        window.__quizNationToggleSidebar = toggleSidebarSafely;

        function patchSidebarApi(apiName, fallbackHandler) {
            const original = typeof window[apiName] === 'function' ? window[apiName] : null;
            if (original && original.__quizNationPatched) return;

            const wrapped = function () {
                if (isMobileSidebarViewport()) {
                    return fallbackHandler.apply(this, arguments);
                }

                if (original) {
                    const result = original.apply(this, arguments);
                    setSidebarState(getCurrentSidebarState());
                    return result;
                }

                return fallbackHandler.apply(this, arguments);
            };

            wrapped.__quizNationPatched = true;
            window[apiName] = wrapped;
        }

        function patchSidebarApis() {
            patchSidebarApi('toggleSidebar', toggleSidebarSafely);
            patchSidebarApi('openSidebar', function () {
                return openSidebarSafely();
            });
            patchSidebarApi('closeSidebar', function () {
                return closeSidebarSafely();
            });
        }

        function handleDocumentInteraction(event) {
            const target = event.target;
            if (!target || !isMobileSidebarViewport()) return;

            if (target.closest('.sidebar a, nav.sidebar a, aside.sidebar a, .menu-item, .sb-item')) {
                closeSidebarSafely();
                return;
            }

            if (target.closest('.sidebar-backdrop, .sidebar-overlay, .backdrop, #sidebarBackdrop, #sidebarOverlay, #backdrop')) {
                closeSidebarSafely();
                return;
            }

            const clickedSidebar = target.closest('.sidebar, nav.sidebar, aside.sidebar, #sidebar');
            const clickedToggle = target.closest('#hamburger, #hamburgerBtn, #ham, #menuBtn, .hamburger, .menu-btn');

            if (getCurrentSidebarState() && !clickedSidebar && !clickedToggle) {
                closeSidebarSafely();
            }
        }

        patchSidebarApis();
        document.addEventListener('click', handleDocumentInteraction, true);
        document.addEventListener('touchend', handleDocumentInteraction, true);
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeSidebarSafely();
        });

        if (isMobileSidebarViewport()) {
            closeSidebarSafely();
            requestAnimationFrame(closeSidebarSafely);
            window.setTimeout(closeSidebarSafely, 120);
            window.setTimeout(closeSidebarSafely, 360);
        } else {
            setSidebarState(getCurrentSidebarState());
        }

        window.addEventListener('pageshow', function () {
            patchSidebarApis();
            if (isMobileSidebarViewport()) closeSidebarSafely();
        }, { passive: true });

        window.addEventListener('pagehide', function () {
            closeSidebarSafely();
        }, { passive: true });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) closeSidebarSafely();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        normalizeViewportMeta();
        ensureChatbotWidgetLoaded();
        setDynamicVh();
        applyDeviceClasses();
        setupMobileSidebarFixes();

        const refreshLayoutState = function () {
            setDynamicVh();
            applyDeviceClasses();
            if (window.__quizNationCloseSidebar && window.matchMedia('(max-width: 1024px), (hover: none) and (pointer: coarse)').matches) {
                window.__quizNationCloseSidebar();
            }
        };

        window.addEventListener('resize', refreshLayoutState, { passive: true });
        window.addEventListener('orientationchange', refreshLayoutState, { passive: true });

        document.querySelectorAll('img').forEach(function (img) {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
            if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        });

        document.querySelectorAll('iframe').forEach(function (frame) {
            if (!frame.hasAttribute('loading')) frame.setAttribute('loading', 'lazy');
        });

        document.querySelectorAll('audio').forEach(function (audio) {
            const preload = audio.getAttribute('preload');
            if (!preload || preload === 'auto') {
                audio.setAttribute('preload', 'metadata');
            }
        });
    });
})();
