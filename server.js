const port = process.env.PORT || 8000;
var express = require('express');
var app = express();
const fs = require('fs');
const formidable = require('formidable')
var bodyParser = require('body-parser');
const path = require('path')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // 

app.use(express.static('static-content', {
    extensions: ['html']
}));


app.post('/api/generate/', function(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        var oldPath = files.resume.filepath;
        var company_name = fields.company_name;
        var job_role = fields.job_role;

        var newPath = path.join(__dirname, 'uploads')
                + '/test.pdf'
        var rawData = fs.readFileSync(oldPath)
      
        fs.writeFile(newPath, rawData, function(err){
            if(err) console.log(err)
        })

        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python3',["test.py", company_name, job_role, "uploads/test.pdf"]);

        pythonProcess.stdout.on('data', (data) => {
            return res.send({"data": data.toString()})
        });
  })
});

app.get('/*', function(req, res) {
    var url = req.originalUrl;
    if (url !== "/favicon.ico"){
        return res.status(200).send("<script>window.location.href='/'</script>");
    }
});

app.listen(port, function() {
    console.log('Server has started listening on port ' + port);
});