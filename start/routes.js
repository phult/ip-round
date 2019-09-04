module.exports = function ($route, $logger) {
    /** Register HTTP requests **/
    $route.get("/", "HomeController@welcome");
    $route.get("/establish", "HomeController@establish");
    /** Register socket.io requests **/
    /** Register filters **/
};