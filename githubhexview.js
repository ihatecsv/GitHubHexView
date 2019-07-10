const lineLength = 32;

const makeAsciiChar = function(value){
	if(value >= 0x20 && value <= 0x7E){
		return String.fromCharCode(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}else{
		return ".";
	}
}

const createHexTable = function(array){
	let finalNumbers = "";
	let finalHex = "";
	let finalAscii = "";
	
	for(let i = 0; i < array.length; i++){
		const currentLine = i.toString(16).padStart(8, "0");
		const currentByte = array[i].toString(16).padStart(2, "0");

		if(i % lineLength == 0) finalNumbers += currentLine;
		finalHex += currentByte;
		finalAscii += makeAsciiChar(array[i]);
		
		if((i != 0 && (i+1) % lineLength == 0)){
			finalNumbers += "<br>";
			finalHex += "<br>";
			finalAscii += "<br>";
		}else if((i + 1) % 2 == 0) finalHex += "&nbsp;";
	}
	return {
		numbers: finalNumbers,
		hex: finalHex,
		ascii: finalAscii
	};
}

const xpath = "//a[text()='View raw']";
const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
const rawURL = matchingElement.href;

const numbersElement = document.createElement("code");
const hexElement = document.createElement("code");
const asciiElement = document.createElement("code");
numbersElement.className = "githubhexview-code githubhexview-codecontext";
hexElement.className = "githubhexview-code";
asciiElement.className = "githubhexview-code githubhexview-codecontext";

matchingElement.before(numbersElement);
matchingElement.before(hexElement);
matchingElement.before(asciiElement);

fetch(rawURL)
    .then((resp) => resp.arrayBuffer())
    .then(function(data){
		const typedData = new Uint8Array(data);
		const completedData = createHexTable(typedData);
		
		numbersElement.innerHTML = completedData.numbers;
		hexElement.innerHTML = completedData.hex;
		asciiElement.innerHTML = completedData.ascii;
		
		matchingElement.parentElement.className = "githubhexview-container";
		matchingElement.remove();
    }).catch(function(error){
        alert(error);
    });
