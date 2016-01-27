"""
Description.
"""
__author__ = 'Dan Gunter <dkgunter@lbl.gov>'
__date__ = '1/13/16'

# Stdlib
import argparse
import logging
import sys
import unittest
# Third-party
#from thrift.transport import TTransport
from thrift.transport import THttpClient
from thrift.protocol import TBinaryProtocol
# local
from kbtest.basic import thrift_service


# Logging boilerplate
_log = logging.getLogger('test_basic')
_h = logging.StreamHandler()
_h.setFormatter(logging.Formatter('%(asctime)s %(name)s %(levelname)s '
                                  '%(message)s'))
_log.addHandler(_h)
_log.setLevel(logging.INFO)

# Global variables
g_url = 'http://localhost:9100'

class TestBasic(unittest.TestCase):

    def setUp(self):
        self.url = g_url
        transport = THttpClient.THttpClient(self.url)
        protocol = TBinaryProtocol.TBinaryProtocol(transport)
        self.client = thrift_service.Client(protocol)
        transport.open()

    def test_add(self):
        result = self.client.add_integers(2, 3)
        print('Method add_integers: 2 + 3 = {:d}'.format(result))
        self.assertEqual(result, 5)

    def test_map(self):
        keys = []
        for letter_num in range(ord('a'), ord('e')):
            keys.append(chr(letter_num))
            result = self.client.get_a_map(keys)
            self.assertIsInstance(result, dict, 'Result is not a dict')
            for i in range(len(keys)):
                letter = chr(ord('a') + i)
                self.assertAlmostEqual(result[letter], (i + 1)*1.0, 4)


def main():
    global g_url

    p = argparse.ArgumentParser()
    p.add_argument('-s', '--host', dest='host', default='localhost',
                   help='Host part of url (default=%(default)s)')
    p.add_argument('-p', '--port', dest='port', default=9100,
                   help = 'Port part of url (default=%(default)d)')
    args, remaining = p.parse_known_args()

    g_url = 'http://{}:{}'.format(args.host, args.port)

    sys.argv = [sys.argv[0]] + remaining
    unittest.main()

if __name__ == '__main__':
    main()