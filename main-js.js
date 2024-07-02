var textWidth = 50;
var copyText = "";

handleWidthChange = () => {
    textWidth = document.getElementById("width-change").value
    document.getElementById("generate-button").innerHTML = "Generate Text (current text width: " + textWidth + ")"
}

const handleImgChange = (url) => {
    document.getElementById("img-title").innerHTML = "Image to be processed:"
    document.getElementById("generate-button").disabled = false

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    // img.crossOrigin = 'Anonymous'; // Set the crossOrigin attribute
    img.src = url;
    img.addEventListener('load', function() {
        canvas.style.height = img.height / img.width + "%"
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    })

    document.getElementsByTagName("html")[0].style.height = 'fit-content';
}


handleInputChange = () => {
    file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener('load', function() {
        localStorage.setItem("imgURL", reader.result);
        handleImgChange(localStorage.getItem("imgURL"))
    }, false)

    if (file) 
        reader.readAsDataURL(file)
}

handleCopyClick = () => {   
    document.getElementById("copied").style.display = "inline"; 
    navigator.clipboard.writeText(copyText)
}

rgbToGrayScale = (r, g, b) => {
    return Math.floor(r * 0.299 + g * 0.587 + b * 0.114)
}

convertNumberToBrightness = (num) => {
        if(num >= 225) return "☐"
        if(num >= 200) return "◰"
        if(num >= 175) return "◫"
        if(num >= 150) return "▥"
        if(num >= 125) return "◨"
        if(num >= 100) return "◩"
        if(num >= 75) return "▣"
        if(num >= 50) return "▦"
        if(num >= 25) return "▩"
        else return "■."
}

handleGenerateTextClick = () => {
    document.getElementById("copied").style.display = "none"; 
    document.getElementById("copy-button").disabled = false
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const allData = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    var htmlText = "";
    copyText = ""

    if(canvas.width <= textWidth) {  // inputted width is greater than pixel width, will default to pixel width
        console.log("1")
        for (i = 0; i < canvas.height; i++) {
            for (j = 0; j < canvas.width; j++) {
                index = (i * canvas.width + j) * 4
                symbol = convertNumberToBrightness(
                    rgbToGrayScale(allData[index], allData[index + 1], allData[index + 2]))
                htmlText += symbol
                copyText += symbol
            }
            htmlText += "<br>"
            copyText += "\n"
        }
    } else {
        skip = canvas.width / textWidth;

        for (i = 0; i < canvas.height; i += skip) {
            console.log(Math.floor(i )* 4)
            for (j = 0; j < canvas.width; j += skip) {
                index = (Math.floor(i) * canvas.width + Math.floor(j)) * 4
                value = rgbToGrayScale(allData[index], allData[index + 1], allData[index + 2]);
                symbol = convertNumberToBrightness(value);
                htmlText += symbol
                copyText += symbol
            }
            htmlText += "<br>"
            copyText += "\n"
        }
    }

    document.getElementById("generated-text").innerHTML = htmlText
}