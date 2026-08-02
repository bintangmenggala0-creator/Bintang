// Timeline "IV. Thoughts" — datanya diambil dari Google Sheet yang di-publish sebagai CSV.
//
// Cara mendapatkan link CSV:
// 1. Buka Google Sheet-nya
// 2. File > Share > Publish to web
// 3. Pilih sheet yang berisi thoughts, format pilih "Comma-separated values (.csv)"
// 4. Klik Publish, salin link yang muncul, lalu tempel di THOUGHTS_CSV_URL di bawah
//
// Format kolom yang dikenali (header baris pertama, tidak case-sensitive):
// - tanggal: "date" atau "tanggal"
// - isi teks: "text", "thought", atau "isi"
// Kalau nama kolom di sheet kamu berbeda, cukup sesuaikan di bagian dateIdx / textIdx di bawah.

document.addEventListener("DOMContentLoaded", function () {

    const THOUGHTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTI-v-IP8GRF-lCPodqcfgADuGR2Ce1RQJ9hiqlKVm-P_tbYCzMe70Dlb__F03UYDvWvKyKqotZmBwo/pub?output=csv";

    const timelineEl = document.getElementById("thoughts-timeline");
    if (!timelineEl) return;

    function parseCSV(text) {
        const rows = [];
        let row = [], field = "", inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const c = text[i];

            if (inQuotes) {
                if (c === '"') {
                    if (text[i + 1] === '"') { field += '"'; i++; }
                    else inQuotes = false;
                } else {
                    field += c;
                }
            } else {
                if (c === '"') {
                    inQuotes = true;
                } else if (c === ",") {
                    row.push(field);
                    field = "";
                } else if (c === "\n" || c === "\r") {
                    if (field !== "" || row.length) {
                        row.push(field);
                        rows.push(row);
                        row = [];
                        field = "";
                    }
                    if (c === "\r" && text[i + 1] === "\n") i++;
                } else {
                    field += c;
                }
            }
        }
        if (field !== "" || row.length) {
            row.push(field);
            rows.push(row);
        }

        return rows.filter(function (r) {
            return r.length && r.some(function (v) { return v.trim() !== ""; });
        });
    }

    function escapeHTML(str) {
        const div = document.createElement("div");
        div.textContent = str == null ? "" : str;
        return div.innerHTML;
    }

    function renderError() {
        timelineEl.innerHTML = '<p class="timeline-error">Belum bisa memuat thoughts. Pastikan link CSV Google Sheet sudah benar.</p>';
    }

    if (!THOUGHTS_CSV_URL || THOUGHTS_CSV_URL.indexOf("PASTE_LINK_CSV") !== -1) {
        renderError();
        return;
    }

    fetch(THOUGHTS_CSV_URL)
        .then(function (res) { return res.text(); })
        .then(function (text) {
            const rows = parseCSV(text);
            if (!rows.length) { renderError(); return; }

            const header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
            const dateIdx = header.indexOf("date") !== -1 ? header.indexOf("date") : header.indexOf("tanggal");
            const textIdx = header.indexOf("text") !== -1
                ? header.indexOf("text")
                : (header.indexOf("thought") !== -1 ? header.indexOf("thought") : header.indexOf("isi"));

            const entries = rows.slice(1).map(function (r) {
                return {
                    date: dateIdx !== -1 ? r[dateIdx] : "",
                    text: textIdx !== -1 ? r[textIdx] : r[r.length - 1]
                };
            }).filter(function (e) { return e.text && e.text.trim() !== ""; });

            if (!entries.length) { renderError(); return; }

            timelineEl.innerHTML = entries.map(function (entry) {
                return (
                    '<div class="timeline-item">' +
                        (entry.date ? '<span class="timeline-date">' + escapeHTML(entry.date) + '</span>' : '') +
                        '<div class="timeline-card-inner">' +
                            '<p class="timeline-card">' + escapeHTML(entry.text) + '</p>' +
                        '</div>' +
                    '</div>'
                );
            }).join("");
        })
        .catch(function (err) {
            renderError();
            console.error(err);
        });

});
