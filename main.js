let UPDATE_RATE_IN_MS = 3_000;
let BATTERY_PERCENTAGE_THRESHOLD = process.env.BATTERY_PERCENTAGE_THRESHOLD || 30;
//let UPDATE_RATE_IN_MS = process.env.UPDATE_RATE_IN_MS || 3_600_000; //1 hora

const {exec} = require('child_process');

function sendEmail(percentage)
{
	console.log(`The device is at ${percentage}% of charge, please plug it in.`);
}

async function monitorBattery()
{
	const status = await getBatteryStatus();
	if(status == undefined)
	{
		console.log("[ERROR] monitorBattery: Failed to get battery status.");
		return;
	}

	if(status.percentage <= BATTERY_PERCENTAGE_THRESHOLD
	&& status.plugged == "UNPLUGGED")
	{
		sendEmail(status.percentage);
	}
	else
	{
		console.log(`[INFO] Device is at ${status.percentage}% of charge.`);
	}
}

function getBatteryStatus()
{
	return new Promise((good, bad) =>
	{
		good({percentage: 30, plugged: "UNPLUGGED"});
	}
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
}, UPDATE_RATE_IN_MS);

monitorBattery();
