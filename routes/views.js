"use strict"
module.exports = app => app.get("/*", (req, res) => res.sendFile("index.html", {root: process.env.FRONT_END}))
