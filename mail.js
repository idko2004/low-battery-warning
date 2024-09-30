let config;
try
{
	config = require('config.json');
}
catch
{
	return;
}

if(config.email === undefined
|| config.email.sender === undefined
|| config.email.receiver === undefined
|| config.email.sender.host === undefined
|| config.email.sender.user === undefined
|| config.email.sender.password === undefined
|| config.email.receiver.user === undefined)
{
	console.log("Email credentials were not set correctly. Please set them and try again.");
	return;
}


const mailer = require('nodemailer');

const transporter = mailer.createTransport(
{
	host: config.email.sender.host,
	auth:
	{
		user: config.email.sender.user,
		pass: config.email.sender.password
	}
});

function sendEmail(whoToSend, emailName, emailHtmlContent)
{
	return new Promise(function(resolve, reject)
	{
		if([whoToSend, emailName, emailHtmlContent].includes(undefined))
		{
			console.log('sendEmail: FALTAN ARGUMENTOS');
			reject();
		}
		if(typeof whoToSend !== 'string' && typeof emailName !== 'string' && typeof emailHtmlContent !== 'string')
		{
			console.log('sendEmail, SE ESPERABAN STRINGS');
			reject();
		}

		const mailOptions =
		{
			from: process.env.EMAIL_USER,
			to: whoToSend,
			subject: emailName,
			html: emailHtmlContent
		}
	
		transporter.sendMail(mailOptions, function(error)
		{
			if(error)
			{
				console.log('//Error mandando email', emailName, error);
				reject();
			}
			else
			{
				console.log('//Email mandado', emailName);
				resolve();
			}
		});

	});
}

function prepareAndSendEmail(percentage)
{

}

module.exports =
{
	prepareAndSendEmail
}
