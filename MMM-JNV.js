/* global Module */

/* Magic Mirror
 * Module: MMM-JNV
 *
 * By 
 * MIT Licensed.
 */

Module.register("MMM-JNV", {
	defaults: {
		stopName: "Emil-Wölk-Straße", // stopName from https://www.nahverkehr-jena.de
		timeOffset: 0, // how many minutes in the future
        resultNum: 5, // number of displayed results
        lines: [], // what lines should be displayed
		updateInterval: 60000,
		retryDelay: 30000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		var jnv_data = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.getData();
		}, this.config.updateInterval);
	},

	getData: function() {
		var self = this;
		self.processData(self.config);
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	/* Overwrite Dom function
	 * 
	 */
	getDom: function() {
		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		wrapper.appendChild(this.header());
		// If this.jnv_data is not empty
        if (this.jnv_data !== null) {
            wrapper.appendChild(this.connectionTable(this.jnv_data));
			//wrapper.appendChild(this.gotData());
        } else {
            wrapper.appendChild(this.loader());
        }
		//		
		return wrapper;
	},
	
	loader: function() {
        var loader = document.createElement("div");
        loader.innerHTML = this.translate("LOADING");
        loader.className = "small dimmed";
        return loader;
	},
	
	gotData: function() {
		 var loader = document.createElement("div");
        loader.innerHTML = "Hurra!";
        loader.className = "small dimmed";
        return loader;
	},
	
	header: function () {
		var header = document.createElement("header");
        header.innerHTML = this.translate("STOP") + ": " + this.config.stopName;
		return header;
	},
	
	connectionTable: function(connection) {
		var table = document.createElement("table");
		table.classList.add("small", "table");
        table.border = '0';

		if (connection.length >0) {		
			table.appendChild(this.connectionTableHeaderRow());
			table.appendChild(this.connectionTableSpacerRow());

			var self = this;
			connection.forEach(function(connection) {
			table.appendChild(self.connectionTableConnectionRow(connection));
			}); 
		} else {
            table.appendChild(this.connectionTableNoConnectionRow());
		}

		return table;
	},
	
	connectionTableHeaderRow: function() {
        var headerRow = document.createElement("tr");
        headerRow.appendChild(this.connectionTableHeader("LINE"));
        headerRow.appendChild(this.connectionTableHeader("DESTINATION"));
        headerRow.appendChild(this.connectionTableHeader("DEPARTURE"));
        return headerRow;
	},
	
	connectionTableHeader: function(caption) {
        var header = document.createElement("th");
        header.className = caption;
        header.innerHTML = this.translate(caption);
        return header;
    },
	
    connectionTableSpacerRow: function() {
       var spacerRow = document.createElement("tr");
       var spacerHeader = document.createElement("th");
       spacerHeader.className = "spacerRow";
       spacerHeader.setAttribute("colSpan", "3");
       spacerHeader.innerHTML = "";
       spacerRow.appendChild(spacerHeader);
       return spacerRow;
	},

	connectionTableConnectionRow: function(connection) {

       var connectionRow = document.createElement("tr");

       var line = document.createElement("td");
       line.className = "line";
       line.innerHTML = connection[0];
       connectionRow.appendChild(line);

       var destination = document.createElement("td");
       destination.innerHTML = connection[1];
       connectionRow.appendChild(destination);

       var departure = document.createElement("td");
       departure.className = "departure";
       departure.innerHTML = connection[2];
       connectionRow.appendChild(departure);

       return connectionRow;
    },

	getStyles: function () {
		return [
			"MMM-JNV.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		return {
			en: "translations/en.json",
			de: "translations/de.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("MMM-JNV-REQUEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-JNV-RESPONCE") {
			// set dataNotification
			Log.log("Response: " + payload);
            this.jnv_data = payload;
			this.updateDom();
		}
	},
});
