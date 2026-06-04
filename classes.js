// ============================================================
//  classes.js — OOP Classes for Student Management Dashboard
//  4 Pillars of OOP Applied:
//  1. ENCAPSULATION  — data and methods bundled inside classes
//  2. INHERITANCE    — Student & HonorStudent extend Person
//  3. POLYMORPHISM   — getGradeLabel() overridden per class
//  4. ABSTRACTION    — GPA/grade logic hidden behind methods
// ============================================================


// ─────────────────────────────────────────────
// CLASS 1: Person  (Base class)
// PILLAR: ABSTRACTION — defines the blueprint
//         ENCAPSULATION — groups shared properties
// ─────────────────────────────────────────────
class Person {
  #firstName; // private field (Encapsulation)
  #lastName;

  constructor(firstName, lastName) {
    this.#firstName = firstName;
    this.#lastName  = lastName;
  }

  // Getters — controlled access to private data (Encapsulation)
  getFirstName() { return this.#firstName; }
  getLastName()  { return this.#lastName;  }
  getFullName()  { return `${this.#firstName} ${this.#lastName}`; }

  setFirstName(v) { this.#firstName = v; }
  setLastName(v)  { this.#lastName  = v; }

  // Abstraction — subclasses must implement this
  getRole() { return "Person"; }
}


// ─────────────────────────────────────────────
// CLASS 2: Student  (extends Person)
// PILLAR: INHERITANCE — gets name methods from Person
//         ENCAPSULATION — grades stored/processed internally
//         ABSTRACTION — computeGPA() hides formula
// ─────────────────────────────────────────────
class Student extends Person {
  #studentId;
  #course;
  #yearLevel;
  #grades; // { math, science, english, filipino, pe, elective }

  constructor(firstName, lastName, studentId, course, yearLevel, grades) {
    super(firstName, lastName); // Inheritance — calls Person constructor
    this.#studentId  = studentId;
    this.#course     = course;
    this.#yearLevel  = yearLevel;
    this.#grades     = grades;
    this.id          = Date.now() + Math.random(); // unique internal id
  }

  // Getters (Encapsulation)
  getStudentId()  { return this.#studentId;  }
  getCourse()     { return this.#course;     }
  getYearLevel()  { return this.#yearLevel;  }
  getGrades()     { return { ...this.#grades }; } // returns copy

  setStudentId(v)  { this.#studentId = v;  }
  setCourse(v)     { this.#course    = v;  }
  setYearLevel(v)  { this.#yearLevel = v;  }
  setGrades(v)     { this.#grades    = v;  }

  // ABSTRACTION — GPA computation hidden inside method
  computeGPA() {
    const g = this.#grades;
    const scores = [g.math, g.science, g.english, g.filipino, g.pe, g.elective]
      .map(Number)
      .filter(n => !isNaN(n));
    if (scores.length === 0) return 0;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    // Convert 100-point scale to 5.0 GPA scale (Philippine system)
    if (avg >= 97) return 1.0;
    if (avg >= 94) return 1.25;
    if (avg >= 91) return 1.5;
    if (avg >= 88) return 1.75;
    if (avg >= 85) return 2.0;
    if (avg >= 82) return 2.25;
    if (avg >= 79) return 2.5;
    if (avg >= 76) return 2.75;
    if (avg >= 75) return 3.0;
    return 5.0; // Failed
  }

  // ABSTRACTION — raw average hidden inside method
  computeAverage() {
    const g = this.#grades;
    const scores = [g.math, g.science, g.english, g.filipino, g.pe, g.elective]
      .map(Number)
      .filter(n => !isNaN(n));
    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // POLYMORPHISM — base version; overridden in HonorStudent
  getGradeLabel() {
    const gpa = this.computeGPA();
    if (gpa === 5.0) return "Failed";
    if (gpa <= 1.5)  return "Excellent";
    if (gpa <= 2.0)  return "Very Good";
    if (gpa <= 2.5)  return "Good";
    if (gpa <= 3.0)  return "Satisfactory";
    return "Needs Improvement";
  }

  // POLYMORPHISM — base version
  getStatusBadge() {
    return { label: "Regular", css: "badge-regular" };
  }

  // Inherited from Person but overridden
  getRole() { return "Student"; }

  // Serialise to plain object for storage
  toObject() {
    return {
      type:       this.getRole(),
      firstName:  this.getFirstName(),
      lastName:   this.getLastName(),
      studentId:  this.#studentId,
      course:     this.#course,
      yearLevel:  this.#yearLevel,
      grades:     this.#grades,
      internalId: this.id,
    };
  }
}


// ─────────────────────────────────────────────
// CLASS 3: HonorStudent  (extends Student)
// PILLAR: INHERITANCE — inherits all Student methods
//         POLYMORPHISM — overrides getGradeLabel() and getStatusBadge()
// ─────────────────────────────────────────────
class HonorStudent extends Student {
  #honorType; // "With Honors" | "With High Honors" | "With Highest Honors"

  constructor(firstName, lastName, studentId, course, yearLevel, grades) {
    super(firstName, lastName, studentId, course, yearLevel, grades);
    this.#honorType = this.#determineHonorType();
  }

  // Private — called internally (Abstraction)
  #determineHonorType() {
    const gpa = this.computeGPA();
    if (gpa <= 1.25) return "With Highest Honors";
    if (gpa <= 1.50) return "With High Honors";
    return "With Honors";
  }

  getHonorType() { return this.#honorType; }

  // POLYMORPHISM — overrides Student's getGradeLabel()
  getGradeLabel() {
    return this.#honorType; // e.g. "With Highest Honors"
  }

  // POLYMORPHISM — overrides Student's getStatusBadge()
  getStatusBadge() {
    const map = {
      "With Honors":         { label: "🏅 With Honors",         css: "badge-honors"  },
      "With High Honors":    { label: "🥈 With High Honors",    css: "badge-high"    },
      "With Highest Honors": { label: "🥇 With Highest Honors", css: "badge-highest" },
    };
    return map[this.#honorType] ?? { label: "Honor Student", css: "badge-honors" };
  }

  getRole() { return "HonorStudent"; }
}


// ─────────────────────────────────────────────
// CLASS 4: StudentManager
// PILLAR: ENCAPSULATION — manages the student list internally
//         ABSTRACTION  — CRUD operations exposed as clean methods
// ─────────────────────────────────────────────
class StudentManager {
  #students = []; // private list (Encapsulation)

  // Factory method — decides Regular vs Honor (Abstraction)
  #createStudent(data) {
    const { firstName, lastName, studentId, course, yearLevel, grades } = data;
    // Temporarily create a Student to check eligibility
    const temp = new Student(firstName, lastName, studentId, course, yearLevel, grades);
    const gpa  = temp.computeGPA();
    // GPA ≤ 2.0 qualifies for honor recognition
    if (gpa !== 5.0 && gpa <= 2.0) {
      return new HonorStudent(firstName, lastName, studentId, course, yearLevel, grades);
    }
    return temp;
  }

  addStudent(data) {
    const student = this.#createStudent(data);
    this.#students.push(student);
    return student;
  }

  deleteStudent(internalId) {
    this.#students = this.#students.filter(s => s.id !== internalId);
  }

  updateStudent(internalId, data) {
    const idx = this.#students.findIndex(s => s.id === internalId);
    if (idx === -1) return null;
    const updated = this.#createStudent(data);
    updated.id = internalId; // preserve original id
    this.#students[idx] = updated;
    return updated;
  }

  getAll() { return [...this.#students]; }

  getById(internalId) {
    return this.#students.find(s => s.id === internalId) ?? null;
  }

  // Search & filter (Abstraction — logic hidden here)
  search(query, yearFilter, statusFilter) {
    const q = query.toLowerCase();
    return this.#students.filter(s => {
      const matchQuery =
        !q ||
        s.getFullName().toLowerCase().includes(q) ||
        s.getStudentId().toLowerCase().includes(q) ||
        s.getCourse().toLowerCase().includes(q);

      const matchYear =
        !yearFilter || String(s.getYearLevel()) === String(yearFilter);

      const matchStatus =
        !statusFilter ||
        (statusFilter === "honor"   && s instanceof HonorStudent) ||
        (statusFilter === "regular" && !(s instanceof HonorStudent));

      return matchQuery && matchYear && matchStatus;
    });
  }

  getTotalCount()  { return this.#students.length; }

  getHonorCount()  {
    return this.#students.filter(s => s instanceof HonorStudent).length;
  }

  getAverageGPA() {
    if (this.#students.length === 0) return 0;
    const total = this.#students.reduce((sum, s) => sum + s.computeGPA(), 0);
    return (total / this.#students.length).toFixed(2);
  }
}


// ─────────────────────────────────────────────
// CLASS 5: UIRenderer
// PILLAR: ABSTRACTION — hides all DOM rendering logic
//         ENCAPSULATION — DOM methods grouped in one place
// ─────────────────────────────────────────────
class UIRenderer {
  static renderCard(student) {
    const gpa    = student.computeGPA();
    const avg    = student.computeAverage().toFixed(1);
    const badge  = student.getStatusBadge();
    const label  = student.getGradeLabel();
    const grades = student.getGrades();
    const isHonor = student instanceof HonorStudent;

    return `
      <div class="student-card ${isHonor ? "honor-card" : ""}" data-id="${student.id}">
        <div class="card-header">
          <div class="avatar">${student.getFirstName()[0]}${student.getLastName()[0]}</div>
          <div class="card-info">
            <h3 class="student-name">${student.getFullName()}</h3>
            <p class="student-meta">${student.getStudentId()} · ${student.getCourse()} · Year ${student.getYearLevel()}</p>
          </div>
          ${isHonor ? '<div class="honor-star">⭐</div>' : ''}
        </div>

        <div class="grades-mini">
          ${UIRenderer.#gradeChip("Math",    grades.math)}
          ${UIRenderer.#gradeChip("Sci",     grades.science)}
          ${UIRenderer.#gradeChip("Eng",     grades.english)}
          ${UIRenderer.#gradeChip("Fil",     grades.filipino)}
          ${UIRenderer.#gradeChip("PE",      grades.pe)}
          ${UIRenderer.#gradeChip("Elec",    grades.elective)}
        </div>

        <div class="card-footer">
          <div class="gpa-block">
            <span class="gpa-num">${gpa.toFixed(2)}</span>
            <span class="gpa-sub">GPA · Avg ${avg}</span>
          </div>
          <span class="badge ${badge.css}">${badge.label}</span>
        </div>

        <div class="card-label">${label}</div>

        <div class="card-actions">
          <button class="btn-icon edit"   onclick="editStudent(${student.id})">✏️ Edit</button>
          <button class="btn-icon view"   onclick="viewStudent(${student.id})">👁 View</button>
          <button class="btn-icon delete" onclick="deleteStudent(${student.id})">🗑 Delete</button>
        </div>
      </div>
    `;
  }

  static #gradeChip(subject, score) {
    const n = Number(score);
    const cls = n >= 90 ? "chip-a" : n >= 80 ? "chip-b" : n >= 75 ? "chip-c" : "chip-f";
    return `<span class="grade-chip ${cls}">${subject}: ${n}</span>`;
  }

  static renderTableRow(student) {
    const gpa   = student.computeGPA();
    const avg   = student.computeAverage().toFixed(1);
    const badge = student.getStatusBadge();
    const label = student.getGradeLabel();
    const isHonor = student instanceof HonorStudent;

    return `
      <tr class="${isHonor ? "honor-row" : ""}">
        <td>${student.getStudentId()}</td>
        <td>${student.getFullName()}</td>
        <td>${student.getCourse()}</td>
        <td>Year ${student.getYearLevel()}</td>
        <td><strong>${gpa.toFixed(2)}</strong></td>
        <td>${avg}</td>
        <td><span class="badge ${badge.css}">${badge.label}</span></td>
        <td class="action-cell">
          <button class="btn-icon edit"   onclick="editStudent(${student.id})">✏️</button>
          <button class="btn-icon view"   onclick="viewStudent(${student.id})">👁</button>
          <button class="btn-icon delete" onclick="deleteStudent(${student.id})">🗑</button>
        </td>
      </tr>
    `;
  }

  static renderModal(student) {
    const grades  = student.getGrades();
    const badge   = student.getStatusBadge();
    const isHonor = student instanceof HonorStudent;

    const rows = Object.entries(grades).map(([sub, score]) => `
      <tr>
        <td>${sub.charAt(0).toUpperCase() + sub.slice(1)}</td>
        <td>${score}</td>
        <td>${Number(score) >= 75 ? "✅ Pass" : "❌ Fail"}</td>
      </tr>`).join("");

    return `
      <div class="modal-student">
        <div class="modal-avatar">${student.getFirstName()[0]}${student.getLastName()[0]}</div>
        <h2>${student.getFullName()}</h2>
        <p>${student.getStudentId()} · ${student.getCourse()} · Year ${student.getYearLevel()}</p>
        <span class="badge ${badge.css}">${badge.label}</span>
        ${isHonor ? `<p class="honor-note">🏆 ${student.getHonorType()}</p>` : ""}
      </div>
      <table class="modal-table">
        <thead><tr><th>Subject</th><th>Score</th><th>Remark</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="modal-gpa">
        GPA: <strong>${student.computeGPA().toFixed(2)}</strong> &nbsp;|&nbsp;
        Average: <strong>${student.computeAverage().toFixed(2)}</strong> &nbsp;|&nbsp;
        Remark: <strong>${student.getGradeLabel()}</strong>
      </div>
    `;
  }
}
