# Low battery warning
This is a litte node.js script for termux that emails you when the device battery is low. Because everyone uses old android phones as little servers, right?

## Setting it up
- First, clone the repository.

	```bash
	git clone https://github.com/idko2004/low-battery-warning.git
	```

- Install npm dependencies.

	```bash
	npm install
	```

You can do the following steps in a graphical environment, but I'll make the examples in the terminal.

- Copy the file `config_template.json` to `config.json`

	```bash
	cp config_template.json config.json
	```

- Open `config.json` with your favorite text editor. I'll use micro, but you can use nano, vim or whatever you like.

	```bash
	micro config.json
	```

- The file should be like this:

	```json
	{
		"update_rate_in_ms": 3600000,
		"battery_percentage_threshold": 30,

		"email":
		{
			"sender":
			{
				"host": "your.emailprovider.com",
				"user": "sender@emailprovider.com",
				"password": "i-hope-this-is-not-your-personal-account"
			},
			"receiver":
			{
				"user": "receiver@emailprovider.com"
			},

			"contents":
			{
				"html_file": "email_contents.html",
				"title": "Device at %% of battery. Charge it now!"
			}
		}
	}
	```

- In `email`, `sender` you should put the information about the account the program is going to use to send the email.

	```json
		"email":
		{
			"sender":
			{
				"host": "your.emailprovider.com",
				"user": "sender@emailprovider.com",
				"password": "i-hope-this-is-not-your-personal-account"
			},
	```

	- In the `host` filed goes the url from where your email provider sends the emails, this is something that your email provider has to give you.

	- In the `user` field goes the email address the program is going to use to send the email.

	- In the `password` field goes the password the program is going to use to log in the account that you put in the user field.

- In `email`, `receiver` goes the information about the receiver of the message.

	```json
			"receiver":
			{
				"user": "receiver@emailprovider.com"
			},
	```

	- In the `user` field goes the email address that's going to receive the message.

- That's all the settings you have to change, there are more, but those are optional and surely you can figure them out, just as a note, in `email.contents.title` and in the contents of the html file, you can put the characters `%%` to indicate where you want the battery percentage to show.

### Start automatically
If you have [Termux:Boot](https://wiki.termux.com/wiki/Termux:Boot) don't forget to run low-battery-warning at startup!

- Create the script.

	```bash
	touch ~/.termux/boot/low-battery-warning.sh
	```

- Set the permissions to be able to execute it.

	```bash
	chmod +x ~/.termux/boot/low-battery-warning.sh
	```

- Open the file in your favorite text editor, I'm using micro.

	```bash
	micro ~/.termux/boot/low-battery-warning.sh
	```

- Paste the contents of the script

	```bash
	#!/data/data/com.termux/files/usr/bin/sh
	termux-wake-lock
	~/.termux/boot/low-battery-warning.sh
	```

:)