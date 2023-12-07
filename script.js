const wsgParser = new WSGParser()
wsgParser.parse();

function copyToClipboard(e) {
	// Select the text field
	e.select();
	e.setSelectionRange(0, 99999); // For mobile devices
  
	 // Copy the text inside the text field
	navigator.clipboard.writeText(e.value);
  
	// Alert
	// ...
  } 

document.getElementById('generate-json-button').addEventListener(
	"click",
	function () {
		wsgParser.generateJSON()
	}.bind(wsgParser)
);
document.getElementById('generate-csv-button').addEventListener(
	"click",
	function () {
		let csv = wsgParser.generateCSV()
		document.getElementById('output').value = csv
		document.querySelector('.results').style.display = 'block'
	}.bind(wsgParser)
);

document.getElementById('copy-button').addEventListener(
	"click",
	function () {
		let e = document.getElementById("output")
		copyToClipboard(e)
	}
);
