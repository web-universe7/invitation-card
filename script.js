/**
 * MAIN WEDDING INVITATION SCRIPT
 * Handles UI population, countdown, animations, petals, and interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. POPULATE DYNAMIC DATA FROM CONFIG
    initDataFromConfig();

    // 2. INITIALIZE COUNTDOWN TIMER
    initCountdown();

    // 3. INITIALIZE INTERSECTION OBSERVER FOR ANIMATIONS
    initScrollAnimations();

    // 4. INITIALIZE CANVAS PETAL ANIMATION
    initPetalsCanvas();

    // 5. INITIALIZE UTILITIES & EVENT LISTENERS
    initEventListeners();
});

/* ==========================================================================
   1. POPULATE CONFIG DATA
   ========================================================================== */
function initDataFromConfig() {
    if (typeof WEDDING === "undefined") return;

    // Names Replacement
    const setElemText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setElemText("hero-bride", WEDDING.bride);
    setElemText("hero-groom", WEDDING.groom);
    setElemText("inv-bride", WEDDING.bride);
    setElemText("inv-groom", WEDDING.groom);
    setElemText("couple-bride", WEDDING.bride);
    setElemText("couple-groom", WEDDING.groom);
    setElemText("ft-bride", WEDDING.bride);
    setElemText("ft-groom", WEDDING.groom);

    // Date & Time Strings
    const fullDateStr = `${WEDDING.weekday}, ${WEDDING.day} ${WEDDING.month}`;
    setElemText("hero-date", fullDateStr);
    setElemText("hero-time", WEDDING.time);
    setElemText("inv-date-str", fullDateStr);
    setElemText("inv-time-str", WEDDING.time);
    setElemText("inv-venue-str", `${WEDDING.venue.name}, ${WEDDING.venue.address}`);

    // Details Cards
    setElemText("card-weekday", WEDDING.weekday);
    setElemText("card-day", WEDDING.day);
    setElemText("card-month", WEDDING.month);
    setElemText("card-time", WEDDING.time);
    setElemText("card-venue-name", WEDDING.venue.name);
    setElemText("card-venue-addr", WEDDING.venue.address);

    // Google Maps Dynamic URL
    const mapsBtn = document.getElementById("btn-google-maps");
    if (mapsBtn) {
        const encodedQuery = encodeURIComponent(WEDDING.venue.mapsQuery);
        mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    }

    // WhatsApp RSVP Dynamic URL
    const rsvpBtn = document.getElementById("btn-whatsapp-rsvp");
    if (rsvpBtn) {
        const encodedMsg = encodeURIComponent(WEDDING.rsvpMessage);
        rsvpBtn.href = `https://wa.me/${WEDDING.rsvpPhone}?text=${encodedMsg}`;
    }
}

/* ==========================================================================
   2. COUNTDOWN TIMER ENGINE
   ========================================================================== */
function initCountdown() {
    const targetDate = new Date(WEDDING.dateTime).getTime();

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-minutes");
    const secsEl = document.getElementById("cd-seconds");
    const countdownGrid = document.getElementById("countdown");
    const expiredMsg = document.getElementById("countdown-expired-msg");

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (countdownGrid) countdownGrid.classList.add("hidden");
            if (expiredMsg) expiredMsg.classList.remove("hidden");
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days < 10 ? `0${days}` : days;
        if (hoursEl) hoursEl.textContent = hours < 10 ? `0${hours}` : hours;
        if (minsEl) minsEl.textContent = minutes < 10 ? `0${minutes}` : minutes;
        if (secsEl) secsEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ==========================================================================
   3. SCROLL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
            }
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. FALLING PETALS CANVAS (Performance Optimized Pure JS)
   ========================================================================== */
function initPetalsCanvas() {
    const canvas = document.getElementById("petal-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Petal configuration
    const petalCount = window.innerWidth < 768 ? 15 : 30;
    const petals = [];
    const petalColors = ["#d4af37", "#f3e5ab", "#e63946", "#ffb703"];

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 1.2 + 0.8;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 2 - 1;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.opacity = Math.random() * 0.6 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.angle += this.spin;

            if (this.y > height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            // Draw oval/petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach((petal) => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   5. EVENT LISTENERS & UTILITY FUNCTIONS
   ========================================================================== */
function initEventListeners() {
    // Scroll Progress Bar & Back To Top Visibility
    const progressBar = document.getElementById("scroll-progress");
    const backToTopBtn = document.getElementById("btn-back-to-top");

    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (progressBar) progressBar.style.width = `${scrolled}%`;

        if (backToTopBtn) {
            if (winScroll > 400) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Copy Venue Address to Clipboard
    const copyBtn = document.getElementById("btn-copy-venue");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const address = `${WEDDING.venue.name}, ${WEDDING.venue.address}`;
            navigator.clipboard.writeText(address).then(() => {
                showToast("स्थळ कॉपी झाले ✓");
            }).catch(() => {
                showToast("कॉपी करण्यात त्रुटी आली.");
            });
        });
    }

    // Print Invitation Mode
    const printBtn = document.getElementById("btn-print");
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    // Add to Google Calendar
    const calendarBtn = document.getElementById("btn-add-calendar");
    if (calendarBtn) {
        calendarBtn.addEventListener("click", () => {
            const cal = WEDDING.calendar;
            const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(cal.title)}&dates=${cal.startDate}/${cal.endDate}&details=${encodeURIComponent(cal.description)}&location=${encodeURIComponent(cal.location)}&ctz=${cal.timeZone}`;
            window.open(googleCalUrl, "_blank");
        });
    }

    // Share Invitation (Web Share API with WhatsApp Fallback)
    const shareBtn = document.getElementById("btn-share-main");
    if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
            const shareData = {
                title: WEDDING.shareTitle,
                text: WEDDING.shareText,
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log("Share dismissed");
                }
            } else {
                const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(WEDDING.shareText + " " + window.location.href)}`;
                window.open(waUrl, "_blank");
            }
        });
    }
}

// Toast Helper
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}