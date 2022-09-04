const express = require('express')
const app = express()
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/dist/student-checkin"))
app.get("/*", (req, res) => {
    res.sendFile(__dirname + "/dist/student-checkin/index.html");
});

app.listen(port, () => console.log(`listening on port::${port}`))