const HEADERS = {
	"Content-Type": "application/json",
	"Accept": "application/json"
};

const USER = {
	username: "sam",
	email: "sam@gmail.com",
	password: "Sammyilove123!",
	password_confirmation: "Sammyilove123!"
};

const AUTH = {
	email: "sam@gmail.com",
	password: "Sammyilove123!"
}

fetch("http://localhost:3000/api/auth/login", {
	method: "POST",
	headers: HEADERS,
	body: JSON.stringify(AUTH)
}).then((response) => {
	return response.json();
}).then((token) => {
	console.log(token);
});