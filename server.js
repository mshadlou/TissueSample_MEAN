// Express JS
var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	path = require("path");

var	express = require('express'),
	bodyParser = require('body-parser'),
	fileUpload = require('express-fileupload'), 
	app = express();

var Local_IP = "0.0.0.0";
var server;

// Site and User Creds  
const { Console } = require('console');
////////////////////////////////////////////////////////////////////////
///////////////////// Get IP address for local server //////////////////
////////////////////////////////////////////////////////////////////////
var os = require('os');
var ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    
    if (ifname =="Wi-Fi"){
      Local_IP = iface.address;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

///////////////////////////////////////////////////
var port = process.env.PORT || '3000';
var ip = process.env.IP || Local_IP;

// force auto reboot on failures
var autoRebootServerOnFailure = false; // I deleted the relevant code but I may check it on production stage again

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// default options 
app.use(fileUpload());
app.use('/pro',require('./controllers/api/processor'));
app.use(require('./controllers/static')); // to load static JS files for client side
app.get('/',function(req,res){
   res.sendFile(path.join(__dirname+'/www/index.html')); // load sing-page application here
});
 
//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//
//----------------- From here, you dont need to change anything ------------------//
//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//
//
// express server configuration for HTTP and not HTTPS#
server = http.createServer(app);
	
function cmd_exec(cmd, args, cb_stdout, cb_end) {
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
    me.exit = 0;
    me.stdout = "";
    child.stdout.on('data', function(data) {
        cb_stdout(me, data)
    });
    child.stdout.on('end', function() {
        cb_end(me)
    });
}

function log_console() {
    console.log(foo.stdout);
    try {
        var pidToBeKilled = foo.stdout.split('\nnode    ')[1].split(' ')[0];
        console.log('------------------------------');
        console.log('Please execute below command:');
        console.log('\x1b[31m%s\x1b[0m ', 'kill ' + pidToBeKilled);
        console.log('Then try to run "server.js" again.');
        console.log('------------------------------');

    } catch (e) {}
}

function runServer() {
    server.on('error', function(e) {
        if (e.code == 'EADDRINUSE') {
            if (e.address === '0.0.0.0') {
                e.address = 'localhost';
            }
			
            var socketURL = 'http' + '://' + e.address + ':' + e.port + '/';

            console.log('------------------------------');
            console.log('\x1b[31m%s\x1b[0m ', 'Unable to listen on port: ' + e.port);
            console.log('\x1b[31m%s\x1b[0m ', socketURL + ' is already in use. Please kill below processes using "kill PID".');
            console.log('------------------------------');

            foo = new cmd_exec('lsof', ['-n', '-i4TCP:3000'],
                function(me, data) {
                    me.stdout += data.toString();
                },
                function(me) {
                    me.exit = 1;
                }
            );

            setTimeout(log_console, 250);
        }
    });

    server = server.listen(port, process.env.IP || '0.0.0.0', function(error) {
        var addr = server.address();
        // Rest of the server is here
        if (addr.address === '0.0.0.0') {
            addr.address = 'localhost';
        }

        var domainURL = 'http' + '://' + addr.address + ':' + addr.port + '/';
        MydomainURL = domainURL;
        console.log('------------------------------');
        console.log('\n');

        console.log('Your web-browser (HTML file) MUST set this line:');
        console.log('\x1b[31m%s\x1b[0m ', 'Domain Name = "' + domainURL + '";');

        console.log('------------------------------');
        console.log('Need help? Ask Masoud SH');
    });
}

if (autoRebootServerOnFailure) {
    // auto restart server on failure
    var cluster = require('cluster');
    if (cluster.isMaster) {
        cluster.fork();

        cluster.on('exit', function(worker, code, signal) {
            cluster.fork();
        });
    }

    if (cluster.isWorker) {
        runServer();
    }
} else {
    runServer();
}
