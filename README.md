# MMM-JNV
Station monitor for the Jena/Germany local transport (JNV) bus and tram.

The station name you can find at https://www.nahverkehr-jena.de. when you use the station monitor. 

Add this section to your config.js.

<{
        module: "MMM-JNV",
	position: "top_left", 
	config: {
		stopName: "Emil-Wölk-Straße", // stopName from https://www.nahverkehr-jena.de
		timeOffset: 5, // how many minutes in the future
		resultNum: 5, // number of displayed results
		lines: [
			"1",
			"2",
			"4"], // what lines should be displayed
		updateInterval: 60000	// every minute
	}
},>


