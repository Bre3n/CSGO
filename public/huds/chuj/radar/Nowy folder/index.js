// ================================================================================
//
//                              PLEASE READ:
// This project is under a GPL-3 license, you are REQUIRED to publicly publish any
// changes or upgrades you make to the codebase, it strengthens the community.
// Contact the maintainer if you have any questions regarding the license.
//
// ================================================================================

import path from "path"
import { fork } from "child_process"

import { game } from "./loadconfig"
//const window = require("./window")

let hasMap = false
let connTimeout = false
var win = false

let gsi = fork(`${__dirname}/gsi.js`)
let http = fork(`${__dirname}/http.js`)
let socket = fork(`${__dirname}/socket.js`)


function setActivePage(page, win) {
	//if (window.win !== false && !config.window.disable) {
	//	window.win.loadFile(`html/${page}.html`)
	//}

	http.send(page)

	socket.send({
		type: "pageUpdate"
	})
}


gsi.on("message", (message) => {
	socket.send(message)

	if (message.type == "connection") {
		if (message.data.status == "up" && connTimeout === false && game.connectionTimout >= 0) {
			console.info("CSGO has pinged server, connection established")
		}
	}
	else if (!hasMap) {
		if (message.type == "map") {
			setActivePage("map", win)
			hasMap = true

			console.info(`Map ${message.data} selected`)
		}
	}

	if (game.connectionTimout >= 0) {
		clearTimeout(connTimeout)
		connTimeout = setTimeout(() => {
			hasMap = false
			setActivePage("waiting", win)
		}, game.connectionTimout * 1000)
	}
})

/*
if (!config.debug.terminalOnly) {
	window.gsi = gsi
	window.http = http
	window.socket = socket
	window.build()
}
else {
	console.info("Not opening window, terminal only mode is enabled")
}
*/

function cleanup() {
	gsi.kill()
	http.kill()
	//socket.kill()
	//window.app.quit()
}

for (let signal of ["exit", "SIGINT", "SIGUSR1", "SIGUSR2"]) {
	process.on(signal, cleanup)
}
