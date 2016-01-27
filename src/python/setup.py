#!/usr/bin/env python

from setuptools import setup

setup(name='kbtest',
      version='0.1',
      description='Basic end to end tests',
      author='Dan Gunter',
      author_email='dkgunter@lbl.gov',
      url='http://kbase.us',
      packages=['kbtest', 'kbtest.basic'],
      scripts=['scripts/run_basic.py', 'scripts/add_requirejs.py'],
)
