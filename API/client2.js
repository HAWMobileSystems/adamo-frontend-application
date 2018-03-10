var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')

client.subscribe('IPIM');
 
client.on('message', function(topic, message) {
  console.log(message.toString());
});
 
console.log('Client started...');