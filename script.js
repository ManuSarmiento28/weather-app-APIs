let locationField, btn;
let weatherText, outfitText;

let sunEl, cloudEl, rainLayer;
let rainInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  locationField = document.querySelector("#location");
  btn = document.querySelector("#btn");

  weatherText = document.querySelector("#weatherText");
  outfitText = document.querySelector("#outfitText");

  sunEl = document.querySelector("#sun");
  cloudEl = document.querySelector("#cloud");
  rainLayer = document.querySelector("#rain");

  btn.addEventListener("click", getWeather);
});

function getWeather() {
  const place = locationField.value.trim();
  if (!place) return;

  weatherText.textContent = "Loading...";
  outfitText.textContent = "";

  const key = "YH5QF5SWJL5LZ8SFPZFT2RCC2";
  const url =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
    encodeURIComponent(place) +
    `?unitGroup=us&key=${key}&contentType=json`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const today = data.days[0];

      const temp = today.temp;
      const conditions = today.conditions.toLowerCase();
      const rainChance = today.precipprob;

      weatherText.textContent =
        `${Math.round(temp)}°F - ${today.conditions}`;

      outfitText.textContent =
        "Recommendation: " + getOutfit(temp, rainChance);

      updateVisuals(conditions, rainChance, temp);
    })
    .catch(err => {
      weatherText.textContent = "Error loading weather.";
    });
}

function getOutfit(temp, rainChance) {
  let suggestion = "";

  if (temp < 40) suggestion = "Wear a heavy coat.";
  else if (temp < 60) suggestion = "Wear a jacket.";
  else if (temp < 80) suggestion = "Light clothes are fine.";
  else suggestion = "Very light clothes.";

  if (rainChance > 50) suggestion += " Bring an umbrella.";

  return suggestion;
}

function updateVisuals(conditions, rainChance, temp) {
  // reset everything
  sunEl.style.opacity = 0;
  cloudEl.style.opacity = 0;
  stopRain();

  // RAIN
  if (conditions.includes("rain") || rainChance > 60) {
    document.body.style.background = "rgb(40,50,70)";
    cloudEl.style.opacity = 1;
    startRain();
    return;
  }

  // CLOUDY
  if (conditions.includes("cloud") || conditions.includes("overcast")) {
    document.body.style.background = "gray";
    cloudEl.style.opacity = 1;
    return;
  }

  // SUNNY
  document.body.style.background = temp > 80 ? "orange" : "skyblue";
  sunEl.style.opacity = 1;
}

function startRain() {
  rainInterval = setInterval(() => {
    createDrop();
  }, 150);
}

function stopRain() {
  if (rainInterval) clearInterval(rainInterval);
  rainInterval = null;
  rainLayer.innerHTML = "";
}

function createDrop() {
  const drop = document.createElement("div");
  drop.className = "drop";
  drop.style.left = Math.random() * 100 + "vw";
  drop.style.top = "-20px";

  const duration = 0.8 + Math.random();
  drop.style.animationDuration = duration + "s";

  rainLayer.appendChild(drop);

  setTimeout(() => drop.remove(), duration * 1000);
}