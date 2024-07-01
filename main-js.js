import { response } from "express";

const handleImgChange = (url) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    // img.crossOrigin = 'Anonymous'; // Set the crossOrigin attribute
    img.src = url;
    img.addEventListener('load', function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    })

    document.getElementsByTagName("html")[0].style.height = 'fit-content';
}
document.addEventListener("DOMContentLoaded", function () {
    // var corsAttr = new EnableCorsAttribute("*", "*", "*");
    // config.EnableCors(corsAttr);


    fetch('init.png')
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();

            reader.addEventListener('load', function() {
                localStorage.setItem('img', reader.result);
                handleImgChange(localStorage.getItem('img'));
            }, false);

            reader.readAsDataURL(blob);
        })
        .catch(e => console.error('error fetching image', error));

    // const reader = new FileReader();

    // reader.addEventListener('load', function() {
    //     localStorage.setItem("img", reader.result);
    //     handleImgChange(localStorage.getItem("img"))
    // }, false)

    // if ('init.png') 
    //     reader.readAsDataURL('init.png')
})


handleInputChange = () => {
    file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener('load', function() {
        localStorage.setItem("img", reader.result);
        handleImgChange(localStorage.getItem("img"))
    }, false)

    if (file) 
        reader.readAsDataURL(file)
}

handleCopyClick = () => {
    var copyText = document.getElementById("generated-text").innerHTML;
    navigator.clipboard.writeText(copyText)
    alert("Copied!")
}

rgbToGrayScale = (r, g, b) => {
    return r * 0.299 + g * 0.587 + b * 0.114
}

handleGenerateTextClick = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const allData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const text = "";

    const textWidth = 100;

    if(canvas.width <= textWidth) {
        for (i = 0; i < canvas.height; i++) {
            for (j = 0; j < canvas.width; j++) {
                index = (i * canvas.width + j) * 4
                text += rgbToGrayScale(allData[index], allData[index + 1], allData[index + 2])
            }
            text += "\n"
        }
    } else {
        ySkip = Math.floor(canvas.height / textWidth)
        xSkip = Math.floor(canvas.width / textWidth)

        for (i = 0; i < ySkip; i++) {
            for (j = 0; j < xSkip; j++) {
                index = ((i * ySkip) * canvas.width + (j * xSkip)) * 4
                text += rgbToGrayScale(allData[index], allData[index + 1], allData[index + 2])
            }
            text += "\n"
        }
    }


    console.log(text)
}