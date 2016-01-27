

/**
 * Initializes a MutilplexProtocol Implementation as a Wrapper for Thrift.Protocol
 * @constructor
 */
Thrift.MultiplexProtocol = function (srvName, trans, strictRead, strictWrite) {
    Thrift.Protocol.call(this, trans, strictRead, strictWrite);
    this.serviceName = srvName;
};
Thrift.inherits(Thrift.MultiplexProtocol, Thrift.Protocol, 'multiplexProtocol');

/** Override writeMessageBegin method of prototype*/
Thrift.MultiplexProtocol.prototype.writeMessageBegin = function (name, type, seqid) {

    if (type === Thrift.MessageType.CALL || type === Thrift.MessageType.ONEWAY) {
        Thrift.Protocol.prototype.writeMessageBegin.call(this, this.serviceName + ":" + name, type, seqid);
    } else {
        Thrift.Protocol.prototype.writeMessageBegin.call(this, name, type, seqid);
    }
};

Thrift.Multiplexer = function () {
    this.seqid = 0;
};

/** Instantiates a multiplexed client for a specific service
 * @constructor
 * @param {String} serviceName - The transport to serialize to/from.
 * @param {Thrift.ServiceClient} SCl - The Service Client Class
 * @param {Thrift.Transport} transport - Thrift.Transport instance which provides remote host:port
 * @example
 *    var mp = new Thrift.Multiplexer();
 *    var transport = new Thrift.Transport("http://localhost:9090/foo.thrift");
 *    var protocol = new Thrift.Protocol(transport);
 *    var client = mp.createClient('AuthService', AuthServiceClient, transport);
 */
Thrift.Multiplexer.prototype.createClient = function (serviceName, SCl, transport) {
    if (SCl.Client) {
        SCl = SCl.Client;
    }
    var self = this;
    SCl.prototype.new_seqid = function () {
        self.seqid += 1;
        return self.seqid;
    };
    var client = new SCl(new Thrift.MultiplexProtocol(serviceName, transport));

    return client;
};

