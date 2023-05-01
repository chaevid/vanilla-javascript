const OPENWEATHERMAP_API_KEY = 'ba0a7ac8b4aa1d89506ec1b502dd04cb';
const PROJECT_DOMAIN = 'https://chaevid.github.io/vanilla-javascript';

// Clock
function updateTime() {
  const clock = document.querySelector('.clock');
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

updateTime();
setInterval(updateTime, 1000);

// Name & Greeting
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const greeting = document.querySelector('.greeting');

function saveName(name) {
  localStorage.setItem('name', name);
}

function setName(name) {
  greeting.textContent = `Hello, ${name}!`;
  saveName(name);
  todoInput.style.display = 'block';
}

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  setName(nameInput.value);
  nameInput.value = '';
  nameForm.style.display = 'none';
});

// To-Do List
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.querySelector('.todo-list');

// Hide the todo-input initially
todoInput.style.display = 'none';

// Check if a name is already saved in localStorage
const storedName = localStorage.getItem('name');
if (storedName) {
  setName(storedName);
  nameForm.style.display = 'none';
  todoInput.style.display = 'block';
} else {
  greeting.textContent = '';
}

function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodo(todoText) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const filteredTodos = todos.filter((todo) => todo !== todoText);
  saveTodos(filteredTodos);
  displayTodos(filteredTodos);
}

function addTodo(todoText) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(todoText);
  saveTodos(todos);
  displayTodos(todos);
}

function displayTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    const todoText = document.createElement('span');
    todoText.textContent = todo;
    li.appendChild(todoText);
    const xButton = document.createElement('button');
    xButton.textContent = 'X';
    xButton.classList.add('remove-button');
    xButton.addEventListener('click', () => removeTodo(todo));
    li.appendChild(xButton);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
});

displayTodos(JSON.parse(localStorage.getItem('todos')) || []);

// Background Image
function setBackgroundImage() {
  document.querySelector(
    '.background'
  ).style.backgroundImage = `url('${PROJECT_DOMAIN}/src/bg-image-unsplash.jpg')`;
}

setBackgroundImage();

// Geolocation
function displayLocation(position) {
  const { latitude, longitude } = position.coords;
  getWeather(latitude, longitude);
}

function handleWeatherData(data) {
  const locationElement = document.querySelector('.location');
  const weatherElement = document.querySelector('.weather');
  locationElement.textContent = `${data.name}, ${data.sys.country}`;
  weatherElement.textContent = `${data.weather[0].main}, ${Math.round(
    data.main.temp
  )}°C`;
}

function handleWeatherError(error) {
  console.error('Error fetching weather data:', error);
}

function getWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then(handleWeatherData)
    .catch(handleWeatherError);
}

function handleGeolocationError(error) {
  console.error('Error getting geolocation:', error);
}

function initGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      displayLocation,
      handleGeolocationError
    );
  } else {
    console.error('Geolocation is not supported in this browser.');
  }
}

initGeolocation();
