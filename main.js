let UPDATE_RATE_IN_MS = 3_000;
//let UPDATE_RATE_IN_MS = process.env.UPDATE_RATE_IN_MS || 1_800_000; //30 minutos

const {exec} = require('child_process');

getBatteryInformation();

function getBatteryInformation()
{
	return new Promise((good, bad) =>
	{
		exec("termux-battery-status", (stderr, stdout) =>
		{
			console.log("stderr: ", stderr);
			console.log("stdout: ", stdout);
		
			try
			{
				good(JSON.parse(stdout));
			}
			catch(err)
			{
				console.log("[ERROR] getBatteryInformation: Failed to parse as JSON. Printing what I was trying to parse:\n", stdout);
				bad(undefined);
			}
		});
	})
}