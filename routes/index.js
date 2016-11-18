var twilio = require('twilio'), Hapi;
var http = require('http');

module.exports = function(hapi) {
  Hapi = hapi;
  return exports;
};

function spaceToPlus(string) {
	var new_str = '';
	for (var i = 0; i < string.length; i++) {
		if (string[i] == ' ') {
			new_str += '+';
		} else {
			new_str += string[i];
		}
	}
	return new_str;
};
 
var voteSMS = exports.voteSMS = function(request, reply) {
	var message = spaceToPlus(request['url']['query']['Body']);
	var resp = new twilio.TwimlResponse();

	var options = {
		  host: 'api.nytimes.com',
  		port: 80,
  		path: '//api.nytimes.com/svc/search/v2/articlesearch.json?q=' + message + '&page=0&sort=newest&fl=headline%2Cweb_url&api-key=4a62018fb6f59b7820aab280199bd928:6:73239861'
  	};

	var request = http.get(options, function(res, data) {
  		var body = '';
  		res.on('data', function(chunk) {
    		body += chunk;
  		});
  		res.on('end', function() {
    		var jsonObject = JSON.parse(body);
    		var articles = [];

    		for (var i = 0; i < 7; i++) {
    			articles.push((i + 1).toString() + '. ' + jsonObject['response']['docs'][i]['headline']['main'] + '\n' + jsonObject['response']['docs'][i]['web_url'] + '\n\n');
    		}

    		var allArticles = '';

    		for (var i = 0; i < articles.length; i++) {
    			allArticles += articles[i];
    		}

    		resp.message(allArticles);
			reply(resp.toString()).type('text/xml');
		});
  	});
};