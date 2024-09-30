let config;
try
{
	config = require('./config.json');
}
catch
{
	console.log("Config file not found.\n\nCreate a file with the name \"config.json\" and copy the contents of \"config_template.json\" into it.\nPlease set the values to your liking, and don't forget to paste your email credentials.");
	return;
}

const email = require('./mail');
const {exec} = require('child_process');

async function monitorBattery()
{
	const status = await getBatteryStatus();
	if(status == undefined)
	{
		console.log("[ERROR] monitorBattery: Failed to get battery status.");
		return;
	}

	if(status.percentage <= config.battery_percentage_threshold
	&& status.plugged == "UNPLUGGED")
	{
		console.log(`[INFO] The device is at ${status.percentage}% of charge, please plug it in.`);
		email.prepareAndSendEmail(status.percentage);
	}
	else
	{
		console.log(`[INFO] Device is at ${status.percentage}% of charge.`);
	}
}

function getBatteryStatus()
{
	/*
	return new Promise((good, bad) =>
	{
		good({percentage: 30, plugged: "UNPLUGGED"});
	});
	*/
	return new Promise((good, bad) =>
	{
		exec("termux-battery-status", (stderr, stdout) =>
		{
			//console.log("stderr: ", stderr);
			//console.log("stdout: ", stdout);

			if(stderr != null)
			{
				console.log("[WARN] getBatteryStatus: Something appeared on stderr, Printing:\n", stderr);
			}
		
			try
			{
				good(JSON.parse(stdout));
			}
			catch(err)
			{
				console.log("[ERROR] getBatteryStatus: Failed to parse as JSON. Printing what I was trying to parse:\n", stdout);
				bad(undefined);
			}
		});
	})
}

setInterval(() => 
{
	monitorBattery();
}, config.update_rate_in_ms);

monitorBattery();
