const SETTINGS_WIDTH = 1500;

const itemText = document.getElementById("itemText");
const quantityText = document.getElementById("quantityText");
const priceText = document.getElementById("priceText");
const clearButton = document.getElementById("clear");
const addButton = document.getElementById("add");
const settingsButton = document.getElementById("settings");
const settingsHolder = document.getElementById("settings-holder");
// const downloadButton = document.getElementById("downloadText");
const fScreenButton = document.getElementById("fscreen");

var total = 0;

var downloadCount = 1;

var items = []
var itemElements = []

var panelOpen = false;

let uniqueID = 0;

function getID() {
    uniqueID += 1;
    return uniqueID;
}

class Item {
    constructor(description, quantity, price) {
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.id = getID();
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

function removeElement(element, newID, item) {

    // Will be null if we are using the hacky dummy element
    if (element) {
        element.remove();
        total -= item.price;
        updateSum();
    }

    items = items.filter(function (item) {
        return item.id != newID;
    });
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
        newP.id = newItem.id;

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
        document.getElementById("add2down").innerHTML = "33"
        document.getElementById("add2down").style.display = 'none';

        newDeleteButton.addEventListener("click", function () {
            removeElement(newP, newP.id, newItem);
        })

        const elements = [newDesc, newQuantity, newPrice];

        let maxHeight = 0;
        elements.forEach((element) => {
            const height = element.clientHeight;
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
        document.getElementById("add2down").style.display = 'block';
    }
    
    let screenWidth = SETTINGS_WIDTH;
    if (screen.width < (SETTINGS_WIDTH * 2)) {
        document.getElementById("myNav").style.width = '100%';
    }
    
    else {
        document.getElementById("myNav").style.width = screenWidth + "px";
    }
    
    document.getElementById("settings").style.color = 'rgb(249, 232, 221)';
    // document.getElementById("downloadText").style.color = defaultColor;
    // document.getElementById("add2down").style.color = defaultColor;
}

// var defaultColor = document.getElementById("downloadText").style.color;
// document.getElementById("downloadText").style = "color: #00000000;"
document.getElementById("add2down").style.color = 'white';

function close() {
    document.getElementById("fscreen").style = 'pointer-events: none;';
    document.getElementById("settings").style.color = 'black';

    // defaultColor = document.getElementById("downloadText").style.color;
    // document.getElementById("downloadText").style = "color: #00000000;"
    document.getElementById("add2down").style.color = "white;"
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

var submitButton = document.getElementById("submitBut")

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

function isValidDetail(invoiceNumber, bsb, accountNumber, abn, email) {
    let validFound = true;
  
    // Check if invoice number is numeric
    if (!isNumeric(invoiceNumber)) {
      validFound = false;
      console.log("Invoice Number must be numeric.");
    }

    // Check if BSB is a 6-digit number
    if (!isValidAccNo(bsb)) {
      validFound = false;
      console.log("BSB must be a 6-digit number.");
    }
  
    // Check if account number is a 6-digit number
    if (!isValidAccNo(accountNumber)) {
      validFound = false;
      console.log("Account Number must be a 6-digit number.");
    }
  
    // Check if ABN is a 11-character string
    if (!isValidABN(abn)) {
      validFound = false;
      console.log("ABN must be an 11-character string.");
    }
  
    // Check if invoice number is numeric
    if (!isValidEmail(email)) {
        validFound = false;
        console.log("Email not valid");
    }
    
    return validFound;
  }
  
function isNumeric(value) {
    return /^\d+$/.test(value);
}

function isValidAccNo(value) {
    return /^\d{6}$/.test(value);
}

function isValidABN(value) {
    return /^\d{11}$/.test(value);
}

function isValidEmail(email) {
    // Regular expression pattern for email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email against the pattern
    return emailPattern.test(email);
}

document.getElementById("invoiceForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var clientName = document.getElementById("clientNameInput").value;
    var clientAddress = document.getElementById("clientAddressInput").value;
    var invoiceNumber = document.getElementById("invoiceNumberInput").value;
    var accountName = document.getElementById("accountNameInput").value;
    var bsb = document.getElementById("bsbInput").value;
    var accountNumber = document.getElementById("accountNumberInput").value;
    var abn = document.getElementById("abnInput").value;
    var email = document.getElementById("emailInput").value;

    if (!isValidDetail(invoiceNumber, bsb, accountNumber, abn, email)) {
        return;
    }

    // Writing PDF
    if (items.length > 0) {
        // Creation/writing
        const doc = new jsPDF();

        // Set font size and type
        doc.setFontSize(22);

        let headline = "Invoice Number " + invoiceNumber;

        // Add heading to the PDF
        doc.text(headline, 20, 20);

        // Set font size and type for the date
        doc.setFontSize(14);

        // Get the current date and format it
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString();

        // Add the date to the PDF on a new line
        doc.text(`Date: ${dateString}`, 20, 30);

        doc.setFontSize(15);
        doc.text("Client Information", 20, 50);
        doc.setFontSize(12);

        // Add client information
        doc.text("Client Name: " + clientName, 20, 60);
        doc.text("Client Address: " + clientAddress, 20, 65);

        doc.setFontSize(15);
        doc.text("Payment Details", 20, 80);
        doc.setFontSize(12);

        // Add payment details
        doc.text("Account Name: " + accountName, 20, 90);
        doc.text("BSB: " + bsb, 20, 95);
        doc.text("Account Number: " + accountNumber, 20, 100);
        doc.text("ABN: " + abn, 20, 105);

        doc.setFontSize(15);
        doc.text("Total Due: $ " + parseFloat(total).toFixed(2), 20, 125);
        doc.setFontSize(12);

        doc.setFontSize(15);
        doc.text("Summary", 20, 135);
        doc.setFontSize(12);

        // Table headers
        var headers = [
            { header: 'Description', dataKey: 'description' },
            { header: 'Dates', dataKey: 'quantity' },
            { header: 'Price', dataKey: 'price' },
        ];

        console.log("Tota", total)
        console.log(items)

        // Hacky solution        
        const sumItem = new Item(' ', 'Total:', parseFloat(total).toFixed(2));
        items.push(sumItem)

        // Table data
        var data = items.map(function(item) {
            return {
                description: item.description,
                quantity: item.quantity,
                price: "$ " + parseFloat(item.price).toFixed(2)
            };
        });

        removeElement(null, sumItem.id, sumItem);
        console.log(items)
        console.log(total)

        // Table options
        var options = {
            startY: 150,
            margin: { top: 20 },
            styles: {
                font: 'courier',
                fontSize: 12,
                cellWidth: 60,
                valign: 'middle',
                halign: 'left',
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontSize: 14,
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: [0, 0, 0],
            },
        };

        // Generate the table
        doc.autoTable(headers, data, options);

        // Downloading
        doc.save("Invoice " + invoiceNumber + ".pdf");
        downloadCount += 1;

        // Save the PDF as a Blob
        const pdfBlob = doc.output('blob');

        // Create a URL for the Blob
        const pdfURL = URL.createObjectURL(pdfBlob);

        // Encode the recipient email for use in the mailto URL
        var encodedRecipientEmail = encodeURIComponent(email);

        // Create the subject with the invoice number
        var subject = 'Invoice ' + invoiceNumber;

        // Encode the subject for use in the mailto URL
        var encodedSubject = encodeURIComponent(subject);

        // Create the email body
        var body = 'Here is my latest invoice.\n(See attached)';

        // Encode the body for use in the mailto URL
        var encodedBody = encodeURIComponent(body);

        // Construct the mailto URL with the encoded recipient email, encoded subject, encoded body, and PDF attachment
        var mailtoURL = 'mailto:' + encodedRecipientEmail + '?subject=' + encodedSubject + '&body=' + encodedBody + '&attachment=' + pdfURL;

        // Open the user's email client with the filled-in email fields and PDF attached
        window.location.href = mailtoURL;
    }
    
    else {
        document.getElementById("add2down").style.color = 'rgb(199, 64, 64)';
        setTimeout('document.getElementById("add2down").style.color = "white"', 400);
    }
});
