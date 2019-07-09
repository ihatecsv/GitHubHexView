const lineLength = 32;

const bufferToHex = function(array){
	let finalHex = "";
	for(let i = 0; i < array.length; i++){
		const currentLine = i.toString(16).padStart(8, "0");
		const currentByte = array[i].toString(16).padStart(2, "0");
		if(i % lineLength == 0) finalHex += "<span class=\"githubhexview-codenumber\">" + currentLine + ": </span>";
		finalHex += currentByte;
		if((i + 1) % 2 == 0) finalHex += " ";
		if(i != 0 && (i+1) % lineLength == 0) finalHex += "<br>";
	}
	return finalHex;
}

const xpath = "//a[text()='View raw']";
const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
const rawURL = matchingElement.href;

const codeElement = document.createElement("code");
codeElement.className = "githubhexview-code";

matchingElement.before(codeElement);

fetch(rawURL)
    .then((resp) => resp.arrayBuffer())
    .then(function(data){
		const typedData = new Uint8Array(data);
		codeElement.innerHTML = bufferToHex(typedData);
		matchingElement.parentElement.className = "githubhexview-container";
		matchingElement.remove();
    }).catch(function(error){
        alert(error);
    });
