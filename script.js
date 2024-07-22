"use strict";

const displayInputs = document.querySelector(".inputs h2");
const displayResult = document.querySelector(".current-calculation h2");
const btnContainer = document.querySelector(".buttons-container");

let displayValue = "";
let count = 0;
let inputCount = 0;

// Function to update the display with the number or operator
const displayNumber = function (number) {
  if (number === "=" || number === "+/-") return;
  displayValue += number;
  displayInputs.textContent = displayValue;
};

// Function to clear the display and reset values
const clearDisplay = function () {
  displayValue = "";
  displayInputs.textContent = "";
  displayResult.textContent = "";
};

// Function to calculate the result and handle errors
const calculateResult = function () {
  try {
    const result = eval(displayValue);
    displayValue = result.toString(); // Convert result to string
    storeData(displayInputs.textContent, displayValue);
    displayInputs.textContent = result;
    displayResult.textContent = "";
  } catch (error) {
    displayResult.textContent = "Error";
  }
};

// Function to update the result based on the current display value
const calculations = function () {
  try {
    displayResult.textContent = eval(displayValue);
  } catch (error) {
    displayResult.textContent = "Error";
  }
};

// Function to store data in the browser
const storeData = function (calc, res) {
  // Retrieve existing history from localStorage or initialize an empty array if not found
  const existingHistory = JSON.parse(localStorage.getItem("history")) || [];

  // Add the new calculation and result to the history
  existingHistory.push({
    calc: calc,
    result: res,
  });

  // Save the updated history back to localStorage
  localStorage.setItem("history", JSON.stringify(existingHistory));
};

// Function to display the history
const displayHistory = function () {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const historyList = document.querySelector(".history-list");
  historyList.innerHTML = "";
  history.forEach((item) => {
    const listItem = document.createElement("div");
    listItem.classList.add("history-item");
    listItem.innerHTML = `<span>${item.calc}</span><span>= ${item.result}</span>`;
    historyList.appendChild(listItem);
  });
};

// Function to clear the history
const clearHistory = function () {
  localStorage.removeItem("history");
  displayHistory();
};

// Function to handle keyboard input

// Handle button click events
const handleButtonClick = function (event) {
  let input = event.target.textContent;
  if (input[0] === "0" && inputCount === 0) return;

  switch (input) {
    case "AC":
      clearDisplay();
      count = 0;
      inputCount = 0;
      break;

    case "=":
      calculateResult();
      count = 0;
      break;

    case "Del":
      displayValue = displayValue.toString().slice(0, -1); // Ensure displayValue is a string
      displayInputs.textContent = displayValue;
      if (count >= 1) calculations();
      break;

    case "+/-":
      displayValue = (-1 * parseFloat(displayValue)).toString(); // Convert result to string
      displayInputs.textContent = displayValue;
      inputCount = 0;
      break;

    case "%":
      displayNumber(input);
      displayInputs.textContent = displayValue;
      displayValue = (parseFloat(displayValue) / 100).toString();
      calculations();
      // displayResult.textContent = displayValue;
      inputCount = 0;
      count++;
      break;

    case ".":
      displayNumber(input);
      break;

    case "+":
    case "-":
    case "*":
    case "/":
      calculations();
      displayNumber(input);
      count++;
      inputCount = 0;
      break;

    default:
      displayNumber(input);
      if (count >= 1) calculations();
      inputCount++;
      break;
  }
};

// Handle keyboard events
const handleKeyboardInput = function (event) {
  let input = event.key;
  if (input === "0" && inputCount === 0) return;

  switch (input) {
    case "Escape":
      clearDisplay();
      count = 0;
      inputCount = 0;
      break;

    case "Enter":
      calculateResult();
      count = 0;
      break;

    case "Backspace":
      displayValue = displayValue.toString().slice(0, -1); // Ensure displayValue is a string
      displayInputs.textContent = displayValue;
      if (count >= 1) calculations();
      break;

    case "+":
    case "-":
    case "*":
    case "/":
      calculations();
      displayNumber(input);
      count++;
      inputCount = 0;
      break;

    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      displayNumber(input);
      if (count >= 1) calculations();
      inputCount++;
      break;

    case "%":
      displayNumber(input);
      displayInputs.textContent = displayValue;
      displayValue = (parseFloat(displayValue) / 100).toString();
      calculations();
      // displayResult.textContent = displayValue;
      inputCount = 0;
      count++;
      break;

    case ".":
      displayNumber(input);
      break;

    default:
      break;
  }
};

// Add event listeners to buttons
const btnList = btnContainer.querySelectorAll(".btn");
btnList.forEach((btn) => btn.addEventListener("click", handleButtonClick));

// Add event listener to document for keyboard inputs
document.addEventListener("keydown", handleKeyboardInput);

//Add event listeners to display History
document.querySelector(".btn-history").addEventListener("click", function () {
  const btn = document.querySelector(".history-container");
  btn.classList.toggle("hidden");

  displayHistory();

  //Add event listeners to clear History
  document
    .querySelector(".btn__del-history")
    .addEventListener("click", function () {
      clearHistory();
      btn.classList.toggle("hidden");
    });
});
