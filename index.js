const input = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("button[data-start]");
const daysSpan = document.querySelector("span.value[data-days]");
const hoursSpan = document.querySelector("span.value[data-hours]");
const minutesSpan = document.querySelector("span.value[data-minutes]");
const secondsSpan = document.querySelector("span.value[data-seconds]");

let userSelectedDate;
let timerId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);

    //перевірь чи вибрана дата не в минулому і виведи повідомлення
    //  "Please choose a date in the future"
    if (selectedDates[0] <= Date.now()) {
      iziToast.warning({
        title: "Hey",
        message: "Please choose a date in the future",
        color: "red",
      });
      return;
    }
    // запиши значення вибраної дати в userSelectedDate
    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
};
// створюємо новий flatpickr
flatpickr(input, options);

// нижче напиши код для обробки кліку кнопки старт
startBtn.addEventListener("click", onClick);

function onClick() {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const currentTime = Date.now();
const delta = Date.parse(userSelectedDate) - currentTime
 
    if (delta <= 0) {
      clearInterval(timerId);
      timerId = null

      iziToast.success({
        title: "OK",
        message: "Timer is over",
      });

startBtn.disabled = true;
input.disabled = false;

      return;
    }

    const { days, hours, minutes, seconds } = convertMs(delta);

    daysSpan.textContent = pad(days);
    hoursSpan.textContent = pad(hours);
    minutesSpan.textContent = pad(minutes);
    secondsSpan.textContent = pad(seconds);
  }, 1000);
}
//допоміжні функції для обробки мілісекунд
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

function pad(value) {
  return String(value).padStart(2, "0");
}
