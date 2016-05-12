var loopback = require('loopback');
module.exports = function(Track) {

  Track.addTrack = function(track, req, res, cb) {

    track.meta = req.cookies;
    track.headers = req.headers;
    delete track.headers.cookie;  // redundant
    track.timestamp = (new Date).getTime();

    cb(null, JSON.stringify(track));
  };
  Track.remoteMethod(
    'addTrack',
    {
      returns: {arg: 'ack', type: 'string'},
      http: {path: '/addtrack', verb: 'post'},
      accepts: [
        {arg: 'track', type: 'object'},
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ]
    }
  );
};




