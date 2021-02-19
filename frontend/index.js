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

	checkForErrors(object) {
		if (object.error) {
			throw new Error(object.error);
		} else if (object.errors) {
			throw new Error('Unknown Error');
		}
	}
	clearMain() {
		this.mainTag.innerHTML = "";
	}
	createAccountPage() {
		this.startup(null);
		this.getUserInfo().then((userInfo) => {
			if (userInfo.account.balance === 0 || userInfo.account.balance) {
				const balanceH3 = document.createElement("h3");
				balanceH3.innerText = `Your Balance Is: #${userInfo.account.balance}`;
				this.mainTag.appendChild(balanceH3);
				
				const newTransaction = document.createElement("form");

				const labelInputs = [
					{label: "Transfer Account ID: ", input: "account-id-input", type: "password"},
					{label: "Transfer Amount: ", input: "amount-input", type: "number"}
				];

				this.util.buildFormLabelInputs(newTransaction, labelInputs, "New Transaction");

				newTransaction.addEventListener("submit", (e) => {
					e.preventDefault();
					this.postTransaction({
						receiver_id: document.getElementById("account-id-input").value,
						amount: document.getElementById("amount-input").value
					}).then((transaction) => {
						this.createTransactionPage(transaction);
					});
				});

				this.mainTag.appendChild(newTransaction);
			} else {
				const createAccount = document.createElement("button");
				createAccount.innerText = "Create An Account"
				createAccount.addEventListener("click", () => {
					this.postAccount().then(() => {
						this.createAccountPage()
					});
				});
				this.mainTag.appendChild(createAccount)
			}	
		});

	}
	createLogInPage() {
		this.startup(null);

		const logIn = document.createElement("form");

		const labelInputs = [
			{label: "Email: ", input: "email-input", type: "email"},
			{label: "Password: ", input: "password-input", type: "password"}
		];

		this.util.buildFormLabelInputs(logIn, labelInputs, "Log In");

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
		//DO NOT ADD STARTUP
		const navbar = document.createElement("nav");
		navbar.className = "text-center"

		if (this.username) {
			const userPage = document.createElement("button");
			userPage.innerText = this.username;
			userPage.addEventListener("click", () => {
				this.createUserPage();
			});
			navbar.appendChild(userPage);

			const accountPage = document.createElement("button");
			accountPage.innerText = "Account";
			accountPage.addEventListener("click", () => {
				this.createAccountPage();
			});
			navbar.appendChild(accountPage);

			const transactionsPage = document.createElement("button");
			transactionsPage.innerText = "Transactions";
			transactionsPage.addEventListener("click", () => {
				this.createTransactionsPage(); // TODO
			});
			navbar.appendChild(transactionsPage);
		} else {
			const logIn = document.createElement("button");
			logIn.innerText = "Log In";
			logIn.addEventListener("click", () => {
				this.createLogInPage();
			});
			navbar.appendChild(logIn);

			const signUp = document.createElement("button");
			signUp.innerText = "Sign Up";
			signUp.addEventListener("click", () => {
				this.createSignUpPage();
			});
			navbar.appendChild(signUp);
		}

		this.mainTag.appendChild(navbar);
	}
	createSignUpPage() {
		this.startup(null);
		const signUp = document.createElement("form");

		const labelInputs = [
			{label: "Username: ", input: "username-input", type: "text"},
			{label: "Email: ", input: "email-input", type: "email"},
			{label: "Password: ", input: "password-input", type: "password"},
			{label: "Confirm Password: ", input: "confirm-password-input", type: "password"}
		];
		
		this.util.buildFormLabelInputs(signUp, labelInputs, "Sign Up");

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
	createTransactionPage(transaction) {
		this.startup(this.createTransactionPage, transaction);

		const transactionProperties = [
			`ID: ${transaction.id}`,
			`Amount: ${transaction.amount}`,
			`Sender ID: ${transaction.sender_id}`,
			`Receiver ID: ${transaction.receiver_id}`,
			`Confirmed: ${transaction.confirmed}`
		]

		this.util.buildArrayOfProperties(this.mainTag, transactionProperties, "p");

		const confirm = document.createElement("button");
		confirm.innerText = "Confirm";
		confirm.className = "btn btn-success";
		confirm.addEventListener("click", () => {
			this.patchConfirmation(transaction.id).then((transaction) => {
				this.createTransactionPage(transaction);
			});
		});

		const block = document.createElement("button");
		block.innerText = "Block";
		block.className = "btn btn-danger";
		block.addEventListener("click", () => {
			this.patchBlocked(transaction.id).then((transaction) => {
				this.createTransactionsPage();
			})
		});

		if (transaction.receiver_id === this.id && transaction.confirmed === false) {
			this.mainTag.appendChild(confirm);
		}
		this.mainTag.appendChild(block);
	}
	createTransactionsPage() {
		this.startup(this.createTransactionsPage);

		this.getTransactions().then((transactions) => {
			for (const transaction of transactions) {
				const transactionATag = document.createElement("a");
				transactionATag.addEventListener("click", (e) => {
					e.preventDefault;
					this.createTransactionPage(transaction);
				});

				const transactionProperties = [
					`Amount: ${transaction.amount}`,
					`Sender ID: ${transaction.sender_id}`,
					`Receiver ID: ${transaction.receiver_id}`
				];

				this.util.buildArrayOfProperties(transactionATag, transactionProperties, "p");

				transactionATag.appendChild(document.createElement("br"));

				this.mainTag.appendChild(transactionATag);
			}
		});
	}
	createUserPage() {
		this.startup(this.createUserPage);
		this.getUserInfo().then((userInfo) => {
			const userProperties = [
				`ID: ${userInfo.id}`,
				`Username: ${userInfo.username}`,
				`Email: ${userInfo.email}`
			];
			this.util.buildArrayOfProperties(this.mainTag, userProperties, "p");
		});
	}
	getTransactions() {
		return fetch(`${this.BASEURL}/users/${this.id}/transactions`, {
			method: "GET",
			headers: this.authorizedHeaders
		}).then((response) => {
			return response.json();
		}).then((transactions) => {
			this.checkForErrors(transactions);
			return transactions;
		});
	}
	getUserInfo() {
		return fetch(`${this.BASEURL}/users/${this.id}`, {
			method: "GET",
			headers: this.authorizedHeaders
		}).then((response) => {
			return response.json();
		}).then((userInfo) => {
			this.checkForErrors(userInfo);
			return userInfo;
		});
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
			this.getUserInfo().then((userInfo) => {
				this.username = userInfo.username;
			}).then(() => {
				this.startup();
			});
		});
	}
	patchBlocked(transactionId) {
		return fetch(`${this.BASEURL}/users/${this.id}/transactions/${transactionId}`, {
			method: "PATCH",
			headers: this.authorizedHeaders,
			body: JSON.stringify({blocked: true})
		}).then((response) => {
			return response.json();
		});
	}
	patchConfirmation(transactionId) {
		return fetch(`${this.BASEURL}/users/${this.id}/transactions/${transactionId}`, {
			method: "PATCH",
			headers: this.authorizedHeaders,
			body: JSON.stringify({confirmed: true})
		}).then((response) => {
			return response.json();
		});
	}
	postAccount() {
		return fetch(`${this.BASEURL}/users/${this.id}/account`, {
			method: "POST",
			headers: this.authorizedHeaders,
			body: JSON.stringify()
		}).then((response) => {
			return response.json();
		}).then((account) => {
			this.account = account;
			return;
		});
	}
	postTransaction(transaction) {
		return fetch(`${this.BASEURL}/users/${this.id}/transactions`, {
			method: "POST",
			headers: this.authorizedHeaders,
			body: JSON.stringify(transaction)
		}).then((response) => {
			return response.json();
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
			this.createSignUpPage();
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
	startup(pageCallback=null, args=null) {
		if (pageCallback) {
			this.refreshCallback = pageCallback;
		} else {
			this.refreshCallback = () => {};
		}
		this.refreshArgs = args;

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
		buildFormLabelInputs: (form, labelInputs, submit=null) => {
			
			for (const labelInput of labelInputs) {
				const label = document.createElement("label");
				const input = document.createElement("input");

				label.innerText = labelInput.label;
				label.htmlFor = labelInput.input;
				label.className = "col-5";

				input.id = labelInput.input;
				input.name = labelInput.input;
				input.type = labelInput.type;
				input.className = "col-5";

				form.appendChild(label);
				form.appendChild(input);
			}
			if (submit) {
				const submitInput = document.createElement("input");
				submitInput.type = "submit";
				submitInput.value = submit;
				submitInput.className = "btn btn-success";
				form.appendChild(submitInput);
			}
		},
		buildArrayOfProperties: (parent, properties, tag="p") => {
			for (const property of properties) {
				const aTag = document.createElement(tag);
				aTag.innerText = property;
				parent.appendChild(aTag);
			}
		},
	}
}

new Session();