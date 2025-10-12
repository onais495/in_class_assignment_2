document.getElementById("schedule").addEventListener("click", scheduleAppointment);

document.getElementById("cancel").addEventListener("click", cancelAppointment);

document.getElementById("check").addEventListener("click", checkAvailability);

let inputName = document.getElementById("name");

let inputDay = document.getElementById("day");

let inputTime = document.getElementById("Time");

let output = document.getElementById("results");

function errorHandler(message)
{
    alert("Error: " + message);
}

function scheduleAppointment()
{
    let AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function()
    {
        if (this.status == 200)
        {
            output.innerHTML = this.responseText;   
        }
        else
        {
            errorHandler("Status: " + this.status + " " + this.responseText);
        }
    };
    AJAXObj.onerror = function()
    {
        errorHandler("Connection error. Try again later.");
    }
    AJAXObj.open("GET", "/schedule?name=" + inputName.value + "&day=" + inputDay.value + "&time=" + inputTime.value);
    AJAXObj.send();
}

function cancelAppointment()
{
    let AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function()
    {
        if (this.status == 200)
        {
            output.innerHTML = this.responseText;   
        }
        else
        {
            errorHandler("Status: " + this.status + " " + this.responseText);
        }
        };
    AJAXObj.onerror = function()
    {
        errorHandler("Connection error. Try again later.");
    }
    AJAXObj.open("GET", "/cancel?name=" + inputName.value + "&day=" + inputDay.value + "&time=" + inputTime.value);
    AJAXObj.send();
}

function checkAvailability()
{
    let AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function()
    {
        if (this.status == 200)
        {
            output.innerHTML = this.responseText;   
        }
        else
        {
            errorHandler("Status: " + this.status + " " + this.responseText);
        }
    };
    AJAXObj.onerror = function()
    {
        errorHandler("Connection error. Try again later.");
    }
    AJAXObj.open("GET", "/check?day=" + inputDay.value + "&time=" + inputTime.value);
    AJAXObj.send();
}