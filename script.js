(function () {
	const wsgParser = new WSGParser(
		function() {
			showJSON()
		}
	)

	function copyToClipboard(e) {
		// Select the text field
		e.select();
		e.setSelectionRange(0, 99999); // For mobile devices
	
		// Copy the text inside the text field
		navigator.clipboard.writeText(e.value);  
	}

	function showJSON() {
		let json = wsgParser.getJSON()
		document.getElementById('output').value = json
	}

	function showCSV() {
		let csv = wsgParser.getCSV()
		document.getElementById('output').value = csv
	}

	document.getElementById('json-button').addEventListener(
		"click",
		function () {
			showJSON()
		}.bind(wsgParser)
	);
	document.getElementById('csv-button').addEventListener(
		"click",
		function () {
			showCSV()
		}.bind(wsgParser)
	);

	document.getElementById('copy-button').addEventListener(
		"click",
		function () {
			let e = document.getElementById("output")
			copyToClipboard(e)
			document.getElementById("copy-button").classList.add('visited') 
		}
	);
})();