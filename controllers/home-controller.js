module.exports = HomeController;

const exec = require('child_process').exec;
const process = require('process');
const dns = require('dns');
const disconnectCommandMap = {
    win32: "RASDIAL \"Viettel\" \/disconnect",
    win64: "RASDIAL \"Viettel\" \/disconnect"
}
function HomeController($config, $event, $logger) {
    this.welcome = function (io) {
        io.json({
            name: $config.get("package.name"),
            version: $config.get("package.version"),
            port: $config.get("app.port"),
            debug: $config.get("app.debug"),
            log: $config.get("log.storage"),
            autoload: $config.get("app.autoload"),
        });
    }
    this.establish = async function (io) {
        var establishResult = true;
        await disconnect().catch(function (error) {
            $logger.error("error", error);
            establishResult = false;
        });
        var connectionResult = true;
        if (!establishResult) {
            connectionResult = await retryConnection();
        }
        io.json({
            status: (establishResult && connectionResult) ? "successful" : "fail"
        });
    }
    function disconnect() {
        return new Promise((resolve, reject) => {
            $logger.debug("Disconnecting...");
            $logger.debug("process.platform", process.platform);
            if (disconnectCommandMap[process.platform] == null) {
                reject("unsupport this platform: " + process.platform);
            }
            exec(disconnectCommandMap[process.platform], function (error, stdout, stderr) {
                $logger.debug("error", error);
                $logger.debug("stdout", stdout);
                $logger.debug("stderr", stderr);
                $logger.debug("Disconnected.");
                resolve();
            });
        });
    }
    function retryConnection() {
        return new Promise((resolve, reject) => {
            var retryCount = 20;
            var intervalTime = 800;
            var isConnected = false;
            var interval = setInterval(async function () {
                $logger.debug("Waiting for connection...");
                isConnected = await checkConnection().catch(function (error) {
                    isConnected = false;
                });
                retryCount--;
                if (isConnected || retryCount <= 0) {
                    clearInterval(interval);
                    if (isConnected) {
                        $logger.debug("Connected.");
                        resolve(true);
                    } else {
                        $logger.debug("Not yet connected.");
                        resolve(false);
                    }
                }
            }, intervalTime);
        });
    }
    function checkConnection() {
        return new Promise((resolve, reject) => {
            dns.resolve('www.google.com', function (err) {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}