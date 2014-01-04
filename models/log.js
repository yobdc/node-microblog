var winston = require('winston');

var log = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)({
			json: false,
			timestamp: true
		}),
		new winston.transports.File({
			filename: __dirname + './../debug.log',
			json: false
		})
	],
	exceptionHandlers: [
		new(winston.transports.Console)({
			json: false,
			timestamp: true
		}),
		new winston.transports.File({
			filename: __dirname + './../exceptions.log',
			json: false
		})
	],
	exitOnError: false
});

function Logger() {
	this.__logger = log;
}

Logger.prototype.info = function(msg) {
	log.info(msg + '\r\n');
};

Logger.prototype.debug = function(msg) {
	log.debug(msg + '\r\n');
};

Logger.prototype.error = function(msg) {
	log.error(msg + '\r\n');
};

var logger = new Logger();

module.exports = logger;