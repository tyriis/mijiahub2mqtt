# mijiahub2mqtt
Service provides a bridge between xiaomi mijia bridge with development mode enabled and mqtt
inspired by [zigbee2mqtt](https://www.zigbee2mqtt.io/) and [node-xiaomi-smart-home](https://github.com/quibusus/node-xiaomi-smart-home)

## Limitations
currently not all devices are impelemented properly :/, feel free to create a ticket/pull request
when your device is not fully implemented you get a warning in the log
```
 ... <device-identifier> not implemented, please create an issue or pull request on Github.
```
if you create an issue, please leave all informations required: device name, device identifier from log, device type...

## Getting Started

### Prerequisites
- Node v12, NPM v6.14.5
- MQTT broker
<br>
<br>

### Setup

#### Installation
```bash
npm install
```


### ENV

|    | Description | Default |
|:---|:------------|:--------|
| **NODE_ENV** | _`production`_, _`development`_, _`test`_ | _`development`_ |
| **CONFIG_PATH** | path to configuration.yaml | _`./configuration.yaml`_ |
| **NODE_LOG_FORMAT** | _`SIMPLE`_, _`JSON`_ | _`JSON`_ |
| **NODE_LOG_LEVEL** | _`fatal`_,  _`error`_, _`warn`_, _`info`_, _`trace`_, _`debug`_ | _`info`_ |

<br>
<br>

### configuration.yaml
```yaml
# mqtt section
mqtt:
  # mqtt base topic, all messages get prefixed with this namespace
  baseTopic: mijiahub2mqtt
  # the mqtt server url
  server: mqtt://127.0.0.1
  # the default QoS for MQTT messages, can be overwritten in devices section, default is 0
  qos: 2
  # In case mqtts (mqtt over tls) is required, the options object is passed through to tls.connect(). If you are using a self-signed certificate, pass the rejectUnauthorized: false option. 
  rejectUnauthorized: false
devices:
  '0x000004cf8ca084d0':
    friendlyName: mijia hub
    retain: false
    qos: 0
  '0x00158d00027a108c':
    friendlyName: mijia motion office
    retain: true
    qos: 1

```

## Specification
The service communicates over udp port 9898 (multicast) with the mijia hub, and publish the sensor states to MQTT
<br>
<br>

## Development

### Testing
Automated tests can be run with the following command
```bash
# not implemented yet
npm run test
```

### Coverage Report
```bash
# not implemented yet
npm run coverage
```


### Development server
to start a self reloading dev server on udp port 9898 run:
```bash
npm run dev
```
<br>
<br>


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.
<br>
<br>

## Author
* **[Nils Müller](mailto:nils@mueller.name)** - *implementation*
