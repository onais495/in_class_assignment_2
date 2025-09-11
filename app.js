url = require('url');
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
const http = require('http');
//create a server object:
let myserver = http.createServer(function (req, res) {
//parse the URL
let parsedURL = url.parse(req.url, true);
//Store the parsed query in query
const query = parsedURL.query;
const pathName = parsedURL.pathname;

//We can either use if else or switch

/*if (pathName == "/schedule")
	schedule();
else if  (pathName == "/cancel")
	cancel();
else 
	error();*/

switch (pathName){
	case "/schedule":
		schedule(query, res);
		break;
	case "/cancel":
		cancel(query);
		break;
	default:
		error(404, "pathname not found", res);
}
/*res.writeHead(200, {'Content-Type': 'text/html'});
res.write(`<html> <body> <p> <strong> Received </strong> </p> </body> </html>`); //write (send) a response to the clien
console.log(req.url);*/
}
);

function sendResponse(status, message, res){
res.writeHead(status, {'Content-Type': 'text/plain'});
res.write(message); //write (send) a response to the clien
res.end();
}

function schedule(query, res)
{
//alternate way to write the function
/*
	if availableTimes[query.day].some(function (element) {
return element == queryObj.time;
})
}*/

if (availableTimes[query.day].some(element => element == query.time))
{
	sendResponse(200, "scheduled", res);
}
else
	sendResponse(404, "Could not schedule", res);

}

function cancel(query)
{

}

myserver.listen(80); //the server object listens on port 80
