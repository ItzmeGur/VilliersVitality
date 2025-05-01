// Simulate a login role - this would come from your actual backend/database
const userRole = localStorage.getItem("userRole") || "teacher"; // Set to "teacher" or "student"

window.addEventListener("DOMContentLoaded", () => {
  const teacherDashboard = document.getElementById("teacher-dashboard");
  const studentDashboard = document.getElementById("student-dashboard");
  const clubManagementLink = document.getElementById("club-management-link");
  const clubCard = document.getElementById("club-card");

  if (userRole === "teacher") {
    teacherDashboard.classList.remove("hidden");
  } else {
    studentDashboard.classList.remove("hidden");
  }

  const ctx = document.getElementById(
    userRole === "teacher" ? "teacherChart" : "studentChart"
  ).getContext("2d");

  // Function to get last n months names including current month
  function getLastNMonths(n) {
    const months = [];
    const date = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'long' }));
    }
    return months;
  }

  const lastFourMonths = getLastNMonths(4);

  const attendanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: lastFourMonths,
      datasets: [
        {
          label: "Current Attendance",
          data: [85, 95, 65, 80],
          borderColor: "blue",
          tension: 0.4,
          fill: false
        },
        {
          label: "Required Attendance",
          data: [90, 90, 90, 90],
          borderColor: "orange",
          tension: 0.4,
          borderDash: [5, 5],
          fill: false
        },
        {
          label: "Maximum Attendance",
          data: [100, 100, 100, 100],
          borderColor: "green",
          tension: 0.4,
          borderDash: [2, 2],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 110
        }
      }
    }
  });


  // Add event listener to change active link color for club management
  clubManagementLink.addEventListener("click", () => {
    clubManagementLink.classList.add("active");
    // Logic to dynamically update club information can go here
    updateClubCard();
  });
  
  // Function to update the club card dynamically based on the day
  function updateClubCard() {
    const currentDate = new Date();
    const hours = currentDate.getHours();

    // Logic to change club details based on time or conditions
    if (hours >= 16 && hours < 18) {
      clubCard.innerHTML = `<p>🎬 TV & Cinema</p>
                            <p>47 Enrolled Students</p>
                            <p>16:30 – 18:00</p>
                            <p>Location: Hall</p>`;
    } else {
      clubCard.innerHTML = `<p>🏏 Cricket</p>
                            <p>30 Enrolled Students</p>
                            <p>15:20 – 16:10</p>
                            <p>Location: Fields</p>`;
    }
  }

  // Add attendance form submission handler for popup message
  const attendanceForm = document.getElementById("attendance-form");
  if (attendanceForm) {
    attendanceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const checkboxes = attendanceForm.querySelectorAll('input[type="checkbox"]');
      let presentCount = 0;
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          presentCount++;
        }
      });
      const absentCount = checkboxes.length - presentCount;
      alert(`Attendance submitted!\nPresent: ${presentCount}\nAbsent: ${absentCount}\nAttendance chart will be updated shortly.`);
      // Save attendance data to localStorage
      localStorage.setItem('attendanceData', JSON.stringify({ presentCount, absentCount }));
      // Update the attendance chart with new data
      if (attendanceChart) {
        // For simplicity, update the last data point of Current Attendance dataset
        const currentDataset = attendanceChart.data.datasets.find(ds => ds.label === "Current Attendance");
        if (currentDataset) {
          // Replace last data point with percentage of present students
          const total = presentCount + absentCount;
          const attendancePercent = total > 0 ? (presentCount / total) * 100 : 0;
          currentDataset.data[currentDataset.data.length - 1] = attendancePercent;
          attendanceChart.update();
        }
      }
    });
  }

  // On page load, check for saved attendance data and update chart
  const savedAttendanceData = localStorage.getItem('attendanceData');
  if (savedAttendanceData && attendanceChart) {
    const { presentCount, absentCount } = JSON.parse(savedAttendanceData);
    const currentDataset = attendanceChart.data.datasets.find(ds => ds.label === "Current Attendance");
    if (currentDataset) {
      const total = presentCount + absentCount;
      const attendancePercent = total > 0 ? (presentCount / total) * 100 : 0;
      currentDataset.data[currentDataset.data.length - 1] = attendancePercent;
      attendanceChart.update();
    }
  }
});
