/*
 * desc : fetch opendataplatform api
 * postgresql superuser : epimap / twcdcPW@1922
 */

var apiURL = "https://od.cdc.gov.tw";
var apiService = {
	 "opendataplatform" : {
		 "dengue" : ["a1", "a2"],
		 "influlinechart" : ["a1"],
		 "enterovirus" : ["a1"],
		 "hivbc" : ["a1"],
		 "diarrheapiechart" : ["a1"]
	 }
  };

var redisBackend = require("./routes/redis_backend.js")
	, timeCounter = require("./public/seed/TimeCounter.js")
	, common = require("./public/seed/Common.js");

// set the redis configuration
redisBackend.setRedisConf({ 
	"host" : "host",
	"port" : "port",
	"pwd" : "password"
});

/*
 * parse GetDengueLocation api
 */
function prepareOpendataplatformData() {
	var allRouters = common.getDictionaryKeyList(apiService);
	
	for(var i = 0 ; i < allRouters.length ; i++) {
		var allServices = common.getDictionaryKeyList(apiService[allRouters[i]]);
		
		for(var j = 0 ; j < allServices.length ; j++) {
			var tmpAPIUrl = "/" + allRouters[i];
			
			for(var k = 0 ; k < apiService[allRouters[i]][allServices[j]].length ; k++ ) {
				var tmpObj = { };
				tmpObj[tmpAPIUrl] = {
					 "method" : "get",
					 "paras" : { "s" : allServices[j], "v" : apiService[allRouters[i]][allServices[j]][k] },
					 "type" : allServices[j],
					 "key" : allRouters[i] + "_" + allServices[j] + "_" + apiService[allRouters[i]][allServices[j]][k]
				 };
				
				redisBackend.autoProcessAPI(
				  {
					  "apiUrl" : apiURL,
					  "apiService" : tmpObj
				  }
				);
				
			}
		}
	}
}

/*
 * desc : schedule the task 
 */
function scheduleProcess() {
	// prepare the data
	prepareOpendataplatformData();
}

/*
 * desc : set the status flag if it not exists and also being a entry
 */
redisBackend.getRedisPair("alive", function(data) {
	var rawResponse = JSON.parse(data);
	if(rawResponse['state'] == 'success') {
		// no key for machine statue
		if(rawResponse['data'] === null || rawResponse['data'] != "true") {
			redisBackend.setRedisPair('alive', 'true', -1, function(data) {
				scheduleProcess();
			});
		} 
		// machine key existing
		if(rawResponse['data'] == "true") {
			scheduleProcess();
		}
	} else {
		console.log(JSON.stringify({ "state" : 'failure', "info" : 'The response from the redis server failed.', "data" : "Can not retrieve the key alive." }));
	}
});