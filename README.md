# xiaomi2mqtt
Service provides a bridge between xiaomi mijia bridge with development mode enabled and mqtt
inspired by [zigbee2mqtt](https://www.zigbee2mqtt.io/) and [node-xiaomi-smart-home](https://github.com/quibusus/node-xiaomi-smart-home)

## Getting Started

### Prerequisites
- Node v12, NPM v6.14.5
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
| **MQTT_BASE_TOPIC** | the mqtt base topic | `xiaomi2mqtt` |
| **MQTT_URL**\* | mqtt server url |  |
| **MQTT_QOS** | mqtt QoS: _`0`_, _`1`_, _`2`_ | `0` |
| **NODE_LOG_FORMAT** | _`SIMPLE`_, _`JSON`_ | `JSON` |
| **NODE_LOG_LEVEL** | _`fatal`_,  _`error`_, _`warn`_, _`info`_, _`trace`_, _`debug`_ | `info` |
(\*) required
<br>
<br>

## Specification
The service communicates over udp port 9898 (multicast) with the mijia hub.
<br>
<br>

## Development

### Testing
Automated tests can be run with the following command
```bash
npm run test
```

### Coverage Report
```bash
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
