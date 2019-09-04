module.exports = HomeController;

const exec = require('child_process').exec;
const process = require('process');
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
        var result = "successful";
        await disconnect().catch(function (error) {
            $logger.error("error", error);
            result = "fail";
        });
        io.json({
            status: result
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
}