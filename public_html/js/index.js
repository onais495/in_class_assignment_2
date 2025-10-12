//event listener for schedule button
document.getElementById("schedule").addEventListener("click", scheduleAppointment);
//event listener for cancel button
document.getElementById("cancel").addEventListener("click", cancelAppointment);
//event listener for check availability button
document.getElementById("check").addEventListener("click", checkAvailability);
//store input values given by the user to set the url query
let inputName = document.getElementById("name");

let inputDay = document.getElementById("day");

let inputTime = document.getElementById("Time");

let output = document.getElementById("results");

//function to hadnle errors
function errorHandler(message)
{
    alert("Error: " + message);
}

//call back function for schedule button
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

//call back function for cancel button
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

//call back function for check availability button
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