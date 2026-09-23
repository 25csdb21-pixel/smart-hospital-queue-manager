let patients = JSON.parse(localStorage.getItem("patients")) || [];

let tokenNumber = patients.length > 0
    ? Math.max(...patients.map(p => p.token))
    : 0;

let completedCount = 0;


// Add Patient
function addPatient() {

    const name = document.getElementById("patientName").value;
    const age = document.getElementById("patientAge").value;
    const doctor = document.getElementById("doctor").value;
    const priority = document.getElementById("priority").value;

    if (name === "" || age === "" || doctor === "") {
        alert("Please fill all details!");
        return;
    }

    tokenNumber++;

    const patient = {
        token: tokenNumber,
        name: name,
        age: age,
        doctor: doctor,
        priority: priority,
        status: "Waiting"
    };

    patients.push(patient);

    saveData();

    document.getElementById("patientName").value = "";
    document.getElementById("patientAge").value = "";
    document.getElementById("doctor").value = "";
    document.getElementById("priority").value = "Normal";

    displayQueue();
}


// Display Queue
function displayQueue() {

    const table = document.getElementById("queueTable");

    table.innerHTML = "";

    patients.forEach((patient, index) => {

        const row = document.createElement("tr");

        let priorityClass =
            patient.priority === "Emergency"
                ? "emergency"
                : "";

        let statusClass =
            patient.status === "Completed"
                ? "completed"
                : "waiting";

        row.innerHTML = `
            <td>T-${patient.token}</td>

            <td>${patient.name}</td>

            <td>${patient.age}</td>

            <td>${patient.doctor}</td>

            <td class="${priorityClass}">
                ${patient.priority}
            </td>

            <td class="${statusClass}">
                ${patient.status}
            </td>

            <td>
                <button class="delete-btn"
                    onclick="deletePatient(${index})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });

    updateStatistics();
}


// Call Next Patient
function callNext() {

    // Emergency patients get priority
    let nextPatient = patients.find(
        patient =>
            patient.status === "Waiting" &&
            patient.priority === "Emergency"
    );

    // If no emergency patient
    if (!nextPatient) {

        nextPatient = patients.find(
            patient => patient.status === "Waiting"
        );
    }

    if (!nextPatient) {
        alert("No patients waiting!");
        return;
    }

    nextPatient.status = "Completed";

    document.getElementById("currentToken").innerText =
        "T-" + nextPatient.token;

    document.getElementById("currentPatient").innerText =
        nextPatient.name + " - " + nextPatient.doctor;

    saveData();

    displayQueue();
}


// Delete Patient
function deletePatient(index) {

    if (confirm("Delete this patient?")) {

        patients.splice(index, 1);

        saveData();

        displayQueue();
    }
}


// Statistics
function updateStatistics() {

    const total = patients.length;

    const waiting =
        patients.filter(
            patient => patient.status === "Waiting"
        ).length;

    const completed =
        patients.filter(
            patient => patient.status === "Completed"
        ).length;

    document.getElementById("totalPatients").innerText = total;

    document.getElementById("waitingPatients").innerText = waiting;

    document.getElementById("completedPatients").innerText = completed;
}


// Save Data
function saveData() {

    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );
}


// Load Queue
displayQueue();