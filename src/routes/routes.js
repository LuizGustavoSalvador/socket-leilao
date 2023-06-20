const express = require('express');
const fs = require('fs');

const routes = express.Router();

routes.get("/", (req, res) => {
  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let vehicleComponent = fs.readFileSync('././assets/html/vehicle.html', 'utf-8');

  let vehicleTemplate = fs.readFileSync('././assets/templates/vehicle.html', 'utf-8');

  let vehicles = JSON.parse(fs.readFileSync('./src/data/vehicle.json', 'utf-8'));

  let vehicleHtml = vehicles.map((vehicle) => {
    let vehicleHtml = vehicleTemplate.replace("{{id}}", vehicle.id);
    vehicleHtml = vehicleHtml.replace("{{slug}}", vehicle.slug);
    vehicleHtml = vehicleHtml.replace("{{name}}", vehicle.name);
    vehicleHtml = vehicleHtml.replace("{{brand}}", vehicle.brand);
    vehicleHtml = vehicleHtml.replace("{{year}}", vehicle.year);
    vehicleHtml = vehicleHtml.replace("{{color}}", vehicle.color);
    vehicleHtml = vehicleHtml.replace("{{initialPrice}}", vehicle.initial_price);

    return vehicleHtml;
  });

  if (vehicleHtml.length < 1) {
    vehicleHtml = '<h3 class="no-vehicles">Nenhum veículo cadastrado</h3>';
  } else {
    vehicleHtml = '<div class="list-vehicle">' + vehicleHtml.join("") + '</div>';
  }

  vehicleComponent = vehicleComponent.replace("{{list}}", vehicleHtml);

  indexHtml = indexHtml.replace("{{component}}", vehicleComponent);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexHtml);
});

routes.get("/vehicle/:slug", (req, res) => {
  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let singleVehicle = fs.readFileSync('././assets/html/single-vehicle.html', 'utf-8');

  let vehicle = JSON.parse(fs.readFileSync('./src/data/vehicle.json', 'utf-8')).find(v => v.slug === req.params.slug);

  singleVehicle = singleVehicle.replace("{{id}}", vehicle.id);
  singleVehicle = singleVehicle.replace("{{name}}", vehicle.name);
  singleVehicle = singleVehicle.replace("{{brand}}", vehicle.brand);
  singleVehicle = singleVehicle.replace("{{year}}", vehicle.year);
  singleVehicle = singleVehicle.replace("{{color}}", vehicle.color);
  singleVehicle = singleVehicle.replace("{{initialPrice}}", vehicle.initial_price);
  singleVehicle = singleVehicle.replace("{{min}}", Number(vehicle.initial_price.replace(/[$,]+/g,""))*1000);

  indexHtml = indexHtml.replace("{{component}}", singleVehicle);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexHtml);
});

  module.exports = routes;