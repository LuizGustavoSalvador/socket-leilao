const express = require('express');
const fs = require('fs');

const routes = express.Router();

routes.get("/", (req, res) => {
    let indexHtml = fs.readFileSync("././assets/html/index.html", { encoding: 'utf-8' });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml)
  });

  module.exports = routes;