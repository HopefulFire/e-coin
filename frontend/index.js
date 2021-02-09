class Session {
	constructor(authorization="") {
		this.BASEURL = "http://localhost:3000/api"
		this.HEADERS = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		};
		this.authorization = authorization;

		this.startup();
	}

	clearMain() {
		this.mainTag.innerHTML = "";
	}
	createLogIn() {
		this.startup();

		const logIn = document.createElement("form");

		const labelInputs = [
			{label: "Email: ", input: "email-input", type: "email"},
			{label: "Password: ", input: "password-input", type: "password"}
		];

		this.util.buildFormLabelInputs(logIn, labelInputs);

		const submitInput = document.createElement("input");
		submitInput.type = "submit";
		submitInput.value = "Log In";
		logIn.appendChild(submitInput);

		logIn.addEventListener("submit", (e) => {
			e.preventDefault();
			this.login(
				document.getElementById("email-input").value,
				document.getElementById("password-input").value
			).then(() => {
				this.startup();
			});
		});

		this.mainTag.appendChild(logIn);
	}
	createNavbar() {
		const navbar = document.createElement("nav");

		if (this.username) {
			const userPage = document.createElement("button");
			userPage.innerText = this.username;
			userPage.addEventListener("click", (e) => {
				e.preventDefault();
				this.createUserPage(); // TODO
			});
			navbar.appendChild(userPage)
		} else {
			const logIn = document.createElement("button");
			logIn.innerText = "Log In";
			logIn.addEventListener("click", (e) => {
				e.preventDefault();
				this.createLogIn();
			});
			navbar.appendChild(logIn);

			const signUp = document.createElement("button");
			signUp.innerText = "Sign Up";
			signUp.addEventListener("click", (e) => {
				e.preventDefault();
				this.createSignUp();
			});
			navbar.appendChild(signUp);
		}

		this.mainTag.appendChild(navbar);
	}
	createSignUp() {
		this.clearMain();
		this.createNavbar();
		const signUp = document.createElement("form");

		const labelInputs = [
			{label: "Username: ", input: "username-input", type: "text"},
			{label: "Email: ", input: "email-input", type: "email"},
			{label: "Password: ", input: "password-input", type: "password"},
			{label: "Confirm Password: ", input: "confirm-password-input", type: "password"}
		];
		
		this.util.buildFormLabelInputs(signUp, labelInputs);

		const submitInput = document.createElement("input");
		submitInput.type = "submit";
		submitInput.value = "Sign Up";
		signUp.appendChild(submitInput);

		signUp.addEventListener("submit", (e) => {
			e.preventDefault();
			this.signUpAndLogin(
				document.getElementById("username-input").value,
				document.getElementById("email-input").value,
				document.getElementById("password-input").value,
				document.getElementById("confirm-password-input").value
			).then(() => {
				this.startup();
			});
		});

		this.mainTag.appendChild(signUp);
	}
	createUserPage() {
		this.startup();
		const userProperties = [
			`ID: ${this.id}`,
			`Username: ${this.username}`,
			`Email: ${this.email}`
		];
		for (const property of userProperties) {
			const pTag = document.createElement("p");
			pTag.innerText = property;
			this.mainTag.appendChild(pTag);
		}
	}
	getUserInfo() {
		if (this.id) {
			return fetch(`${this.BASEURL}/users/${this.id}`, {
				method: "GET",
				headers: this.authorizedHeaders
			}).then((response) => {
				return response.json();
			}).then((userInfo) => {
				this.id = userInfo.id;
				this.username = userInfo.username;
				this.email = userInfo.email;
				this.account = userInfo.account;
				return;
			});
		}
	}
	login(email, password) {
		const credentials = {
			email: email,
			password: password
		};
		return fetch(`${this.BASEURL}/auth/login`, {
			method: "POST",
			headers: this.HEADERS,
			body: JSON.stringify(credentials)
		}).then((response) => {
			return response.json();
		}).then((tokenInfo) => {
			this.authorization = tokenInfo.token;
			this.id = tokenInfo.id;
			return this.getUserInfo();
		});
	}
	signUp(username, email, password, passwordConfirmation) {
		this.username = username;
		this.email = email;
		if (password === passwordConfirmation) {
			this.password = password;
			const newUser = {
				username: username,
				email: email,
				password: password,
				password_confirmation: passwordConfirmation
			};
			return fetch(`${this.BASEURL}/users`, {
				method: "POST",
				headers: this.HEADERS,
				body: JSON.stringify(newUser)
			});
		} else {
			this.createSignUp();
		}
	}
	signUpAndLogin(username, email, password, passwordConfirmation) {
		return this.signUp(username, email, password, passwordConfirmation).then((response) => {
			return response.json();
		}).then((confirmation) => {
			this.id = confirmation.id;
			return this.login(email, password);
		});
	}
	startup() {
		this.clearMain();
		this.createNavbar();
	}

	get authorizedHeaders() {
		return {Authorization: this.authorization, ...this.HEADERS};
	}
	get mainTag() {
		return document.getElementById("main");
	}

	util = {
		buildFormLabelInputs: (form, labelInputs) => {
			for (const labelInput of labelInputs) {
				const label = document.createElement("label");
				const input = document.createElement("input");

				label.innerText = labelInput.label;
				label.htmlFor = labelInput.input;

				input.id = labelInput.input;
				input.name = labelInput.input;
				input.type = labelInput.type;

				form.appendChild(label);
				form.appendChild(input);
			}
		},
	}
}

new Session();