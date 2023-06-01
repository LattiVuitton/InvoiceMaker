const SETTINGS_WIDTH = 500;

const itemText = document.getElementById("itemText");
const quantityText = document.getElementById("quantityText");
const priceText = document.getElementById("priceText");
const clearButton = document.getElementById("clear");
const addButton = document.getElementById("add");
const settingsButton = document.getElementById("settings");
const settingsHolder = document.getElementById("settings-holder");
const downloadButton = document.getElementById("downloadText");
const fScreenButton = document.getElementById("fscreen");

var total = 0;

var downloadCount = 1;

var items = []
var itemElements = []

var panelOpen = false;

class Item {
    constructor(description, quantity, price) {
        this.description = description;
        this.quantity = quantity;
        this.price = price;
    }
}

function redden(redElem) {
    // Get the original background color and text color of the element
    var originalBgColor = window.getComputedStyle(redElem).backgroundColor;
    var originalTextColor = window.getComputedStyle(redElem).color;
  
    // Apply the transition effect to the element for both background color and text color
    redElem.style.transition = 'background-color 0.3s, color 0.3s';
  
    // Set the element's background color and text color to red
    redElem.style.backgroundColor = 'rgb(236, 162, 162)';
    redElem.style.color = 'rgb(236, 162, 162)';
  
    // Wait for 3 seconds
    setTimeout(function() {
      // Restore the element's original background color and text color after 3 seconds
      redElem.style.backgroundColor = originalBgColor;
      redElem.style.color = originalTextColor;
    }, 350);
  }

  
function isValidItem(description, quantity, price) {

    validFound = true

    if (!isValidDesc(description)) {
        redden(itemText)
        validFound = false
    }

    if (!isValidDesc(quantity)) {
        redden(quantityText)
        validFound = false
    }

    if (!isValidPrice(price)) {
        redden(priceText)
        validFound = false
    }

    return validFound
}

function isValidPrice(price) {
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return false;
  }
  return true;
}

function isValidDesc(description) {
    for (let i = 0; i < description.length; i++){
        if (description[i] != " ") {
            return true;
        }
    }
    return false;
}

function clear() {
    document.querySelectorAll('.invoiceItem').forEach(e => e.remove());
    items = [];
    total = 0;
    updateSum();
    itemText.value = "";
    quantityText.value = "";
    priceText.value = "";
}

function updateSum() {
    let roundedNumber = parseFloat(total).toFixed(2);
    document.getElementById("sumText").innerHTML = "$ " + roundedNumber
}

function removeElement(element, item) {
    total -= item.price;
    updateSum();
    element.remove();
}

let waitBeforeCreate = true;

function createItem() {
    if (!waitBeforeCreate) {
        return
    }
    waitBeforeCreate = false
    window.setTimeout('waitBeforeCreate = true', 1000)

    const itemsList = document.getElementById("items");

    let description = itemText.value;
    let quantity = quantityText.value;
    let price = parseFloat(priceText.value);

    if (isValidItem(description, quantity, price)) {
        const newItem = new Item(description, quantity, price);
        items.unshift(newItem);
    
        const newP = document.createElement('div');
        newP.className = "invoiceItem"

        const newDesc = document.createElement('p');
        const newQuantity = document.createElement('p');
        const newPrice = document.createElement('p');
        const newDeleteButton = document.createElement('button');

        newDesc.innerHTML = description;
        newQuantity.innerHTML = quantity;

        let roundedPrice = parseFloat(price).toFixed(2);
        newPrice.innerHTML = "$ " + roundedPrice;
        newPrice.style.marginLeft = '5px';

        newDeleteButton.className = 'clearButton';
        newDeleteButton.id = 'clear';
        newDeleteButton.innerHTML = "-";
        newDeleteButton.style.fontSize = '10px';
        newDeleteButton.style.marginRight = '10%';

        newP.append(newDesc);
        newP.append(newQuantity);
        newP.append(newPrice);
        newP.append(newDeleteButton);

        newDeleteButton.style.height = '30px';
        newDeleteButton.style.marginTop = '5px';
        
        itemsList.prepend(newP);
        total += price;
        updateSum()

        itemText.value = ""
        quantityText.value = ""
        priceText.value = ""
        document.getElementById("add2down").innerHTML = ""

        newDeleteButton.addEventListener("click", function () {
            removeElement(newP, newItem);
        })

        const elements = [newDesc, newQuantity, newPrice];

        let maxHeight = 0;
        elements.forEach((element) => {
            const height = element.clientHeight;
            console.log(height)
          if (height > maxHeight) {
            maxHeight = height;
          }
        });
        
        maxHeight = Math.max(40, maxHeight);

        newP.style.marginBottom = '15px'
        newP.style.height = maxHeight + 'px';
    }
}

function open()
{
    document.getElementById("fscreen").style = 'pointer-events: all;';

    if (items.length == 0) {
        document.getElementById("add2down").innerHTML = "No items added"
    }
    
    let screenWidth = SETTINGS_WIDTH;
    if (screen.width < (SETTINGS_WIDTH * 2)) {
        document.getElementById("myNav").style.width = '100%';
    }
    
    else {
        document.getElementById("myNav").style.width = screenWidth + "px";
    }
    
    document.getElementById("settings").style.color = 'rgb(249, 232, 221)';
    document.getElementById("downloadText").style.color = defaultColor;
    document.getElementById("add2down").style.color = defaultColor;
}

var defaultColor = document.getElementById("downloadText").style.color;
document.getElementById("downloadText").style = "color: #00000000;"
document.getElementById("add2down").style = "color: #00000000;"

function close() {
    document.getElementById("fscreen").style = 'pointer-events: none;';
    document.getElementById("settings").style.color = 'black';

    defaultColor = document.getElementById("downloadText").style.color;
    document.getElementById("downloadText").style = "color: #00000000;"
    document.getElementById("add2down").style = "color: #00000000;"
    document.getElementById("myNav").style.width = "0%";
}

function slidePanel() {
    if (panelOpen) {
        close()
    }
    else {
        open()
    }
    panelOpen = !panelOpen;
}

function download() {
    if (items.length > 0) {
            
        // Creation/writing
        const doc = new jsPDF();
        // Set font size and type
        doc.setFontSize(22);
        doc.setFont('courier', 'bold');

        // Add heading to the PDF
        doc.text("My Shopping List", 20, 20);

        // Set font size and type for the date
        doc.setFontSize(14);
        doc.setFont('courier', 'normal');

        // Get the current date and format it
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString();

        // Add the date to the PDF on a new line
        doc.text(`Date: ${dateString}`, 20, 30);

        doc.setFontSize(12);
        doc.setFont('courier', 'normal');

        doc.lineHeight = 0.5;
        let startY = 45; // Initial y position
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // Check if the text will overflow to the next page
            const pageHeight = doc.internal.pageSize.height;
            const lineHeight = doc.getLineHeight();
            const textHeight = lineHeight * doc.splitTextToSize(item.description, doc.internal.pageSize.width - 40).length;
            if (startY + textHeight > pageHeight - 20) {
                doc.addPage(); // Add a new page if the text will overflow
                startY = 45; // Reset the y position
            }
            doc.text(item.description, 20, startY);
            startY += textHeight - 5; // Add some padding between lines
        }

        // Downloading
        doc.save("Shopping_List_" + downloadCount + ".pdf");
        downloadCount += 1;
    }

    else {
        document.getElementById("add2down").style.color = 'rgb(199, 64, 64)';
        setTimeout('document.getElementById("add2down").style.color = "white"', 400)
    }
}

let xDown = null;
let yDown = null;

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(event) {
  xDown = event.touches[0].clientX;
  yDown = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = event.touches[0].clientX;
  let yUp = event.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 6) {
        if (panelOpen){
            slidePanel();
        }
    }
    else if (xDiff < -6){
        if (!panelOpen){
            slidePanel();
        }
    }
  }

  // Reset values
  xDown = null;
  yDown = null;
}

downloadButton.addEventListener("click", function () {
    download();
})

addButton.addEventListener("click", function () {
    createItem();
})

itemText.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.code === 13) {
        createItem();
    }
});

itemText.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.code === 13) {
        createItem();
    }
});

quantityText.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.code === 13) {
        createItem();
    }
});

quantityText.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.code === 13) {
        createItem();
    }
});

priceText.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.code === 13) {
        createItem();
    }
});

priceText.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.code === 13) {
        createItem();
    }
});

clearButton.addEventListener("click", function () {
    clear()
})

settingsButton.addEventListener("click", function () {
    slidePanel();
})

settingsHolder.addEventListener("click", function () {
    slidePanel();
})

fScreenButton.addEventListener("click", function () {
    slidePanel();
})