/*
 * desc : example to process data from the api and save into redis server 
 * author : jiankaiwang
 */

var redisHost = '',
    redisPort = 0,
    redisPWD = '',
    apiUrl = "",
    apiService = {};

var redis = require("redis"),
    url = require("url"),
    querystring = require('querystring'),
    request = require('request'),
    common = require('../public/seed/Common.js'),
    tc = require('../public/seed/TimeCounter.js'),
    https = require('https'),
    soap = require("soap");

/*
 * desc : response the result 
 */
function responseResult(state, info, data) {
	return(JSON.stringify({ "state" : state, "info" : info, "data" : data }));
}

/*
 * desc : connect to the redis and set the key-value pair 
 */
function setRedisPair(key, value, ttlinHour, callBackFunc) {
	var client = redis.createClient({ host: redisHost, port: redisPort, password: redisPWD });
	
	// connection error
	client.on("error", function(error) {
		callBackFunc(responseResult("failure","Connecting to the Redis went error while adding the key " + key, error));
	});

	// save into the Redis
	client.on('connect', function() {
	    client.set(key, value);
	    
	    // set ttl time
	    if(parseInt(ttlinHour) != -1) {
	    	var expireDate = tc.addHours(new Date(), parseInt(ttlinHour));
	    	expireDate = parseInt(expireDate.getTime()/1000);
	    	client.expireat(key, parseInt(expireDate));
	    }
	    
	    callBackFunc(responseResult("success","set the pair by key " + key,""));
        // close the connection
    	client.quit();
	});
}

/*
 * desc : connect to the redis and get the value by key 
 */
function getRedisPair(key, callBackFunc) {
	var client = redis.createClient({ host: redisHost, port: redisPort, password: redisPWD });
	
	// connection error
	client.on("error", function(error) {
		callBackFunc(responseResult("failure","Connecting to the Redis went error.",error));
	});

	// save into the Redis
	client.on('connect', function() {
	    client.get(key, function(err, reply) {
	    	if(!err) {
	    		callBackFunc(responseResult("success","operation get on the redis",reply));
	    	} else {
	    		callBackFunc(responseResult("failure","operation get on the redis",""));
	    	}
	    })
	    
        // close the connection
    	client.quit();
	});
}

/*
 * desc : connect to the redis, get the value by key and save the value if it not exists 
 */
function getAndSaveRedisPairIfNotExist(key, defaultValue, ttlinHour, callBackFunc) {
	var client = redis.createClient({ host: redisHost, port: redisPort, password: redisPWD });
	
	// connection error
	client.on("error", function(error) {
		callBackFunc(responseResult("failure","Connecting to the Redis went error.",error));
	});

	// save into the Redis
	client.on('connect', function() {
	    client.get(key, function(err, reply) {
	    	if(!err) {
	    		if(reply === null) {
	    			setRedisPair(key, defaultValue, ttlinHour, callBackFunc);
	    		} else {
	    			callBackFunc(responseResult("success","operation get on the redis",reply));
	    		}
	    	} else {
	    		callBackFunc(responseResult("failure","operation get on the redis",""));
	    	}
	    })
	    
        // close the connection
    	client.quit();
	});
}



/*
 * desc : connect to the redis and delete the value by key 
 */
function delRedisPair(key, callBackFunc) {
	var client = redis.createClient({ host: redisHost, port: redisPort, password: redisPWD });
	
	// connection error
	client.on("error", function(error) {
		callBackFunc(responseResult("failure","Connecting to the Redis went error.",error));
	});

	// save into the Redis
	client.on('connect', function() {
	    client.del(key, function(err, reply) {
	    	if(err) { callBackFunc(responseResult("failure","operation delete on the redis",reply)); }
	    	else { callBackFunc(responseResult("success","operation delete on the redis","")); }
	    })
        // close the connection
    	client.quit();
	});
}

/*
 * desc : set redis server conf 
 * inpt :
 * |-  redis : {"host" : "127.0.0.1", "port" : "6379", "pwd" : "exampleRedisPWD" }
 */
function setRedisConf(redis) {
	redisHost = redis["host"];
    redisPort = redis["port"];
    redisPWD = redis["pwd"];	
}

/*
 * desc : access the api and save into the redis
 * oper : set (save)
 */
function __request(apiURI, apiPath, method, allQueries, type, key) {
	switch(method.toLocaleLowerCase()) {
		default:
		case "get":
			request.get({
			    	url: apiURI + apiPath + '/?s=' + allQueries['s'] + '&v=' + allQueries['v']
				},
			    function(error, response, body) {
					switch(type) {		
						case "dengue":
						case "influlinechart":
						case "enterovirus":
						case "hivbc":
						case "diarrheapiechart":			
							var tmpData = JSON.parse(body);
							
							if(tmpData.length > 0) {	
								// set the keys
								setRedisPair(key, JSON.stringify(body), -1, function(data) {
									console.log(data);
								});
							}
							break;
					}
			    }
			);
			break;
	}
}

/*
 * desc : query the api and save the data
 * inpt :
 * |- api : {"apiUrl" : "url", "apiService" : { "service1" : ["api1", "api2"], "service2" : ["api1"] }}
 */
function autoProcessAPI(api) {
    apiUrl = api["apiUrl"];
    apiService = api["apiService"];
	
	var allServices = common.getDictionaryKeyList(apiService);
	var eachAPI = "";
	for(var i = 0 ; i < allServices.length ; i++) {
		eachAPI = allServices[i];
		__request(
			apiUrl, 
			eachAPI, 
			apiService[eachAPI]["method"], 
			apiService[eachAPI]["paras"], 
			apiService[eachAPI]["type"], 
			apiService[eachAPI]["key"]
		);
	}   
}

/*
 * desc : entry 
 */

//exports functions
exports.setRedisConf = setRedisConf;
exports.setRedisPair = setRedisPair;
exports.getRedisPair = getRedisPair;
exports.delRedisPair = delRedisPair;
exports.autoProcessAPI = autoProcessAPI;
exports.getAndSaveRedisPairIfNotExist = getAndSaveRedisPairIfNotExist;
