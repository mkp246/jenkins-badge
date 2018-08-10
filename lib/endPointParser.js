function endPointParser(endpoint) {
    let proto = endpoint.match(/(.*?):/)[1];
    let hostPort = endpoint.match(/\/\/(.*?)\//)[1];
    let prefix = endpoint.match(/\/\/.*?\/(.*)/)[1];
    let hostPortParts = hostPort.split(':');
    let host = hostPortParts[0];
    let port = (hostPortParts.length == 2) ? hostPortParts[1] : (proto == 'http') ? 80 : 443;
    return [host, port, prefix];
}

module.exports = endPointParser;
