// =============================
// Parking Scanner V1
// =============================

const API = "https://script.google.com/macros/s/AKfycbzq08x-NGwfGhsmVRx1tNe9lbcNvwEBQPvWbMBdDCRZlw2HvNu6SprAdcE_kFu_vvuRJQ/exec";

const result = document.getElementById("result");

let scanning = true;

// Called when QR code is scanned
function onScanSuccess(decodedText) {

    if (!scanning) return;

    scanning = false;

    result.innerHTML = "<h2>Loading...</h2>";

    loadParking(decodedText);
}

// =============================
// JSONP Request
// =============================
function loadParking(passID) {

    // Remove previous JSONP script if any
    const oldScript = document.getElementById("jsonpScript");
    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "jsonpScript";

    script.src =
        API +
        "?id=" + encodeURIComponent(passID) +
        "&callback=showResult";

    script.onerror = function () {

        result.innerHTML = `
            <h2>❌ Server Error</h2>
            <p>Unable to contact the API.</p>
        `;

        scanning = true;
    };

    document.body.appendChild(script);

}

// =============================
// API Callback
// =============================
function showResult(data) {

    if (data.success) {

        const expiry = new Date(data.expiry);

        result.innerHTML = `
            <h2 style="color:green;">✅ PASS VERIFIED</h2>

            <p><b>Pass ID</b><br>${data.pass}</p>

            <p><b>Name</b><br>${data.fullname}</p>

            <p><b>Plate</b><br>${data.plate || "-"}</p>

            <p><b>Parking Slot</b><br>${data.slot}</p>

            <p><b>Status</b><br>${data.status}</p>

            <p><b>Expiry</b><br>${expiry.toLocaleDateString()}</p>

            <br>

            <button onclick="scanAgain()">
                Scan Again
            </button>
        `;

    } else {

        result.innerHTML = `
            <h2 style="color:red;">❌ PASS NOT FOUND</h2>

            <button onclick="scanAgain()">
                Scan Again
            </button>
        `;

    }

}

// =============================
// Scan Again
// =============================
function scanAgain() {

    result.innerHTML = "<p>Scan a Parking QR Code</p>";

    scanning = true;

}

// =============================
// Start Scanner
// =============================
const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: {
            width: 250,
            height: 250
        }
    },
    false
);

html5QrcodeScanner.render(onScanSuccess);
