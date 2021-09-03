async function getData() {
	const response = await fetch("../logs");
	const data = await response.json();
	const myMap = L.map("issMap").setView([15, 50], 1);
	const attribution = `
		&copy;<a href="https://www.openstreetmap.org/copyright">
		OpenStreetMap</a>contributors`;
	const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
	const tiles = L.tileLayer(tileURL, { attribution });

	tiles.addTo(myMap);

	for (item of data) {
		const marker = L.marker([item.coords[0], item.coords[1]]).addTo(myMap);
		const root = document.createElement("div");
		const country = document.createElement("div");
		const region = document.createElement("div");
		const coords = document.createElement("div");
		const dateNow = document.createElement("div");
		const weather = document.createElement("div");
		const dateString = new Date(item.timestamp).toLocaleString();
		const linebreak = document.createElement("br");
		const txt = `${item.country} at the region of ${item.region},
					 the weather here was ${item.weather} and the
					 coords are latitude [${item.coords[0]}] and longitude [${item.coords[1]}]. 
					 The data were collected on ${dateString}.`;
		marker.bindPopup(txt);

		country.textContent = `Country: ${item.country}`;
		region.textContent = `Region: ${item.region}`;
		coords.textContent = `Coords: ${item.coords}`;
		dateNow.textContent = `Date: ${dateString}`;
		weather.textContent = `Weather: ${item.weather}`;
		weather.id = "condition";
		root.id = "root";

		root.append(country, region, coords, dateNow, weather);
		document.body.append(root, linebreak);
	}
}

getData();
