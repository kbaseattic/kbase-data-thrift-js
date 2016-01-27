#!/usr/bin/env python
"""
Add RequireJS header/footer to Thrift service and types files.
"""
__author__ = 'Dan Gunter <dkgunter@lbl.gov>'

import argparse
import logging
import os
import shutil
import sys

# Logging boilerplate
_log = logging.getLogger(os.path.splitext(os.path.basename(sys.argv[0]))[0])
_h = logging.StreamHandler()
_h.setFormatter(logging.Formatter('%(asctime)s %(name)s %(levelname)s '
                                  '%(message)s'))
_log.addHandler(_h)
_log.setLevel(logging.INFO)

# Global vars

# Prefix for locally defined RequireJS modules
rjs_prefix = 'kb_'

# Shared functions

def needs_modify(f, header, length=8):
    first_line = f.readline()
    match_header = first_line.startswith(header[:length])
    result = not match_header
    _log.debug('Tested header. file={} needs-modify={}'.format(f.name, result))
    return result

def modify_in_place(filename, header, footer):
    _log.debug('Modify in-place. file="{}"'.format(filename))
    orig = filename + '.orig'
    shutil.move(filename, orig)
    src, dst = open(orig), open(filename, 'w')
    dst.write(header)
    for line in src:
        dst.write(line)
    dst.write(footer)
    src.close()
    dst.close()
    _log.debug('Unlinking temporary file. file="{}"'.format(orig))
    os.unlink(orig)

# Service

service_header = '''/*global define */
/*jslint white:true */
define(["thrift", "{prefix}{api}_types"], function (Thrift, {api}) {{
"use strict";
'''

service_footer = '''
return {api};
}});
'''

get_service_file = lambda path: os.path.join(path, 'thrift_service.js')

def needs_modify_service(path):
    name = os.path.basename(path)
    return needs_modify(open(get_service_file(path)),
                        service_header.format(api=name, prefix=rjs_prefix))

def modify_service(path):
    name = os.path.basename(path)
    modify_in_place(get_service_file(path),
                    service_header.format(api=name, prefix=rjs_prefix),
                    service_footer.format(api=name))


# Types

types_header = '''/*global define */
/*jslint white:true */
define(["thrift"], function (Thrift) {{
"use strict";
var {api} = {{}};
'''

types_footer = '''
return {api};
}});
'''

get_types_file = lambda path: os.path.join(path,
                              '{}_types.js'.format(os.path.basename(path)))

def needs_modify_types(path):
    name = os.path.basename(path)
    return needs_modify(open(get_types_file(path)), types_header.format(
            api=name))

def modify_types(path):
    name = os.path.basename(path)
    modify_in_place(get_types_file(path), types_header.format(api=name),
                    types_footer.format(api=name))

# Main

def main(cmdline):
    p = argparse.ArgumentParser()
    p.add_argument('path', help='Path to directory containing Thrift stubs '
                                'thrift_service.py and <name>_types.py')
    p.add_argument('-v', '--verbose', action='count', dest='vb', default=0,
                   help='Increase verbosity of output to stderr')

    args = p.parse_args(cmdline)

    loglevel = [logging.WARN, logging.INFO, logging.DEBUG][min(args.vb, 2)]
    _log.setLevel(loglevel)

    path = args.path

    _log.info('Modifying Thrift stubs. path={}'.format(path))

    if needs_modify_service(path):
        _log.info('Modifying service file.')
        modify_service(path)
    else:
        _log.info('Not modifying service file.')

    if needs_modify_types(path):
        _log.info('Modifying types file.')
        modify_types(path)
    else:
        _log.info('Not modifying types file.')

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))