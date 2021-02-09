class Session {
	constructor(authorization="") {
		this.BASEURL = "http://localhost:3000/api"
		this.HEADERS = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		};
		this.authorization = authorization;

		this.createNavbar();
	}
	clearMain() {
		this.mainTag.innerHTML = "";
	}
	createNavbar() {
		const navbar = document.createElement("nav");

		const logIn = document.createElement("button");
		logIn.innerText = "Log In";
		logIn.addEventListener("click", (e) => {
			e.preventDefault();
			console.log("Log In");
		});
		navbar.appendChild(logIn);

		const signUp = document.createElement("button");
		signUp.innerText = "Sign Up";
		signUp.addEventListener("click", (e) => {
			e.preventDefault();
			this.createSignUp();
		});
		navbar.appendChild(signUp);

		if (this.username) {
			const userPage = document.createElement("button");
			userPage.innerText = this.username;
			userPage.addEventListener("click", (e) => {
				e.preventDefault();
				this.createUserPage(); // TODO
			});
		}

		this.mainTag.appendChild(navbar);
	}
	createSignUp() {
		this.clearMain();
		this.createNavbar();
		const signUp = document.createElement("form");

		const inputLabels = [
			{label: "Username: ", input: "username-input", type: "text"},
			{label: "Email: ", input: "email-input", type: "email"},
			{label: "Password: ", input: "password-input", type: "password"},
			{label: "Confirm Password: ", input: "confirm-password-input", type: "password"}
		];
		for (inputLabel of inputLabels) {
			const label = document.createElement("label");
			const input = document.createElement("input");

			label.innerText = inputLabel.label;
			label.htmlFor = inputLabel.input;

			input.id = inputLabel.input;
			input.name = inputLabel.input;
			input.type = inputLabel.type;

			signUp.appendChild(label);
			signUp.appendChild(input);
		}

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
			);
		});

		this.mainTag.appendChild(signUp);
	}
	createUserPage() {
		this.clearMain();
		this.createNavbar();
		const userProperties = [
			`ID: ${this.id}`,
			`Username: ${this.username}`,
			`Email: ${this.email}`
		];
		for (property of userPropertyValues) {
			const pTag = document.createElement("p");
			pTag.innerText = property;
			this.mainTag.appendChild(pTag);
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
		this.signUp(username, email, password, passwordConfirmation).then((response) => {
			return response.json();
		}).then((confirmation) => {
			this.id = confirmation.id;
			return this.login(email, password);
		});
	}

	get authorizedHeaders() {
		return {Authorization: this.authorization, ...this.HEADERS};
	}
	get mainTag() {
		return document.getElementById("main");
	}
}

const session = new Session();