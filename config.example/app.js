module.exports = {
    port: 8866,
    debug: true,
    requestTimeout: -1,
    autoload: [
        "/controllers",
        "/entities",
        "/start"
    ],
    assetPath: "/assets",
    encryption: {
        'key': "d6F3Efeq",
        'cipher': "aes-256-ctr"
    },
    sslMode: {
        enable: false,
        port: 8868,
        options: {
            key: "/path/file.key",
            cert: "/path/file.crt"
        }
    }
};
