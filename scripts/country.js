document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

const temperature = parseFloat(document.getElementById('temp').textContent);
const windSpeed = parseFloat(document.getElementById('wind').textContent);

function calculateWindChill(temp, speed) {
  return (13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16)).toFixed(1);
}

 let windChillValue = "N/A";
if (temperature <= 10 && windSpeed > 4.8) {
  windChillValue = calculateWindChill(temperature, windSpeed) + " °C";
}
document.getElementById('chill').textContent = windChillValue;