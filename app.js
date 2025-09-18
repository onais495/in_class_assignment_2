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

	//route the request accouting for edge cases such as missing day, time or name
	//or unknown pathnames
	switch (pathName){
		case "/schedule":
		if (query.name != undefined && query.day != undefined && query.time != undefined)
		{
			schedule(query, res);
		}
		else
			sendResponse(404, "Day, time and name required.", res);
		break;
		case "/cancel":
		if (query.name != undefined && query.day != undefined && query.time != undefined)
		{
			cancel(query, res);
		}
		else
			sendResponse(404, "Day, time and name required.", res);
		break;
		case "/check":
		if (query.day != undefined && query.time != undefined)
		{
			check(query, res);
		}
		else
			sendResponse(404, "Day and time required.", res);
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

//Check if an appointment is available
function check(query, res)
{
	//first check if the day exists in availablTimes to avoid undefined errors
	//then check fi the given time exists in the array for that day
	if (availableTimes[query.day] != undefined)
		{
		console.log(availableTimes[query.day]);
		if (availableTimes[query.day].some(time => time == query.time))
		{
			sendResponse(200, "Available", res);
			console.log(availableTimes);
			return;
		}
		else
			sendResponse(404, "Not Available", res);
	}
	else
	sendResponse(404, "Incorrect day", res);
}

function schedule(query, res)
{
	//check if a certain time exists in availableTimes on a specific day
	//if it does, remove if from availbleTimes and add an appointment using 
	//the name, day and time from the query
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
	//if it does, remove if from appointments and add the time back to availableTImes
	if (appointments.some(element => element.name == query.name && element.day == query.day && element.time == query.time))	
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
		else
			sendResponse(404, "Appointment not found", res);
}

myserver.listen(80); //the server object listens on port 80
