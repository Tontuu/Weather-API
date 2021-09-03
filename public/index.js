async function getWeather() {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			const api_url = `weather/${lat},${lon}`;
			const response = await fetch(api_url);
			const data = await response.json();

			const root = document.createElement("div");
			const country = document.createElement("div");
			const region = document.createElement("div");
			const geo = document.createElement("div");
			const condition = document.createElement("div");
			const linebreak = document.createElement("br");
			const checkinButton = document.createElement("button");

			root.id = "root";
			country.textContent = `Country: ${data.location.country}`;
			region.textContent = `Region: ${data.location.region}`;
			geo.textContent = `Coords: ${data.location.lat}, ${data.location.lon}`;
			condition.id = "condition";
			condition.textContent = `Current Weather: ${data.current.condition.text}`;
			checkinButton.id = "checkin";
			checkinButton.type = "submit";
			checkinButton.textContent = "Check in";

			root.append(country, region, geo, condition);
			document.body.append(root, linebreak);
			document.body.append(checkinButton);

			async function sendToLogs() {
				const alertDiv = document.createElement("div");
				const options = {
					method: "POST",
					body: JSON.stringify(data),
					headers: { "Content-type": "application/json" },
				};

				checkinButton.style.visibility = "hidden";
				alertDiv.textContent = "Added to logs!";
				alertDiv.id = "alertDiv";
				document.body.append(alertDiv);

				const response = await fetch("/database", options);
			}

			checkinButton.addEventListener("click", sendToLogs);
		});
	} else {
		alert("Geolocation is not available!");
	}
}

getWeather();
