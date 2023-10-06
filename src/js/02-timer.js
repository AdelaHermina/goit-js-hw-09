import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

document.addEventListener('DOMContentLoaded', () => {
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      console.log(selectedDates[0]);
    },
  };

  const dateTimePicker = document.querySelector('#datetime-picker');
  const startButton = document.querySelector('[data-start]');
  const flatpickrInstance = flatpickr(dateTimePicker, options);
  let countdownInterval;

  dateTimePicker.addEventListener('change', () => {
    const selectedDate = flatpickrInstance.selectedDates[0];

    if (selectedDate < new Date()) {
      Notiflix.Notify.Failure('Please choose a date in the future');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  });

  startButton.addEventListener('click', () => {
    const selectedDate = flatpickrInstance.selectedDates[0];
    if (selectedDate) {
      startCountdown(selectedDate);
    }
  });

  function startCountdown(targetDate) {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeLeft = targetDate - currentTime;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        updateTimer(0, 0, 0, 0);
        Notiflix.Notify.Success('Countdown completed!');
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(timeLeft);
      updateTimer(days, hours, minutes, seconds);
    }, 1000);
  }

  function updateTimer(days, hours, minutes, seconds) {
    const daysSpan = document.querySelector('[data-days]');
    const hoursSpan = document.querySelector('[data-hours]');
    const minutesSpan = document.querySelector('[data-minutes]');
    const secondsSpan = document.querySelector('[data-seconds]');

    daysSpan.textContent = formatTimeUnit(days);
    hoursSpan.textContent = formatTimeUnit(hours);
    minutesSpan.textContent = formatTimeUnit(minutes);
    secondsSpan.textContent = formatTimeUnit(seconds);
  }

  function formatTimeUnit(unit) {
    return unit < 10 ? `0${unit}` : unit;
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
});
