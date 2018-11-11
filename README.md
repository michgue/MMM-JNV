# MMM-JNV
Station monitor for the Jena/Germany local transport (JNV) bus and tram system. The monitor will show the departures for the next 60 minutes.

This module is an extension of the [MagicMirror²](https://github.com/MichMich/MagicMirror) project by [MichMich](https://github.com/MichMich/).

The CSS I took from [MMM-DVB](https://github.com/skastenholz/MMM-DVB) module by [skastenholz](https://github.com/skastenholz), was the easy way to got a good design of the table.

ToDo: Picture

## Instalation

1. Navigate into your MagicMirror's `modules` folder.
1. Execute `git clone https://github.com/michgue/MMM-JNV.git`.
1. Execute `cd MMM-JNV`.
1. Execute `npm install`.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

````javascript
modules: [
	{
		module: "MMM-JNV",
		position: "top_left", // This can be any of the regions. Best results in left or right regions.
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
	},
]
````
## Configuration options

The following properties can be configured:


| Option                       | Description
| ---------------------------- | -----------
| `stopName`                   | The stop name you can find at https://www.nahverkehr-jena.de. when you use the station monitor. 
| `timeOffset`                 | The time you will need to reach the stop in minutes. **Default value:** '0'
| `resultNum`                  | The number of displayed results. **Default value:** '5'
| `lines []`                   | Select the displayed lines. **Default value:** []
| `updateIntervall`            | Update intervall **Default value:** `60000` (1 minute)

