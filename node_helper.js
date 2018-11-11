/* Magic Mirror
 * Node Helper: MMM-JNV
 *
 * By 
 * MIT Licensed.
 */
var http = require("https");
var cheerio = require('cheerio');
var cheerioTableparser = require("cheerio-tableparser");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		const self = this;
		var options = {
		host: 'www.nahverkehr-jena.de', path: '/fahrplan/haltestellenmonitor.html?tx_akteasygojenah_stopsmonitor%5BstopName%5D=' + this.replaceUml(payload.stopName) + '&cHash=dcc07b6cb9342730165a339f3fc4c0e7'
		};
		// console.log("MMM-Helper: " + options.path);
		if (notification === "MMM-JNV-REQUEST") {
			var req = http.get(options, function (http_res) {
				// initialize the container for our data
				var data = "";
				http_res.setEncoding('utf-8');
				// this event fires many times, each time collecting another piece of the response
				http_res.on("data", function (chunk) {
					// append this chunk to our growing `data` var
					data += chunk;
				});
				// this event fires *one* time, after all the `data` events/chunks have been gathered
				http_res.on("end", function () {
					// you can use res.send instead of console.log to output via express
					// snip only the table section
					var posStart = data.indexOf("<table");
					var posEnd = data.indexOf("</table>") + 8;
					data = data.substring(posStart, posEnd);
					// replace all /" with /'
					data = data.replace(/"/g,"'");
					//
					$ = cheerio.load(data);
					cheerioTableparser($);
					result = $("#monitoringResult").parsetable(true, true, true);
					//
					var line = result[0];
					var direction = result[1];
					var departure = result [2];
					//
					var responce = {
						line: line,
						direction: direction,
						departure: departure
					};
					
					var outTable = self.rotateTable(responce, payload);
					// console.log(outTable[1]);
					
					self.sendNotificationTest(outTable);
				});			
			});
		}
	},

	// Example function send notification test
	sendNotificationTest: function(payload) {
		var notification = "MMM-JNV-RESPONCE";
		//console.log("Responce notification system. Notification:", notification, "payload: ", payload);
		this.sendSocketNotification("MMM-JNV-RESPONCE", payload);
	},

	replaceUml: function(name) {
		var stopName = name;
		stopName = stopName.replace(/Ä/g,"%C3%84");
		stopName = stopName.replace(/Ö/g,"%C3%96");
		stopName = stopName.replace(/Ü/g,"%C3%9C");
		stopName = stopName.replace(/ß/g,"%C3%9F");
		stopName = stopName.replace(/ä/g,"%C3%A4");
		stopName = stopName.replace(/ö/g,"%C3%B6");
		stopName = stopName.replace(/ü/g,"%C3%BC");		
		return stopName;
	},
	
	// Rotation of table
	rotateTable: function(table, payload) {
		const self = this;
		// remove first line (only the header), rotate the table at 90 degree
		var i;
		var connections = [];
		var time = [];
		//
		for (i = 1; i < table.line.length; i++) {
			time = table.departure[i].split(" ");
			if (parseInt(time[1])) {
				if (time[1] > payload.timeOffset) {
					if (payload.lines.length === 0 || payload.lines.indexOf(table.line[i]) >= 0) {
					//console.log(payload.lines.indexOf(table.line[i]));	
					connections.push([table.line[i], table.direction[i], table.departure[i], time[1]]);	
					}
				}
			}		
		}

		return connections.slice(0, payload.resultNum);
	}
});
