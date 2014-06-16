var request = require('request');
var cheerio = require('cheerio');

var prefix = process.env.HOSTURL || 'http://web.test.laterooms.com';

request('http://www.laterooms.com', function(error, response, body) {
	if(!error && response.statusCode == 200) {
		traverseLinks(body);
	} else {
		console.log(error);
		process.exit(1);
	}
});

function traverseLinks(body) {
	var $ = cheerio.load(body);

	if($('base').length) {
		prefix += '/en/'
	}

	$('a').each(function(i,val) {
		if(val.attribs.href && val.attribs.href.indexOf('javascript:void') === -1) {
			checkLink(val.attribs.href);
		}
	});
}

function checkLink(str) {
  var link = str;
  var tarea_regex = /^(http|www)/;
    if(tarea_regex.test(String(link).toLowerCase()) == false) {
      link = prefix + link;
    } 

	pingURL(link);
}

function pingURL(url) {
	request({url:url, strictSSL:false}, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			console.log('pass ==> ' + url);
		} else {
			console.log('fail ==> ' + error + ' - ' + url);
			process.exit(1);
		}
	});
}
