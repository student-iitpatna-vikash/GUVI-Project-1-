let display = document.getElementById("display");

// Handle button presses
function press(value) {
  display.value += value;
}

// Clear display
function clearDisplay() {
  display.value = "";
}

// Evaluate and save the result
function calculate() {
  try {
    const expression = display.value;
    const result = eval(expression);

    // Show result in the display
    display.value = result;

    // Send to backend
    saveToHistory(expression, result);
  } catch (error) {
    alert("Invalid expression");
  }
}

// Send calculation to backend
async function saveToHistory(expression, result) {
  try {
    await fetch("http://localhost:8080/api/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression, result }),
    });
    fetchHistory(); // Refresh history
  } catch (err) {
    console.error("Error saving to history:", err);
  }
}

// Fetch history from backend
async function fetchHistory() {
  try {
    const res = await fetch("http://localhost:8080/api/history");
    const data = await res.json();
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    // Render each entry
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.expression} = ${item.result}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching history:", err);
  }
}

// Load history on page load
window.onload = fetchHistory;
