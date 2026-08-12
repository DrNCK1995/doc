(() => {
  const FEE = 800;
  const UPI_ID = "drchaitanya@ybl";
  const PAYEE_NAME = "Dr Chaitanya Krishna";
  const STORAGE_KEY = "drck_bookings_demo";

  const state = {
    step: 1,
    patient: null,
    selectedDate: null,
    selectedSlot: null,
    dates: [],
  };

  const els = {
    header: document.querySelector(".site-header"),
    menuToggle: document.querySelector(".menu-toggle"),
    nav: document.querySelector(".nav"),
    year: document.getElementById("year"),
    toast: document.getElementById("toast"),
    steps: [...document.querySelectorAll("[data-step-indicator]")],
    stepDetails: document.getElementById("step-details"),
    stepSlot: document.getElementById("step-slot"),
    stepPay: document.getElementById("step-pay"),
    stepDone: document.getElementById("step-done"),
    dateList: document.getElementById("date-list"),
    slotGrid: document.getElementById("slot-grid"),
    slotHeading: document.getElementById("slot-heading"),
    continuePay: document.getElementById("continue-pay"),
    paySummary: document.getElementById("pay-summary"),
    upiQr: document.getElementById("upi-qr"),
    copyUpi: document.getElementById("copy-upi"),
    paidConfirm: document.getElementById("paid-confirm"),
    confirmBooking: document.getElementById("confirm-booking"),
    confirmationBody: document.getElementById("confirmation-body"),
    confirmationCard: document.getElementById("confirmation-card"),
    newBooking: document.getElementById("new-booking"),
  };

  const slotTemplates = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
  ];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatDisplayDate(date) {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function buildDates() {
    const dates = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    for (let i = 1; dates.length < 7; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (d.getDay() === 0) continue; // closed Sundays in demo
      dates.push({
        key: formatDateKey(d),
        label: formatDisplayDate(d),
        weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
        slots: slotTemplates.map((time, index) => ({
          time,
          // Dummy: a few slots already taken
          available: !((i + index) % 5 === 0),
        })),
      });
    }
    return dates;
  }

  function getBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveBooking(booking) {
    const all = getBookings();
    all.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function showToast(message) {
    els.toast.hidden = false;
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 2200);
  }

  function goToStep(step) {
    state.step = step;
    const map = {
      1: els.stepDetails,
      2: els.stepSlot,
      3: els.stepPay,
      4: els.stepDone,
    };

    Object.values(map).forEach((panel) => {
      if (!panel) return;
      const active = Number(panel.dataset.step) === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });

    els.steps.forEach((item) => {
      const n = Number(item.dataset.stepIndicator);
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-done", n < step);
    });
  }

  function renderDates() {
    els.dateList.innerHTML = "";
    state.dates.forEach((date) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "date-btn" + (state.selectedDate === date.key ? " is-selected" : "");
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", state.selectedDate === date.key ? "true" : "false");
      btn.innerHTML = `<strong>${date.label}</strong><small>${date.weekday}</small>`;
      btn.addEventListener("click", () => {
        state.selectedDate = date.key;
        state.selectedSlot = null;
        els.continuePay.disabled = true;
        renderDates();
        renderSlots();
      });
      els.dateList.appendChild(btn);
    });
  }

  function renderSlots() {
    const date = state.dates.find((d) => d.key === state.selectedDate);
    els.slotGrid.innerHTML = "";

    if (!date) {
      els.slotHeading.textContent = "Select a date";
      return;
    }

    els.slotHeading.textContent = `Available slots · ${date.label}`;
    const existing = getBookings().filter((b) => b.dateKey === date.key);

    date.slots.forEach((slot) => {
      const taken = !slot.available || existing.some((b) => b.slot === slot.time);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn" + (state.selectedSlot === slot.time ? " is-selected" : "");
      btn.textContent = slot.time;
      btn.disabled = taken;
      if (!taken) {
        btn.addEventListener("click", () => {
          state.selectedSlot = slot.time;
          els.continuePay.disabled = false;
          renderSlots();
        });
      }
      els.slotGrid.appendChild(btn);
    });
  }

  function buildUpiUri() {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: String(FEE),
      cu: "INR",
      tn: `Consult ${state.selectedDate} ${state.selectedSlot}`,
    });
    return `upi://pay?${params.toString()}`;
  }

  function renderPayment() {
    const date = state.dates.find((d) => d.key === state.selectedDate);
    const consultLabels = {
      video: "Video consult",
      phone: "Phone consult",
      followup: "Follow-up",
    };

    els.paySummary.innerHTML = `
      <div><dt>Patient</dt><dd>${escapeHtml(state.patient.name)}</dd></div>
      <div><dt>Mobile</dt><dd>${escapeHtml(state.patient.phone)}</dd></div>
      <div><dt>Type</dt><dd>${consultLabels[state.patient.consultType]}</dd></div>
      <div><dt>Date</dt><dd>${date ? date.label : ""}</dd></div>
      <div><dt>Slot</dt><dd>${escapeHtml(state.selectedSlot || "")}</dd></div>
      <div><dt>Fee</dt><dd>₹${FEE}</dd></div>
    `;

    const upi = buildUpiUri();
    els.upiQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upi)}`;
    els.paidConfirm.checked = false;
    els.confirmBooking.disabled = true;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function confirmBooking() {
    if (!els.paidConfirm.checked) {
      showToast("Please confirm UPI payment first");
      return;
    }

    const date = state.dates.find((d) => d.key === state.selectedDate);
    const booking = {
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      name: state.patient.name,
      phone: state.patient.phone,
      age: state.patient.age,
      consultType: state.patient.consultType,
      reason: state.patient.reason,
      dateKey: state.selectedDate,
      dateLabel: date ? date.label : state.selectedDate,
      slot: state.selectedSlot,
      fee: FEE,
      upiId: UPI_ID,
      paid: true,
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);

    els.confirmationBody.textContent =
      "Payment marked complete. Your online consultation slot is reserved (demo — no calendar sync yet).";
    els.confirmationCard.innerHTML = `
      <p><strong>Booking ID:</strong> ${booking.id}</p>
      <p><strong>Patient:</strong> ${escapeHtml(booking.name)}</p>
      <p><strong>When:</strong> ${escapeHtml(booking.dateLabel)} · ${escapeHtml(booking.slot)}</p>
      <p><strong>Mode:</strong> ${escapeHtml(booking.consultType)}</p>
      <p><strong>Paid via UPI:</strong> ${UPI_ID} · ₹${FEE}</p>
      <p><strong>Next:</strong> You will receive a meeting link once calendar APIs are connected.</p>
    `;

    goToStep(4);
    showToast("Slot booked successfully");
  }

  function resetBooking() {
    state.patient = null;
    state.selectedDate = state.dates[0]?.key || null;
    state.selectedSlot = null;
    els.stepDetails.reset();
    els.continuePay.disabled = true;
    els.paidConfirm.checked = false;
    renderDates();
    renderSlots();
    goToStep(1);
  }

  function initNav() {
    els.menuToggle?.addEventListener("click", () => {
      const open = els.nav.classList.toggle("is-open");
      els.menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    els.nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        els.nav.classList.remove("is-open");
        els.menuToggle?.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("scroll", () => {
      els.header?.classList.toggle("is-scrolled", window.scrollY > 20);
    });
  }

  function initBooking() {
    state.dates = buildDates();
    state.selectedDate = state.dates[0]?.key || null;
    renderDates();
    renderSlots();

    els.stepDetails.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(els.stepDetails);
      state.patient = {
        name: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        age: String(data.get("age") || "").trim(),
        consultType: String(data.get("consultType") || "video"),
        reason: String(data.get("reason") || "").trim(),
      };
      goToStep(2);
    });

    document.querySelectorAll("[data-back]").forEach((btn) => {
      btn.addEventListener("click", () => goToStep(Number(btn.dataset.back)));
    });

    els.continuePay.addEventListener("click", () => {
      if (!state.selectedDate || !state.selectedSlot) {
        showToast("Select a date and time slot");
        return;
      }
      renderPayment();
      goToStep(3);
    });

    els.paidConfirm.addEventListener("change", () => {
      els.confirmBooking.disabled = !els.paidConfirm.checked;
    });

    els.confirmBooking.addEventListener("click", confirmBooking);

    els.copyUpi.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(UPI_ID);
        showToast("UPI ID copied");
      } catch {
        showToast(UPI_ID);
      }
    });

    els.newBooking.addEventListener("click", resetBooking);
  }

  els.year.textContent = String(new Date().getFullYear());
  initNav();
  initBooking();
})();
