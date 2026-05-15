fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "test@test.com",
    password: "1234"
  })
})
.then(res => res.json())
.then(data => {
  console.log("LOGIN:", data);

  return fetch("http://localhost:3000/api/projects", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + data.token
    }
  });
})
.then(res => res.json())
.then(data => console.log("PROJECTS:", data));