const fetch = require("node-fetch");
const express = require("express");
const Datastore = require("nedb");
const database = new Datastore("database.db");
const app = express();
require("dotenv").config();

app.listen(3000, () => console.log("Listening at 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

database.loadDatabase();

app.get("/logs", (request, response) => {
	database.find({}, (err, data) => {
		response.json(data);
		if (err) {
			response.end();
			console.log("Error!!!");
			return;
		}
	});
});

app.get("/weather/:latlon", async (request, response) => {
	const latlon = request.params.latlon.split(",");
	const lat = latlon[0];
	const lon = latlon[1];
	const api_key = process.env.API_KEY;
	const api_url = `http://api.weatherapi.com/v1/
forecast.json?key=${api_key}&q=${lat},${lon}`;
	const fetchResponse = await fetch(api_url);
	const json = await fetchResponse.json();

	response.json(json);
});

app.post("/database", async (request, response) => {
	console.log("Working!");

	const data = request.body;
	const timestamp = Date.now();

	data.timestamp = timestamp;

	const dbData = {
		country: data.location.country,
		region: data.location.region,
		coords: [data.location.lat, data.location.lon],
		weather: data.current.condition.text,
		timestamp: data.timestamp,
	};

	database.insert(dbData);
});
