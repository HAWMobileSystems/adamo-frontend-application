var mosca = require('mosca');

var settings = {
  port: 1883,
  http: {
    port: 4711,
    bundle: true,
    static: './'
  },
  level: 'verbose'
};

function getMicSecTime() {
  var hrTime = process.hrtime();
  return hrTime[0] * 1000000 + parseInt(hrTime[1] / 1000);
}
//here we start mosca
var server = new mosca.Server(settings);
server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

// fired when a  client is connected
server.on('clientConnected', function (client) {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function (packet, client) {
  //console.log('Published : ', packet, Date.now());
  // console.log(`Published: ${packet.topic} ${packet.qos}  ${packet.payload.TIMESTAMP} ${new Date().getTime()}`);

  console.log(`Packet.payload ${packet.payload} payload contains ID ${packet.payload.ID}`)
  if (packet.payload.hasOwnProperty('TIMESTAMP') && packet.payload.hasOwnProperty('ID')) {
    console.log(`ServerTime:, ${ Date.now()}, Topic:, ${packet.topic}, TIMESTAMP:,${packet.payload.TIMESTAMP}, ID:, ${packet.payload.ID}`);
  }

});

// fired when a client subscribes to a topic
server.on('subscribed', function (topic, client) {
  console.log('subscribed : ', topic);
  if (topic.startsWith('MODEL/model')) {
    server.publish({
      //topic syntax: 'MODEL/model_ID_VERSION'
      topic: 'mqtt/subscribed/' + topic.split('_')[1] + '/' + topic.split('_')[2],
      payload: new Buffer(JSON.stringify(client.id)),
      qos: 1 // this is important for offline messaging
    });
  }
});

// fired when a client subscribes to a topic
server.on('unsubscribed', function (topic, client) {
  console.log('unsubscribed : ', topic);
  if (topic.startsWith('MODEL/model')) {
    server.publish({
      //topic syntax: 'MODEL/model_ID_VERSION'
      topic: 'mqtt/unsubscribed/' + topic.split('_')[1] + '/' + topic.split('_')[2],
      payload: new Buffer(JSON.stringify(client.id)),
      qos: 1 // this is important for offline messaging
    });
  }
});

// fired when a client is disconnecting
server.on('clientDisconnecting', function (client) {
  console.log('clientDisconnecting : ', client.id);
});

// fired when a client is disconnected
server.on('clientDisconnected', function (client) {
  console.log('clientDisconnected : ', client.id);
});