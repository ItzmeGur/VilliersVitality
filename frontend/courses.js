document.addEventListener('DOMContentLoaded', () => {
  function getUserRole() {
    return 'teacher';
  }




  const userRole = getUserRole();
  const teacherView = document.getElementById('teacher-view');
  const studentView = document.getElementById('student-view');




  let myClubs = JSON.parse(localStorage.getItem('myClubs')) || [
    { name: 'Chess Club', description: 'Join us to play and learn chess strategies.', time: 'Wednesdays 3-4pm', location: 'Room 101' },
    { name: 'Science Club', description: 'Explore exciting science experiments and projects.', time: 'Fridays 2-3pm', location: 'Lab 3' }
  ];




  if (userRole === 'teacher') {
    teacherView.classList.remove('hidden');
    studentView.classList.add('hidden');




    const otherClubsDiv = document.getElementById('other-clubs');
    const teacherHeader = document.querySelector('.teacher-header');




    const spacer = document.createElement('div');
    spacer.style.flexGrow = '1';




  const createClassBtn = document.createElement('button');
  createClassBtn.id = 'create-class-btn';
  createClassBtn.textContent = 'Create';
  createClassBtn.style.marginTop = '10px';
  createClassBtn.style.padding = '6px 12px';
  createClassBtn.style.border = 'none';
  createClassBtn.style.borderRadius = '4px';
  createClassBtn.style.backgroundColor = 'rgb(177, 31, 54)';
  createClassBtn.style.color = 'white';
  createClassBtn.style.cursor = 'pointer';
  createClassBtn.style.fontWeight = '600';

  // Create Delete Button
  const deleteClassBtn = document.createElement('button');
  deleteClassBtn.id = 'delete-class-btn';
  deleteClassBtn.textContent = 'Delete';
  deleteClassBtn.style.marginTop = '10px';
  deleteClassBtn.style.marginLeft = '10px';
  deleteClassBtn.style.padding = '6px 12px';
  deleteClassBtn.style.border = 'none';
  deleteClassBtn.style.borderRadius = '4px';
  deleteClassBtn.style.backgroundColor = 'rgb(177, 31, 54)';
  deleteClassBtn.style.color = 'white';
  deleteClassBtn.style.cursor = 'pointer';
  deleteClassBtn.style.fontWeight = '600';

  let deleteMode = false;

  deleteClassBtn.addEventListener('click', () => {
    deleteMode = !deleteMode;
    if (deleteMode) {
      deleteClassBtn.style.backgroundColor = 'darkred';
      deleteClassBtn.textContent = 'Cancel Delete';
    } else {
      deleteClassBtn.style.backgroundColor = 'rgb(177, 31, 54)';
      deleteClassBtn.textContent = 'Delete';
    }
    // Re-render clubs to update click handlers for delete mode
    renderTeacherClubs();
  });

  teacherHeader.style.display = 'flex';
  teacherHeader.style.alignItems = 'center';

  createClassBtn.addEventListener('click', () => {
    showCreateClubPopup();
  });




  function renderTeacherClubs() {
    otherClubsDiv.innerHTML = '';

    // Create container for My Clubs
    const myClubsContainer = document.createElement('div');
    const myClubsTitle = document.createElement('h2');
    myClubsTitle.textContent = 'My Clubs';
    myClubsTitle.style.color = 'rgb(177, 31, 54)';
    myClubsTitle.style.marginBottom = '10px';
    myClubsContainer.appendChild(myClubsTitle);

    myClubs.forEach(club => {
      const div = document.createElement('div');
      div.className = 'club-item';

      const nameElem = document.createElement('h3');
      nameElem.textContent = club.name;
      nameElem.style.marginBottom = '8px';

      const descElem = document.createElement('p');
      descElem.textContent = club.description;
      descElem.style.fontWeight = 'normal';
      descElem.style.fontSize = '0.9em';
      descElem.style.color = '#555';

      const timeElem = document.createElement('p');
      timeElem.textContent = `Time: ${club.time}`;
      timeElem.style.fontWeight = 'normal';
      timeElem.style.fontSize = '0.85em';
      timeElem.style.color = '#777';
      timeElem.style.marginTop = '6px';

      const locationElem = document.createElement('p');
      locationElem.textContent = `Location: ${club.location}`;
      locationElem.style.fontWeight = 'normal';
      locationElem.style.fontSize = '0.85em';
      locationElem.style.color = '#777';

      div.appendChild(nameElem);
      div.appendChild(descElem);
      div.appendChild(timeElem);
      div.appendChild(locationElem);

      if (deleteMode) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => {
          showConfirmationPopup(div, `Are you sure you want to delete the club "${club.name}"?`, () => {
            myClubs = myClubs.filter(c => c.name !== club.name);
            // Also remove from availableClubs if present
            let availableClubs = JSON.parse(localStorage.getItem('availableClubs')) || [];
            availableClubs = availableClubs.filter(c => c.name !== club.name);
            localStorage.setItem('myClubs', JSON.stringify(myClubs));
            localStorage.setItem('availableClubs', JSON.stringify(availableClubs));
            deleteMode = false;
            deleteClassBtn.style.backgroundColor = 'rgb(177, 31, 54)';
            deleteClassBtn.textContent = 'Delete';
            renderTeacherClubs();
            // Also update student view if needed
            if (userRole === 'student') {
              renderClubs();
            }
          }, () => {
            // Cancel callback: do nothing, just exit delete mode
            deleteMode = false;
            deleteClassBtn.style.backgroundColor = 'rgb(177, 31, 54)';
            deleteClassBtn.textContent = 'Delete';
            renderTeacherClubs();
          });
        });
      } else {
        div.style.cursor = 'default';
      }

      myClubsContainer.appendChild(div);
    });

    // Create container for Available Clubs
    const availableClubsContainer = document.createElement('div');
    const availableClubsTitle = document.createElement('h2');
    availableClubsTitle.textContent = 'Available Clubs';
    availableClubsTitle.style.color = 'rgb(177, 31, 54)';
    availableClubsTitle.style.margin = '20px 0 10px 0';
    availableClubsContainer.appendChild(availableClubsTitle);

    // Load availableClubs from localStorage
    let availableClubs = JSON.parse(localStorage.getItem('availableClubs')) || [];

    // Filter out clubs that are already in myClubs (by name)
    const myClubNames = new Set(myClubs.map(c => c.name));
    const filteredAvailableClubs = availableClubs.filter(c => !myClubNames.has(c.name));

    filteredAvailableClubs.forEach(club => {
      const div = document.createElement('div');
      div.className = 'club-item';

      const nameElem = document.createElement('h3');
      nameElem.textContent = club.name;
      nameElem.style.marginBottom = '8px';

      const descElem = document.createElement('p');
      descElem.textContent = club.description;
      descElem.style.fontWeight = 'normal';
      descElem.style.fontSize = '0.9em';
      descElem.style.color = '#555';

      const timeElem = document.createElement('p');
      timeElem.textContent = `Time: ${club.time}`;
      timeElem.style.fontWeight = 'normal';
      timeElem.style.fontSize = '0.85em';
      timeElem.style.color = '#777';
      timeElem.style.marginTop = '6px';

      const locationElem = document.createElement('p');
      locationElem.textContent = `Location: ${club.location}`;
      locationElem.style.fontWeight = 'normal';
      locationElem.style.fontSize = '0.85em';
      locationElem.style.color = '#777';

      div.appendChild(nameElem);
      div.appendChild(descElem);
      div.appendChild(timeElem);
      div.appendChild(locationElem);

      availableClubsContainer.appendChild(div);
    });

    otherClubsDiv.appendChild(myClubsContainer);
    otherClubsDiv.appendChild(availableClubsContainer);
  }




    function showCreateClubPopup() {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
      overlay.style.zIndex = '1000';




      const popup = document.createElement('div');
      popup.style.position = 'absolute';
      popup.style.backgroundColor = 'white';
      popup.style.border = '1px solid #ccc';
      popup.style.borderRadius = '8px';
      popup.style.padding = '15px';
      popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      popup.style.zIndex = '1001';
      popup.style.width = '250px';
      popup.style.height = '300px';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';




      const form = document.createElement('form');




      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'Club Name';
      nameInput.required = true;
      nameInput.style.display = 'block';
      nameInput.style.marginBottom = '10px';
      nameInput.style.width = '100%';
      form.appendChild(nameInput);




      const limitInput = document.createElement('input');
      limitInput.type = 'number';
      limitInput.placeholder = 'Limit';
      limitInput.required = true;
      limitInput.style.display = 'block';
      limitInput.style.marginBottom = '10px';
      limitInput.style.width = '100%';
      form.appendChild(limitInput);




      const whenInput = document.createElement('input');
      whenInput.type = 'text';
      whenInput.placeholder = 'Time';
      whenInput.required = true;
      whenInput.style.display = 'block';
      whenInput.style.marginBottom = '10px';
      whenInput.style.width = '100%';
      form.appendChild(whenInput);




      const whereInput = document.createElement('input');
      whereInput.type = 'text';
      whereInput.placeholder = 'Location';
      whereInput.required = true;
      whereInput.style.display = 'block';
      whereInput.style.marginBottom = '10px';
      whereInput.style.width = '100%';
      form.appendChild(whereInput);




      const descInput = document.createElement('textarea');
      descInput.placeholder = 'Description';
      descInput.required = true;
      descInput.style.display = 'block';
      descInput.style.marginBottom = '10px';
      descInput.style.width = '100%';
      descInput.style.height = '60px';
      form.appendChild(descInput);




      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Create';
      submitBtn.style.marginTop = '10px';
      submitBtn.style.padding = '8px 16px';
      submitBtn.style.backgroundColor = 'rgb(177, 31, 54)';
      submitBtn.style.color = 'white';
      submitBtn.style.border = 'none';
      submitBtn.style.borderRadius = '4px';
      submitBtn.style.cursor = 'pointer';
      submitBtn.style.fontWeight = '600';
      form.appendChild(submitBtn);




      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.marginTop = '10px';
      cancelBtn.style.marginLeft = '10px';
      cancelBtn.style.padding = '8px 16px';
      cancelBtn.style.backgroundColor = '#ccc';
      cancelBtn.style.color = '#333';
      cancelBtn.style.border = 'none';
      cancelBtn.style.borderRadius = '4px';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.style.fontWeight = '600';
      form.appendChild(cancelBtn);




      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });




      form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Form submitted");




        try {
          if (!nameInput.value.trim() || !limitInput.value || !whenInput.value.trim() || !whereInput.value.trim() || !descInput.value.trim()) {
            alert('Please fill in all required fields.');
            return;
          }
          const newClub = {
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            time: whenInput.value.trim(),
            location: whereInput.value.trim(),
            limit: parseInt(limitInput.value, 10)
          };
          // Remove adding to myClubs on creation, add only to availableClubs
          let availableClubs = JSON.parse(localStorage.getItem('availableClubs')) || [];
          const clubExistsInAvailableClubs = availableClubs.some(c => c.name === newClub.name);
          if (!clubExistsInAvailableClubs) {
            availableClubs.push(newClub);
            localStorage.setItem('availableClubs', JSON.stringify(availableClubs));
          }




          renderTeacherClubs();
          document.body.removeChild(overlay);
        } catch (error) {
          console.error("Error in form submission:", error);
        }
      });




      popup.appendChild(form);
      overlay.appendChild(popup);
      document.body.appendChild(overlay);
    }




    teacherHeader.appendChild(spacer);
    teacherHeader.appendChild(createClassBtn);
    teacherHeader.appendChild(deleteClassBtn);




    renderTeacherClubs();




  } else if (userRole === 'student') {
    studentView.classList.remove('hidden');
    teacherView.classList.add('hidden');




    // Original 5 clubs as default
    const originalMyClubs = [
      { name: 'Chess Club', description: 'Join us to play and learn chess strategies.', time: 'Wednesdays 3-4pm', location: 'Room 101' },
      { name: 'Science Club', description: 'Explore exciting science experiments and projects.', time: 'Fridays 2-3pm', location: 'Lab 3' }
    ];
    const originalAvailableClubs = [
      { name: 'Drama Club', description: 'Express yourself through acting and theatre.', time: 'Mondays 4-5pm', location: 'Auditorium' },
      { name: 'Math Club', description: 'Challenge your math skills with puzzles and contests.', time: 'Thursdays 3-4pm', location: 'Room 202' },
      { name: 'Art Club', description: 'Unleash your creativity with various art forms.', time: 'Tuesdays 2-3pm', location: 'Art Studio' }
    ];




    let myClubs = JSON.parse(localStorage.getItem('myClubs')) || originalMyClubs;
    let availableClubs = JSON.parse(localStorage.getItem('availableClubs')) || originalAvailableClubs;




    const myClubsList = document.getElementById('my-clubs-list');
    const availableClubsList = document.getElementById('available-clubs-list');




    function saveClubsToStorage() {
      localStorage.setItem('myClubs', JSON.stringify(myClubs));
      localStorage.setItem('availableClubs', JSON.stringify(availableClubs));
    }




    function createClubItem(club, isAvailable) {
      const div = document.createElement('div');
      div.className = 'club-item';




      const nameElem = document.createElement('h3');
      nameElem.textContent = club.name;
      nameElem.style.marginBottom = '8px';




      const descElem = document.createElement('p');
      descElem.textContent = club.description;
      descElem.style.fontWeight = 'normal';
      descElem.style.fontSize = '0.9em';
      descElem.style.color = '#555';




      const timeElem = document.createElement('p');
      timeElem.textContent = `Time: ${club.time}`;
      timeElem.style.fontWeight = 'normal';
      timeElem.style.fontSize = '0.85em';
      timeElem.style.color = '#777';
      timeElem.style.marginTop = '6px';




      const locationElem = document.createElement('p');
      locationElem.textContent = `Location: ${club.location}`;
      locationElem.style.fontWeight = 'normal';
      locationElem.style.fontSize = '0.85em';
      locationElem.style.color = '#777';




      div.appendChild(nameElem);
      div.appendChild(descElem);
      div.appendChild(timeElem);
      div.appendChild(locationElem);




      if (isAvailable) {
        const joinBtn = document.createElement('button');
        joinBtn.textContent = 'Join';
        joinBtn.style.marginTop = '10px';
        joinBtn.style.padding = '6px 12px';
        joinBtn.style.border = 'none';
        joinBtn.style.borderRadius = '4px';
        joinBtn.style.backgroundColor = 'rgb(177, 31, 54)';
        joinBtn.style.color = 'white';
        joinBtn.style.cursor = 'pointer';
        joinBtn.addEventListener('click', () => {
          availableClubs = availableClubs.filter(c => c.name !== club.name);
          myClubs.push(club);
          saveClubsToStorage();
          renderClubs();
        });
        div.appendChild(joinBtn);
      } else {
        if (getUserRole() !== 'teacher') {
          const leaveBtn = document.createElement('button');
          leaveBtn.textContent = 'Leave';
          leaveBtn.style.marginTop = '10px';
          leaveBtn.style.padding = '6px 12px';
          leaveBtn.style.border = 'none';
          leaveBtn.style.borderRadius = '4px';
          leaveBtn.style.backgroundColor = 'rgb(177, 31, 54)';
          leaveBtn.style.color = 'white';
          leaveBtn.style.cursor = 'pointer';




          function showConfirmationPopup(parentDiv, message, onConfirm, onCancel) {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
            overlay.style.zIndex = '1000';




            const popup = document.createElement('div');
            popup.style.position = 'absolute';
            popup.style.backgroundColor = 'white';
            popup.style.border = '1px solid #ccc';
            popup.style.borderRadius = '8px';
            popup.style.padding = '15px';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            popup.style.zIndex = '1001';
            popup.style.width = '250px';
            popup.style.textAlign = 'center';




            const msg = document.createElement('p');
            msg.textContent = message;
            msg.style.marginBottom = '15px';
            popup.appendChild(msg);




            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.display = 'flex';
            buttonsDiv.style.justifyContent = 'space-around';




            const yesBtn = document.createElement('button');
            yesBtn.textContent = 'Yes';
            yesBtn.style.padding = '6px 12px';
            yesBtn.style.border = 'none';
            yesBtn.style.borderRadius = '4px';
            yesBtn.style.backgroundColor = 'rgb(177, 31, 54)';
            yesBtn.style.color = 'white';
            yesBtn.style.cursor = 'pointer';
            yesBtn.addEventListener('click', () => {
              document.body.removeChild(overlay);
              onConfirm();
            });




            const noBtn = document.createElement('button');
            noBtn.textContent = 'No';
            noBtn.style.padding = '6px 12px';
            noBtn.style.border = '1px solid rgb(177, 31, 54)';
            noBtn.style.borderRadius = '4px';
            noBtn.style.backgroundColor = 'white';
            noBtn.style.color = 'rgb(177, 31, 54)';
            noBtn.style.cursor = 'pointer';
            noBtn.addEventListener('click', () => {
              document.body.removeChild(overlay);
              if (onCancel) onCancel();
            });




            buttonsDiv.appendChild(yesBtn);
            buttonsDiv.appendChild(noBtn);
            popup.appendChild(buttonsDiv);




            overlay.appendChild(popup);
            document.body.appendChild(overlay);




            const parentRect = parentDiv.getBoundingClientRect();
            const popupRect = popup.getBoundingClientRect();
            popup.style.top = `${parentRect.top + window.scrollY + (parentRect.height - popupRect.height) / 2}px`;
            popup.style.left = `${parentRect.left + window.scrollX + (parentRect.width - popupRect.width) / 2}px`;




            overlay.addEventListener('click', (e) => {
              if (e.target === overlay) {
                document.body.removeChild(overlay);
                if (onCancel) onCancel();
              }
            });
          }




          leaveBtn.addEventListener('click', () => {
            showConfirmationPopup(div, 'Are you sure you want to leave this club?', () => {
              myClubs = myClubs.filter(c => c.name !== club.name);
              availableClubs.push(club);
              saveClubsToStorage();
              renderClubs();
            });
          });




          div.appendChild(leaveBtn);
        }




        div.addEventListener('click', (event) => {
          if (event.target.tagName === 'BUTTON') return;




          const existingOverlay = document.querySelector('.custom-club-popup-overlay');
          if (existingOverlay) {
            document.body.removeChild(existingOverlay);
          }




          const overlay = document.createElement('div');
          overlay.className = 'custom-club-popup-overlay';
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100vw';
          overlay.style.height = '100vh';
          overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
          overlay.style.zIndex = '2000';
          overlay.style.display = 'flex';
          overlay.style.justifyContent = 'center';
          overlay.style.alignItems = 'center';




          const popup = document.createElement('div');
          popup.style.backgroundColor = 'white';
          popup.style.borderRadius = '10px';
          popup.style.padding = '30px';
          popup.style.width = '90vw';
          popup.style.height = '90vh';
          popup.style.overflowY = 'auto';
          popup.style.position = 'relative';
          popup.style.display = 'flex';
          popup.style.flexDirection = 'column';




          const closeBtn = document.createElement('button');
          closeBtn.textContent = '×';
          closeBtn.style.position = 'absolute';
          closeBtn.style.top = '15px';
          closeBtn.style.right = '15px';
          closeBtn.style.backgroundColor = 'rgb(177, 31, 54)';
          closeBtn.style.color = 'white';
          closeBtn.style.border = 'none';
          closeBtn.style.borderRadius = '50%';
          closeBtn.style.width = '30px';
          closeBtn.style.height = '30px';
          closeBtn.style.fontSize = '20px';
          closeBtn.style.cursor = 'pointer';
          closeBtn.style.fontWeight = 'bold';
          closeBtn.style.lineHeight = '30px';
          closeBtn.style.textAlign = 'center';
          closeBtn.style.userSelect = 'none';
          closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
          });




          const content = document.createElement('div');
          content.style.flex = '1';
          content.style.overflowY = 'auto';




          const title = document.createElement('h2');
          title.textContent = club.name;
          title.style.color = 'rgb(177, 31, 54)';
          title.style.marginBottom = '15px';




          const description = document.createElement('p');
          description.textContent = club.description;
          description.style.fontSize = '1.1em';
          description.style.color = '#333';
          description.style.lineHeight = '1.4';
          description.style.marginBottom = '10px';




          const time = document.createElement('p');
          time.textContent = `Time: ${club.time}`;
          time.style.fontSize = '1.1em';
          time.style.color = '#333';
          time.style.lineHeight = '1.4';
          time.style.marginBottom = '10px';




          const location = document.createElement('p');
          location.textContent = `Location: ${club.location}`;
          location.style.fontSize = '1.1em';
          location.style.color = '#333';
          location.style.lineHeight = '1.4';
          location.style.marginBottom = '10px';




          content.appendChild(title);
          content.appendChild(description);
          content.appendChild(time);
          content.appendChild(location);




          popup.appendChild(closeBtn);
          popup.appendChild(content);
          overlay.appendChild(popup);
          document.body.appendChild(overlay);
        });




      }




      return div;
    }




    function renderClubs() {
      myClubsList.innerHTML = '';
      availableClubsList.innerHTML = '';




      myClubs.forEach(club => {
        myClubsList.appendChild(createClubItem(club, false));
      });




      availableClubs.forEach(club => {
        availableClubsList.appendChild(createClubItem(club, true));
      });
    }




    function reloadClubsFromStorage() {
      myClubs = JSON.parse(localStorage.getItem('myClubs')) || [];
      availableClubs = JSON.parse(localStorage.getItem('availableClubs')) || [];
      renderClubs();
    }




    renderClubs();
  }
});
