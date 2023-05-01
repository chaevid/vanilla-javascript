const UNSPLASH_API_KEY = 'DYWZDzYyj9BIU9ezT9j00UG8sqjm7KdOzxUQAxoueFs';
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

//
// const savedName = localStorage.getItem('name');
// if (savedName) {
//   nameInput.style.display = 'none';
//   // displayGreeting(savedName);
//   greeting.style.display = 'block';
//   todoInput.style.display = 'block';
// }
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
  fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(
        '.background'
      ).style.backgroundImage = `url(${data.urls.regular})`;
    })
    .catch((error) => {
      console.error('Error fetching background image:', error);
      document.querySelector(
        '.background'
      ).style.backgroundImage = `url('${PROJECT_DOMAIN}/src/bg-image-unsplash.jpg')`;
    });
}

setBackgroundImage();

// Geolocation
function displayLocation(position) {
  const latlonElement = document.querySelector('.latlon');
  latlonElement.textContent = `Lat: ${position.coords.latitude.toFixed(
    2
  )}, Lon: ${position.coords.longitude.toFixed(2)}`;
  getWeather(position.coords.latitude, position.coords.longitude);
}

function getWeather(latitude, longitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      const weatherElement = document.querySelector('.weather');
      weatherElement.textContent = `${data.name}, ${data.sys.country}, ${
        data.weather[0].main
      }, ${Math.round(data.main.temp)}°C`;
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(displayLocation, (error) => {
    console.error('Error getting geolocation:', error);
  });
} else {
  console.error('Geolocation is not supported in this browser.');
}
