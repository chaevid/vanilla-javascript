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

function initClock() {
  updateTime();
  setInterval(updateTime, 1000);
}

// Name & Greeting
function saveName(name) {
  localStorage.setItem('name', name);
}

function setName(name) {
  const greeting = document.querySelector('.greeting');
  const nameForm = document.getElementById('name-form');
  const todoInput = document.getElementById('todo-input');

  greeting.textContent = `Hello, ${name}!`;
  saveName(name);
  todoInput.style.display = 'block';
  nameForm.style.display = 'none';
}

function handleNameFormSubmit(e) {
  const nameInput = document.getElementById('name-input');
  e.preventDefault();
  setName(nameInput.value);
  nameInput.value = '';
}

function initNameAndGreeting() {
  const nameForm = document.getElementById('name-form');
  const storedName = localStorage.getItem('name');

  if (storedName) {
    setName(storedName);
  } else {
    const greeting = document.querySelector('.greeting');
    greeting.textContent = '';
  }

  nameForm.addEventListener('submit', handleNameFormSubmit);
}

// To-Do List
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
  const todoList = document.querySelector('.todo-list');
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    const todoTextElement = document.createElement('span');
    todoTextElement.textContent = todo;
    li.appendChild(todoTextElement);
    const xButton = document.createElement('button');
    xButton.textContent = 'X';
    xButton.classList.add('remove-button');
    xButton.addEventListener('click', () => removeTodo(todo));
    li.appendChild(xButton);
    todoList.appendChild(li);
  });
}

function handleTodoFormSubmit(e) {
  const todoInput = document.getElementById('todo-input');
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
}

function initTodoList() {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  todoInput.style.display = 'none';
  displayTodos(JSON.parse(localStorage.getItem('todos')) || []);
  todoForm.addEventListener('submit', handleTodoFormSubmit);
}

// Background Image
function setBackgroundImage() {
  document.querySelector(
    '.background'
  ).style.backgroundImage = `url('${PROJECT_DOMAIN}/src/bg-image-unsplash.jpg')`;
}

// Geolocation
function displayLocation(position) {
  getWeather(position.coords.latitude, position.coords.longitude);
}

function getWeather(latitude, longitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationElement = document.querySelector('.location');
      const weatherElement = document.querySelector('.weather');
      locationElement.textContent = `${data.name}, ${data.sys.country}`;
      weatherElement.textContent = `${data.weather[0].main}, ${Math.round(
        data.main.temp
      )}°C`;
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
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

// Initialize all components
function initApp() {
  initClock();
  initNameAndGreeting();
  initTodoList();
  setBackgroundImage();
  initGeolocation();
}

initApp();
