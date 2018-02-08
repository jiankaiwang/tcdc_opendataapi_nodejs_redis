# OpenData on Redis in Background



The origin opendata api (php-mysql-based, refer to [tcdc_opendataapi_php](https://github.com/jiankaiwang/tcdc_opendataapi_php)) is not proper under large amount of sessions in quite short term. The cache-based api is necessary. The repository is designed to sync the redis cache with mysql database over php-mysql-based api. After syncing, the nodejs-redis-based api would be possible to handle the above condition.

The repository is simply accessing (GET) the php-mysql-based api and conserves the data in cached database.



## Step

* Install **Redis** and set up password.
* Install **Node.js**.
* Git clone the repository.

```shell
$ cd ~
$ git clone https://github.com/jiankaiwang/tcdc_opendataapi_nodejs_redis.git
```

* Install necessary packages.

```shell
$ npm install
```

* Edit the **index.js** and fill the configuration.

```javascript
// set the redis configuration
redisBackend.setRedisConf({ 
	"host" : "host",
	"port" : "port",
	"pwd" : "password"
});
```

* Edit the **index.js** and fill the api url and service parameters.

```javascript
// php-mysql-based api
var apiURL = "https://od.cdc.gov.tw";

// api service and its parameters
// for example: https://od.cdc.gov.tw/(opendataplatform)/?s=(dengue)&v=(a1)
// () means the information filled in apiService
var apiService = {
    "opendataplatform" : {
        "dengue" : ["a1", "a2"],
        "influlinechart" : ["a1"],
        "enterovirus" : ["a1"],
        "hivbc" : ["a1"],
        "diarrheapiechart" : ["a1"]
    }
};
```

* Establish the scheduling.

```shell
$ sudo vim /etc/crontab
```

```shell
# default running time is 8:30 am
30 8    * * *   user     /usr/bin/node /home/user/tcdc_opendataapi_nodejs_redis/index.js
```



## Verifying Cache Data

* Login the redis server.

```shell
$ redis-cli -h localhost -p port -a password
```

* Check the key.

```sql
/* show all keys */
> KEYS *

/* get specific value */
> GET opendataplatform_enterovirus_a1
```

* the example redis cache relative to key **opendataplatform_enterovirus_a1**

```
"\"[{\\\"yearweek\\\":\\\"2017_48\\\",\\\"coxsackie\\\":\\\"5\\\",\\\"enterovirus\\\":\\\"1\\\",\\\"positive\\\":\\\"15.6\\\",\\\"others\\\":\\\"1\\\"},{\\\"yearweek\\\":\\\"2017_49\\\",\\\"coxsackie\\\":\\\"6\\\",\\\"enterovirus\\\":\\\"0\\\",\\\"positive\\\":\\\"9.2\\\",\\\"others\\\":\\\"0\\\"},{\\\"yearweek\\\":\\\"2017_50\\\",\\\"coxsackie\\\":\\\"13\\\",\\\"enterovirus\\\":\\\"0\\\",\\\"positive\\\":\\\"15.9\\\",\\\"others\\\":\\\"0\\\"},{\\\"yearweek\\\":\\\"2017_51\\\",\\\"coxsackie\\\":\\\"15\\\",\\\"enterovirus\\\":\\\"1\\\",\\\"positive\\\":\\\"28.8\\\",\\\"others\\\":\\\"1\\\"},{\\\"yearweek\\\":\\\"2017_52\\\",\\\"coxsackie\\\":\\\"8\\\",\\\"enterovirus\\\":\\\"1\\\",\\\"positive\\\":\\\"21.4\\\",\\\"others\\\":\\\"3\\\"},{\\\"yearweek\\\":\\\"2018_01\\\",\\\"coxsackie\\\":\\\"5\\\",\\\"enterovirus\\\":\\\"0\\\",\\\"positive\\\":\\\"18.9\\\",\\\"others\\\":\\\"2\\\"},{\\\"yearweek\\\":\\\"2018_02\\\",\\\"coxsackie\\\":\\\"16\\\",\\\"enterovirus\\\":\\\"0\\\",\\\"positive\\\":\\\"31.5\\\",\\\"others\\\":\\\"1\\\"},{\\\"yearweek\\\":\\\"2018_03\\\",\\\"coxsackie\\\":\\\"10\\\",\\\"enterovirus\\\":\\\"0\\\",\\\"positive\\\":\\\"21.3\\\",\\\"others\\\":\\\"0\\\"}]\""
```

- the php-mysql-based api relative to key **opendataplatform_enterovirus_a1** (https://od.cdc.gov.tw/opendataplatform/?s=enterovirus&v=a1)

```
[{"yearweek":"2017_48","coxsackie":"5","enterovirus":"1","positive":"15.6","others":"1"},{"yearweek":"2017_49","coxsackie":"6","enterovirus":"0","positive":"9.2","others":"0"},{"yearweek":"2017_50","coxsackie":"13","enterovirus":"0","positive":"15.9","others":"0"},{"yearweek":"2017_51","coxsackie":"15","enterovirus":"1","positive":"28.8","others":"1"},{"yearweek":"2017_52","coxsackie":"8","enterovirus":"1","positive":"21.4","others":"3"},{"yearweek":"2018_01","coxsackie":"5","enterovirus":"0","positive":"18.9","others":"2"},{"yearweek":"2018_02","coxsackie":"16","enterovirus":"0","positive":"31.5","others":"1"},{"yearweek":"2018_03","coxsackie":"10","enterovirus":"0","positive":"21.3","others":"0"}]
```