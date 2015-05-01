/* Cfnc by Arseniy Maximov <localhost@kern0.ru>
 * Licensed under MIT License:
  The MIT License (MIT)

  Copyright (c) 2015 Arseniy Maximov <localhost@kern0.ru> (http://kern0.ru)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 *
 * GitHub: https://github.com/Kern0/Cfnc
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  async = require('async'),
  Twitter = require('node-twitter');

var cfg = require('./config.js');

var twitterSearchClient = new Twitter.SearchClient(
  cfg.twitter_oauth.consumer_key,
  cfg.twitter_oauth.consumer_secret,
  cfg.twitter_oauth.token,
  cfg.twitter_oauth.token_secret
);

var app = express();

// all environments
app.set('port', cfg.port);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/confluence', function (req, res) {
  var obj = {
    count: {
      valerypopoff: null,
      people: null
    }
  };
  
  async.waterfall([
    function searchValerypopoffTweets(callback) {
      twitterSearchClient.search({
        'q': 'Confluence говно from:valerypopoff',
        'count': 100,
        'since_id': 0
      }, function (err, result) {
        if (err) {
          console.error('[ERROR] ' + (err.code ? err.code + ' ' + err.message : err.message));

          return callback(err);
        }

        if (result) {
          obj.count.valerypopoff = result.statuses.length;
          
          callback(null, obj);
        }
      });
    },
    function searchPeopleTweets(obj, callback) {
      twitterSearchClient.search({
        'q': 'Confluence говно',
        'count': 100,
        'since_id': 0
      }, function (err, result) {
        if (err) {
          console.error('[ERROR] ' + (err.code ? err.code + ' ' + err.message : err.message));

          return callback(err);
        }

        if (result) {
          obj.count.people = result.statuses.length;
          
          callback(null, obj);
        }
      });
    }
  ], function (err, obj) {
    if (err) {
      return res.json(500, {
        message: 'Something went wrong :(',
        status: 500
      });
    }
    
    res.json(obj);
  });
});


app.get('*', function (req, res) {
  res.send(';—)');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('[START] Started at ' + app.get('port') + ' port');
});
