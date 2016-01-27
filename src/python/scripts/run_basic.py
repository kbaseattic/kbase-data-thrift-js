#!/usr/bin/env python
"""
Run basic end-to-end test
"""
__author__ = 'Dan Gunter <dkgunter@lbl.gov>'

# Stdlib
import argparse
import logging
import subprocess
import sys
import time
# Third-party
#from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer
from thrift.server.THttpServer import THttpServer
# Local
from kbtest.basic import thrift_service


# Logging boilerplate
_log = logging.getLogger('run_basic')
_h = logging.StreamHandler()
_h.setFormatter(logging.Formatter('%(asctime)s %(name)s %(levelname)s '
                                  '%(message)s'))
_log.addHandler(_h)
_log.setLevel(logging.INFO)

#: Server listen port
PORT = 9100


def run_cors_proxy(path, port):
    _log.info('Run CORS proxy. program={} port={}'.format(path, port))
    cmd = 'CORSPROXY_PORT={port} {bin}'.format(port=port, bin=path)
    proxy = subprocess.Popen(cmd, shell=True)
    _log.info('CORS proxy started. pid={}'.format(proxy.pid))
    return proxy

class BasicTestHandler(thrift_service.Iface):
    def get_a_map(self, mapkeys):
        _log.debug('get_a_map/start. keys={}'.format(mapkeys))
        result = {}
        i = 1
        for key in mapkeys:
            result[key] = 1.0 * i
            i += 1
        _log.debug('get_a_map/end. result={}'.format(result))
        return result

    def add_integers(self, x, y):
        _log.debug('add_integers/start. x={} y={}'.format(x, y))
        result = x + y
        _log.debug('add_integers/end. result={}'.format(result))
        return result

def main(cmdline):
    p = argparse.ArgumentParser()
    p.add_argument('-c', '--proxy', dest='proxy_bin', default='',
                   help='Run CORS proxy binary at PATH', metavar='PATH')
    p.add_argument('-p', '--port', dest='proxy_port', type=int, default=8000,
                   help='Run CORS proxy on PORT (default=%(default)d)',
                   metavar='PORT')
    p.add_argument('-v', '--verbose', action='count', dest='vb', default=0,
                   help='Increase verbosity of output to stderr')

    args = p.parse_args(cmdline)

    loglevel = [logging.WARN, logging.INFO, logging.DEBUG][min(args.vb, 2)]
    _log.setLevel(loglevel)

    use_proxy, proxy = bool(args.proxy_bin), None
    if use_proxy:
        proxy = run_cors_proxy(args.proxy_bin, args.proxy_port)

    handler = BasicTestHandler()
    processor = thrift_service.Processor(handler)
    #transport = TSocket.TServerSocket(port=PORT)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()
    server = THttpServer(processor, ('localhost', PORT), pfactory)

    _log.info('Start server. port={:d}'.format(PORT))
    try:
        server.serve()
    except KeyboardInterrupt:
        _log.info('Interrupted')
    _log.info('Server stopped')

    # Stop the proxy, if it was running
    if proxy is not None:
        _log.info('Stopping CORS proxy. pid={}'.format(proxy.pid))
        for i in range(3):
            proxy.terminate()
            time.sleep(1)
            proxy.poll()
            if proxy.returncode is not None:
                break
        if proxy.returncode is None:
            proxy.kill()
            time.sleep(2)
            proxy.poll()
        if proxy.returncode is None:
            _log.error('Failed to stop CORS proxy. pid={}'.format(proxy.pid))
        else:
            _log.debug('CORS proxy stopped.')

    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
