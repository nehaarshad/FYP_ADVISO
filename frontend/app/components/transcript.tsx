 // Iram Ghafoor Khan ka real transcript data (from your CSV)
  const iramData = { 
    id: "560339", 
    regNum: "F22-BSCS-105", 
    batch: "Fall 2022", 
    name: "Iram Ghafoor Khan", 
    status: "Probation", 
    cgpa: "2.12",
    transcript: [
      {
        semester: "Semester 1",
        sgpa: "2.08",
        courses: [
          { name: "IICT", grade: "B", cr: "3" },
          { name: "Discrete structure", grade: "D", cr: "3" },
          { name: "Applied Physics", grade: "C", cr: "3" },
          { name: "English Composition & Comp.", grade: "A+", cr: "3" },
          { name: "Programming Fundamentals", grade: "F", cr: "0" },
          { name: "Pre calculs 1", grade: "C", cr: "3" }
        ]
      },
      {
        semester: "Semester 2",
        sgpa: "1.61",
        courses: [
          { name: "Software Engineering", grade: "D", cr: "3" },
          { name: "Calculus & Analytical Geometry", grade: "C", cr: "3" },
          { name: "Presentation & Communication Skills", grade: "B", cr: "3" },
          { name: "Graphics and Animation", grade: "C", cr: "3" },
          { name: "Pakistan Studies", grade: "A", cr: "2" }
        ]
      },
      {
        semester: "Semester 3",
        sgpa: "0.9",
        courses: [
          { name: "Software Requirements Engineering", grade: "D", cr: "3" },
          { name: "Graphic Designing", grade: "C", cr: "3" },
          { name: "Introduction to Psychology", grade: "F", cr: "0" },
          { name: "Linear Algebra", grade: "F", cr: "0" },
          { name: "Islamic Studies", grade: "B", cr: "2" }
        ]
      },
      {
        semester: "Semester 4",
        sgpa: "1.31",
        courses: [
          { name: "Programming Fundamentals (Repeat)", grade: "D", cr: "4" },
          { name: "Pre calculus 2", grade: "F", cr: "0" },
          { name: "Human Computer Interaction", grade: "D", cr: "3" },
          { name: "Quranic Teachings", grade: "B", cr: "2" },
          { name: "Probability & Statistics", grade: "C", cr: "3" }
        ]
      },
      {
        semester: "Semester 5",
        sgpa: "1.05",
        courses: [
          { name: "OOPs", grade: "D", cr: "4" },
          { name: "Software Construction & Dev", grade: "D", cr: "3" },
          { name: "Linear algebra", grade: "W", cr: "0" },
          { name: "Machine Learning", grade: "F", cr: "0" }
        ]
      }
    ],
    roadmap: [
      { name: "Programming Fundamentals", status: "Completed (D)", priority: "Low" },
      { name: "Linear Algebra", status: "Must Repeat", priority: "Critical" },
      { name: "Pre-Calculus 2", status: "Must Repeat", priority: "Critical" },
      { name: "Data Structures", status: "Eligible", priority: "High" },
      { name: "Operating Systems", status: "Locked (Prereq)", priority: "Medium" }
    ]
  };

  const studentDatabase = [iramData];