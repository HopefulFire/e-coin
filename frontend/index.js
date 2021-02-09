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
		
		const usernameLabel = document.createElement("label");
		usernameLabel.innerText = "Username: ";
		usernameLabel.htmlFor = "username-input";
		signUp.appendChild(usernameLabel);

		const usernameInput = document.createElement("input");
		usernameInput.id = "username-input";
		usernameInput.name = "username-input";
		usernameInput.type = "text";
		signUp.appendChild(usernameInput);

		const emailLabel = document.createElement("label");
		emailLabel.innerText = "Email: ";
		emailLabel.htmlFor = "email-input";
		signUp.appendChild(emailLabel);

		const emailInput = document.createElement("input");
		emailInput.id = "email-input";
		emailInput.name = "email-input";
		emailInput.type = "text";
		signUp.appendChild(emailInput);

		const passwordLabel = document.createElement("label");
		passwordLabel.innerText = "Password: ";
		passwordLabel.htmlFor = "password-input";
		signUp.appendChild(passwordLabel);

		const passwordInput = document.createElement("input");
		passwordInput.id = "password-input";
		passwordInput.name = "password-input";
		passwordInput.type = "password";
		signUp.appendChild(passwordInput);

		const passwordConfirmationLabel = document.createElement("label");
		passwordConfirmationLabel.innerText = "Confirm Password: ";
		passwordConfirmationLabel.htmlFor = "confirm-password-input";
		signUp.appendChild(passwordConfirmationLabel);

		const passwordConfirmationInput = document.createElement("input");
		passwordConfirmationInput.id = "confirm-password-input";
		passwordConfirmationInput.name = "confirm-password-input";
		passwordConfirmationInput.type = "password";
		signUp.appendChild(passwordConfirmationInput);

		const submitInput = document.createElement("input");
		submitInput.type = "submit";
		submitInput.value = "Sign Up";
		signUp.appendChild(submitInput);

		signUp.addEventListener("submit", (e) => {
			e.preventDefault();
			this.signUpAndLogin(
				usernameInput.value,
				emailInput.value,
				passwordInput.value,
				passwordConfirmationInput.value
			);
		});

		this.mainTag.appendChild(signUp);
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