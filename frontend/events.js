document.addEventListener("DOMContentLoaded", () => {
  const calendarBody = document.getElementById("calendarBody");
  const monthYear = document.getElementById("monthYear");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  // Sample events data: keys are 'YYYY-MM-DD', values are arrays of event names
  const events = {
    "2025-04-21": ["Spring break ends"],
    "2025-04-29": ["Multicultural Day", "Esports event"],
    "2025-05-05": ["Bank holiday"],
    "2025-05-12": ["Math Olympiad"],
    "2025-05-18": ["Parent-Teacher Meeting"],
    "2025-05-25": ["Spring Concert"],
    "2025-06-10": ["Drama Club Performance"],
    "2025-06-15": ["Science Fair"],
    "2025-06-21": ["Sports Day"],
    "2025-07-04": ["Summer Festival"],
    "2025-07-20": ["Art Exhibition"],
    "2025-08-01": ["Music Concert"]
  };

  let currentDate = new Date();

  function createPopup() {
    let popup = document.querySelector('.popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.classList.add('popup');
      popup.innerHTML = `
        <span class="popup-close">&times;</span>
        <div class="popup-content"></div>
      `;
      document.body.appendChild(popup);

      popup.querySelector('.popup-close').addEventListener('click', () => {
        popup.classList.remove('show');
      });
    }
    return popup;
  }

  function showPopup(text) {
    const popup = createPopup();
    popup.querySelector('.popup-content').textContent = text;
    popup.classList.add('show');
  }

  function hidePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
      popup.classList.remove('show');
    }
  }

  function renderCalendar(date) {
    calendarBody.innerHTML = ""; // Clear previous calendar
    
    const year = date.getFullYear();
    const month = date.getMonth();

    // Set month and year header
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // First day of the month (0=Sun, 1=Mon, ...), adjust to make Monday=0, Sunday=6
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay + 6) % 7;

    // Number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate total cells needed (including blanks)
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    let day = 1;
    let row = document.createElement("tr"); // Create first row

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("td");

      if (i < firstDay || day > daysInMonth) {
        cell.classList.add("empty");
        cell.innerHTML = "";
      } else {
        const dayStr = day.toString();
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Day number
        const dayNumber = document.createElement("span");
        dayNumber.classList.add("day-number");
        dayNumber.textContent = dayStr;
        cell.appendChild(dayNumber);

        // Check if this day has events
        if (events[dateStr]) {
          cell.classList.add("event-date");
          events[dateStr].forEach(eventName => {
            const eventEl = document.createElement("span");
            eventEl.classList.add("event");
            eventEl.textContent = eventName;
            cell.appendChild(eventEl);
          });

          cell.addEventListener('click', () => {
            showPopup(events[dateStr].join(", "));
          });
        }

        // Highlight today
        const today = new Date();
        if (
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          cell.classList.add("today");
        }

        day++;
      }

      row.appendChild(cell);

      // Add row to calendar body when it's filled with 7 cells (i.e., end of week)
      if (row.children.length === 7) {
        calendarBody.appendChild(row);
        row = document.createElement("tr"); // Create a new row for the next week
      }
    }

    // If there's any leftover days in the last row, add it
    if (row.children.length > 0) {
      calendarBody.appendChild(row);
    }
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    hidePopup();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
    hidePopup();
  });

  renderCalendar(currentDate);
});
