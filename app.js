const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

const fileName = document.getElementById("fileName");
const fileType = document.getElementById("fileType");
const fileSize = document.getElementById("fileSize");
const fileStatus = document.getElementById("fileStatus");

const analysisResult = document.getElementById("analysisResult");

let selectedFile = null;

function showResult(message) {
    analysisResult.textContent = message;
}

function getExtension(name) {
    const parts = name.toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
}

function formatSize(size) {
    if (size < 1024) return size + " Bytes";
    if (size < 1048576)
        return (size / 1024).toFixed(2) + " KB";

    return (size / 1048576).toFixed(2) + " MB";
}

function detectType(file) {
    const ext = getExtension(file.name);

    const types = {
        jar: "Java Application Archive",
        jad: "Java Application Descriptor",
        apk: "Android Application",
        zip: "ZIP Archive",
        pac: "Firmware Package",
        html: "HTML Web Page",
        htm: "HTML Web Page",
        js: "JavaScript File",
        css: "CSS Stylesheet",
        mp3: "Audio File",
        mp4: "Video File",
        txt: "Text File",
        pdf: "PDF Document"
    };

    return types[ext] || "Unknown File Type";
}

selectBtn.addEventListener("click", function() {
    fileInput.click();
});

fileInput.addEventListener("change", function() {
    selectedFile = fileInput.files[0];

    if (!selectedFile) return;

    fileName.textContent = "File: " + selectedFile.name;
    fileType.textContent = "File Type: " + detectType(selectedFile);
    fileSize.textContent = "File Size: " + formatSize(selectedFile.size);
    fileStatus.textContent = "Status: Selected";

    analyzeBtn.disabled = false;

    showResult("File selected successfully.\nPress ANALYZE FILE.");
});

analyzeBtn.addEventListener("click", async function() {
    if (!selectedFile) return;

    const ext = getExtension(selectedFile.name);

    fileStatus.textContent = "Status: Analyzing...";

    let result = "FILE ANALYSIS REPORT\n";
    result += "----------------------\n";
    result += "Name: " + selectedFile.name + "\n";
    result += "Size: " + formatSize(selectedFile.size) + "\n";
    result += "Type: " + detectType(selectedFile) + "\n\n";

    if (ext === "jar") {
        const signature = new Uint8Array(
            await selectedFile.slice(0, 4).arrayBuffer()
        );

        const validZip =
            signature.length >= 4 &&
            signature[0] === 0x50 &&
            signature[1] === 0x4B;

        result += "JAVA ARCHIVE CHECK\n";
        result += "ZIP Signature: " +
            (validZip ? "Found" : "Not Found") + "\n";

        result += "Java ME Runtime: Not Verified\n";
        result += "Native Installer: Not Verified\n\n";

        result += validZip
            ? "The file has a ZIP archive signature.\n"
            : "The file does not have a standard ZIP signature.\n";

        result += "Installation cannot be confirmed by browser analysis.";
    }

    else if (ext === "jad") {
        const text = await selectedFile.text();

        result += "JAD DESCRIPTOR INFORMATION\n";
        result += "--------------------------\n";

        const fields = [
            "MIDlet-Name",
            "MIDlet-Version",
            "MIDlet-Vendor",
            "MIDlet-Jar-URL",
            "MIDlet-Jar-Size",
            "MIDlet-1"
        ];

        fields.forEach(function(field) {
            const regex = new RegExp(
                "^" + field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
                "\\s*:\\s*(.*)$",
                "im"
            );

            const match = text.match(regex);

            result += field + ": " +
                (match ? match[1].trim() : "Not Found") + "\n";
        });

        result += "\nJava Runtime: Not Verified\n";
        result += "Native Installer: Not Verified\n";
    }

    else if (ext === "apk") {
        result += "APK is an Android application.\n";
        result += "IT9020 is not an Android phone.\n";
        result += "Direct installation is not supported by this hub.";
    }

    else if (ext === "pac") {
        result += "PAC FIRMWARE PACKAGE DETECTED.\n";
        result += "This is not a normal application.\n";
        result += "Do not attempt installation through this hub.\n";
        result += "Incorrect firmware flashing may damage the phone.";
    }

    else if (ext === "zip") {
        result += "ZIP ARCHIVE DETECTED.\n";
        result += "This is an archive, not a directly executable application.";
    }

    else if (["html", "htm", "js", "css"].includes(ext)) {
        result += "WEB FILE DETECTED.\n";
        result += "Execution depends on browser support.";
    }

    else {
        result += "No specialized analysis is available for this extension.";
    }

    showResult(result);
    fileStatus.textContent = "Status: Analysis Complete";
});

document.getElementById("openUrlBtn").addEventListener("click", function() {
    const url = document.getElementById("urlInput").value.trim();

    try {
        const parsed = new URL(url);

        if (parsed.protocol !== "https:" &&
            parsed.protocol !== "http:") {
            throw new Error("Invalid protocol");
        }

        window.location.href = parsed.href;

    } catch (error) {
        showResult("Please enter a valid HTTP or HTTPS URL.");
    }
});

document.getElementById("downloadUrlBtn").addEventListener("click", function() {
    const url = document.getElementById("urlInput").value.trim();

    try {
        const parsed = new URL(url);

        if (parsed.protocol !== "https:" &&
            parsed.protocol !== "http:") {
            throw new Error("Invalid protocol");
        }

        const link = document.createElement("a");
        link.href = parsed.href;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        link.remove();

        showResult(
            "Download requested.\n" +
            "The browser may open the file or download it.\n" +
            "Actual behavior depends on browser support."
        );

    } catch (error) {
        showResult("Please enter a valid HTTP or HTTPS URL.");
    }
});

document.getElementById("browserStatus").textContent =
    "Browser: " + navigator.userAgent;

showResult("RUTIK SYSTEM HUB READY.\nSelect a file to begin.");
