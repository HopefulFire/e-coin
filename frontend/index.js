const HEADERS = {
	"Content-Type": "application/json",
	"Accept": "application/json"
};

fetch(
	"http://localhost:3000/api/users/sign_up"
).then((response) => {
	return response.json();
}).then((newUser) => {
	console.log(newUser);
	newUser.username = "Fred";
	newUser.email = "fred@gmail.com";
	newUser.password = "frediscool";
	return fetch(
		"http://localhost:3000/api/users",
		{
			method: "POST",
			headers: HEADERS,
			body: JSON.stringify(newUser)
		}
	);
}).then((response) => {
	return response.json();
}).then((createdUser) => {
	console.log(createdUser);
});