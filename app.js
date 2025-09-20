const http = require('http');
const url = require('url');

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];

//create a server object:
let myserver = http.createServer(function (req, res) {

	//parse the URL
	let parsedURL = url.parse(req.url, true);
	//Store the parsed query in query
	const query = parsedURL.query;
	//Store the pathname in pathName
	const pathName = parsedURL.pathname;

	//route the request accounting for edge cases such as missing day, time or name
	//or unknown pathnames
	switch (pathName){
		case "/schedule":
		if (validateQuery(query, true, res))
		{
			schedule(query, res);
		}
		break;
		case "/cancel":
		if (validateQuery(query, true, res))
		{
			cancel(query, res);
		}
		break;
		case "/check":
		if (validateQuery(query, false, res))
		{
			check(query, res);
		}
		break;
		default:
			sendResponse(404, "pathname unknown", res);
	}
	}
);

//This function will handle sending all responses to the user
function sendResponse(status, message, res)
{
	res.writeHead(status, {'Content-Type': 'text/plain'});
	res.write(message);
	res.end();
}

//Capitalize the first character of day and make the rest of the characters lowercase
//then check if the day exists in availableTimes and return true or false
function checkDay(query, res)
{
	query.day = query.day.charAt(0).toUpperCase() + query.day.slice(1).toLowerCase();
	if (availableTimes[query.day] == undefined)
	{
		sendResponse(404, "Incorrect day", res);
		return false;
	}
	else 
	return true;
}

//check if the query time is in the correct format
//if the time is 5 characters long and starts with 0, remove 0
//use the positioning of : and the length of the query time string to find out if the time is in the correct format
function checkTime(query, res)
{
	if (query.time.length == 5 && query.time.charAt(0) == '0')
	{
		query.time = query.time.slice(1);
	}
	
	if ((query.time.length == 4 && query.time.charAt(1) == ':') || (query.time.length == 5 && query.time.charAt(2) == ':'))
	return true;
	else 
	{
		sendResponse(404, "Incorrect time", res);
		return false;
	}
}

//check if the name is empty
//if not, capitalize the first character and make the rest of the characters lowercase
function checkName(query, res)
{
	if (query.name.length == 0)
	{
		sendResponse(404, "Name cannot be empty", res);
		return false;
	}
	else
	{
		query.name = query.name.charAt(0).toUpperCase() + query.name.slice(1).toLowerCase();
		return true;
	}
}

//Check if the day, time or name are missing from the query using the every method on required array
//nameRequired checks if validateqQuery is being called from schedule, cancel or check
//if query is valid, check if the day, time or name are in correct format
function validateQuery(query, nameRequired, res)
{
	const required = ["day", "time"];
	if (nameRequired)
	{
		required.push("name");
	}
	let isQueryValid = required.every(field => query[field] != undefined);
	if (!isQueryValid)
	{
		if (nameRequired)
		{
			sendResponse(404, "Missing day, time or name", res);
		}
		else if (!nameRequired)
		{
			sendResponse(404, "Missing day or time", res);
		}
		return false;
	}
	if (isQueryValid && nameRequired)
	{
		if (checkName(query, res) && checkDay(query, res) && checkTime(query, res))
		{
			return true;
		}
		else
		return false;
	}
	else if (isQueryValid && !nameRequired)
	{
		if (checkDay(query, res) && checkTime(query, res))
		{
			return true;
		}
		else
		return false;
	}
}

//Check if an appointment is available
function check(query, res)
{
	//Check if the given time exists in the availableTimes for that day, if it does, send "Available"
	//otherwise send 404, "Not Available"
	if (availableTimes[query.day].some(time => time == query.time))
	{
		sendResponse(200, "Available", res);
		return;
	}
	else
	sendResponse(404, "Not Available", res);
}

//Schedule an appointment if the time is available
function schedule(query, res)
{
	//Check if a certain time exists in availableTimes on a specific day
	//if it does, remove if from availbleTimes and add an appointment using 
	//the name, day and time from the query
	//if the time does not exist, send 404, "Could not schedule"
	if (availableTimes[query.day].some(time => time == query.time))
	{
		for (let i = 0; i < availableTimes[query.day].length; i++)
		{
		if (availableTimes[query.day][i] == query.time)
			{
				availableTimes[query.day].splice(i, 1);
				appointments.push({name: query.name, day: query.day, time: query.time});
				sendResponse(200, "Reserved", res);
				return;
			}
		}
	}
	else
	sendResponse(404, "Could not schedule", res);
}

//cancel the appointment if it exists
function cancel(query, res)
{
	//check if the appointment exists, 
	//if it does, remove if from appointments and add the time back to availableTimes, and send responses based on the result
	if (appointments.some(element => element.name == query.name && element.day == query.day && element.time == query.time))	
	{
		for (let i = 0; i < appointments.length; i++)
		{
			if (appointments[i].name == query.name && appointments[i].day == query.day && appointments[i].time == query.time)
			{
				appointments.splice(i, 1);
				availableTimes[query.day].push(query.time);
				console.log(appointments);
				console.log(availableTimes);
				sendResponse(200, "Appointment has been cancelled", res);
				return;
			}
		}
	}
	else
	sendResponse(404, "Appointment not found", res);
}

myserver.listen(80); //the server object listens on port 80
