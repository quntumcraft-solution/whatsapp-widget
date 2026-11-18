var selectedFile = null;

function openFilePicker() {

    var input = document.getElementById("fileInput");

    try {
        input.click();
    } catch (error) {
        alert("File Picker is not supported by this browser.");
    }
}

function checkFile() {

    var input = document.getElementById("fileInput");

    if (!input.files || input.files.length === 0) {
        alert("No file selected.");
        return;
    }

    selectedFile = input.files[0];

    var name = selectedFile.name;
    var size = selectedFile.size;
    var extension = name.split(".").pop().toLowerCase();

    var type = "Unknown Package";

    if (extension === "jar") {
        type = "Java Application (JAR)";
    }
    else if (extension === "jad") {
        type = "Java Application Descriptor";
    }
    else if (extension === "zip") {
        type = "ZIP Archive";
    }
    else if (extension === "pac") {
        type = "Firmware Package";
    }
    else if (extension === "apk") {
        type = "Android Application";
    }

    document.getElementById("packageInfo").innerHTML =
        "<b>Name:</b> " + name +
        "<br><b>Type:</b> " + type +
        "<br><b>Size:</b> " + (size / 1024).toFixed(2) + " KB" +
        "<br><b>Status:</b> Selected";
}

function downloadFile() {

    var url = document.getElementById("downloadUrl").value;

    if (url.trim() === "") {
        alert("Please enter download URL.");
        return;
    }

    if (url.indexOf("https://") !== 0 &&
        url.indexOf("http://") !== 0) {

        alert("Enter a valid HTTP or HTTPS URL.");
        return;
    }

    window.location.href = url;
}
