
const manager = new StudentManager();

let editingId   = null; 
let currentView = "cards";


const grid       = document.getElementById("student-grid");
const tableBody  = document.getElementById("student-table-body");
const emptyState = document.getElementById("empty-state");


window.addEventListener("DOMContentLoaded", () => {
  const demo = [
    { firstName:"Maria",  lastName:"Santos",    studentId:"2024-0001", course:"BSCS",  yearLevel:"2", grades:{ math:97, science:95, english:96, filipino:94, pe:98, elective:97 } },
    { firstName:"Juan",   lastName:"dela Cruz", studentId:"2024-0002", course:"BSIT",  yearLevel:"1", grades:{ math:82, science:79, english:85, filipino:80, pe:88, elective:83 } },
    { firstName:"Ana",    lastName:"Reyes",     studentId:"2024-0003", course:"BSBA",  yearLevel:"3", grades:{ math:70, science:72, english:74, filipino:71, pe:75, elective:73 } },
    { firstName:"Carlo",  lastName:"Mendoza",   studentId:"2024-0004", course:"BSECE", yearLevel:"4", grades:{ math:60, science:58, english:62, filipino:65, pe:70, elective:60 } },
    { firstName:"Liza",   lastName:"Flores",    studentId:"2024-0005", course:"BSCS",  yearLevel:"2", grades:{ math:91, science:93, english:90, filipino:92, pe:94, elective:91 } },
  ];
  demo.forEach(d => manager.addStudent(d));
  renderAll();
});


function renderAll(students = manager.getAll()) {
  const isEmpty = students.length === 0;
  emptyState.style.display = isEmpty ? "flex" : "none";

  
  grid.innerHTML = students.map(UIRenderer.renderCard).join("");

  
  tableBody.innerHTML = students.map(UIRenderer.renderTableRow).join("");


  document.getElementById("total-count").textContent = `Total: ${manager.getTotalCount()}`;
  document.getElementById("honor-count").textContent = `Honor: ${manager.getHonorCount()}`;
  document.getElementById("avg-gpa").textContent     = `Avg GPA: ${manager.getAverageGPA()}`;
}

// ── FORM SUBMIT ─────────────────────────────────────────────
function handleSubmit() {
  const data = getFormData();
  if (!data) return;

  if (editingId !== null) {
    manager.updateStudent(editingId, data);
    editingId = null;
    document.getElementById("form-title").textContent  = "Add Student";
    document.getElementById("submit-btn").textContent  = "➕ Add Student";
    document.getElementById("cancel-btn").style.display = "none";
  } else {
    manager.addStudent(data);
  }

  clearForm();
  renderAll();
}

// ── GET FORM DATA ────────────────────────────────────────────
function getFormData() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const course    = document.getElementById("course").value.trim();
  const yearLevel = document.getElementById("yearLevel").value;

  if (!firstName || !lastName || !studentId || !course) {
    alert("Please fill in all required fields (name, ID, course).");
    return null;
  }

  const grades = {
    math:     Number(document.getElementById("math").value)     || 0,
    science:  Number(document.getElementById("science").value)  || 0,
    english:  Number(document.getElementById("english").value)  || 0,
    filipino: Number(document.getElementById("filipino").value) || 0,
    pe:       Number(document.getElementById("pe").value)       || 0,
    elective: Number(document.getElementById("elective").value) || 0,
  };

  return { firstName, lastName, studentId, course, yearLevel, grades };
}

// ── EDIT STUDENT ─────────────────────────────────────────────
function editStudent(id) {
  const student = manager.getById(id);
  if (!student) return;

  editingId = id;
  const g   = student.getGrades();

  document.getElementById("firstName").value  = student.getFirstName();
  document.getElementById("lastName").value   = student.getLastName();
  document.getElementById("studentId").value  = student.getStudentId();
  document.getElementById("course").value     = student.getCourse();
  document.getElementById("yearLevel").value  = student.getYearLevel();
  document.getElementById("math").value       = g.math;
  document.getElementById("science").value    = g.science;
  document.getElementById("english").value    = g.english;
  document.getElementById("filipino").value   = g.filipino;
  document.getElementById("pe").value         = g.pe;
  document.getElementById("elective").value   = g.elective;

  document.getElementById("form-title").textContent  = "Edit Student";
  document.getElementById("submit-btn").textContent  = "💾 Save Changes";
  document.getElementById("cancel-btn").style.display = "inline-block";

  // Scroll to form on mobile
  document.querySelector(".sidebar").scrollIntoView({ behavior: "smooth" });
}

// ── DELETE STUDENT ────────────────────────────────────────────
function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  manager.deleteStudent(id);
  renderAll();
}

// ── VIEW STUDENT MODAL ────────────────────────────────────────
function viewStudent(id) {
  const student = manager.getById(id);
  if (!student) return;
  document.getElementById("modal-title").textContent = student.getFullName();
  document.getElementById("modal-content").innerHTML = UIRenderer.renderModal(student);
  document.getElementById("modal").style.display     = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ── SEARCH & FILTER ───────────────────────────────────────────
function handleSearch() {
  const query  = document.getElementById("search-input").value;
  const year   = document.getElementById("filter-year").value;
  const status = document.getElementById("filter-status").value;
  const results = manager.search(query, year, status);
  renderAll(results);
}

// ── TOGGLE VIEW ───────────────────────────────────────────────
function toggleView() {
  const choice = document.getElementById("view-toggle").value;
  currentView  = choice;
  document.getElementById("card-view").style.display  = choice === "cards" ? "block" : "none";
  document.getElementById("table-view").style.display = choice === "table" ? "block" : "none";
}

// ── CANCEL EDIT ───────────────────────────────────────────────
function cancelEdit() {
  editingId = null;
  clearForm();
  document.getElementById("form-title").textContent  = "Add Student";
  document.getElementById("submit-btn").textContent  = "➕ Add Student";
  document.getElementById("cancel-btn").style.display = "none";
}

// ── CLEAR FORM ────────────────────────────────────────────────
function clearForm() {
  ["firstName","lastName","studentId","course",
   "math","science","english","filipino","pe","elective"]
    .forEach(id => { document.getElementById(id).value = ""; });
  document.getElementById("yearLevel").value = "1";
}

// ── CLOSE MODAL ON OVERLAY CLICK ─────────────────────────────
document.getElementById("modal").addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});

// ── KEYBOARD: ESC closes modal ────────────────────────────────
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});
