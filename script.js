let nav = 0;
let clicked = null;
let events = localStorage.getItem('events')
  ? JSON.parse(localStorage.getItem('events'))
  : [];

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
// const weekdaysContainer = document.getElementById('weekdays');
// const monthDaysContainer = document.getElementById('monthDays');

function openModal(date) {
  clicked = date;
  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
  }
}

function load() {
  //this will give us the current date
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  //this will give us the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);

  //this will give us the last day of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // this will convert the date to american calendar format
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  // this will index the padding days of the month
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  // this will display the month and year
  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString(
    'en-us',
    { month: 'long' }
  )} ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySqaure = document.createElement('div');
    daySqaure.classList.add('day');

    if (i > paddingDays) {
      daySqaure.innerText = i - paddingDays;

      const eventForDay = events.find(
        (e) => e.date === `${month + 1}/${i - paddingDays}/${year}`
      );

      if (i - paddingDays === day && nav === 0) {
        daySqaure.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySqaure.appendChild(eventDiv);
      }

      daySqaure.addEventListener('click', () =>
        openModal(`${month + 1}/${i - paddingDays}/${year}`)
      );
    } else {
      daySqaure.classList.add('padding');
    }
    calendar.appendChild(daySqaure);
  }
}

function closeModal() {
  newEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  deleteEventModal.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    localStorage.setItem('events', JSON.stringify(events));
  } else {
    eventTitleInput.classList.add('error');
  }
}

//this will initialize the buttons
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    console.log(nav);
    load();
  });
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    console.log(nav);

    load();
  });

  document.getElementById('cancelButton').addEventListener('click', () => {
    closeModal();
  });
  document.getElementById('saveButton').addEventListener('click', () => {
    if (clicked) {
      events.push({
        date: clicked,
        title: eventTitleInput.value,
      });
      localStorage.setItem('events', JSON.stringify(events));
      closeModal();
    }
  });

  document
    .getElementById('deleteButton')
    .addEventListener('click', deleteEvent);

  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();

load();
