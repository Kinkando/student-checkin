const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const paths = ['/', '/student'];

app.use(express.static(__dirname + "/dist/student-checkin"))
for (let i = 0; i < paths.length; i++) {
    app.get(paths[i], (req, res) => {
        res.sendFile(__dirname + "/dist/student-checkin/index.html");
    });
}
app.listen(port, () => console.log(`listening on port::${port}`))