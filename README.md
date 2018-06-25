About:
======

Non-authenticated widget that allows faculty to input equations (using MathQuill) to create study tool widgets. This allows students to modify equation variables and see how it impacts the result.

Required dependences:
---------------------

* node
* yarn

To install & develop:
---------------------

1. Run `yarn`
2. Run `yarn peg:build` to build the PEG parser
3. Run `yarn start` to start the development server

Developing the parser:
----------------------

1. Run `yarn peg:watch`
2. Run `yarn start`

Changes to the parser will require a browser refresh

To build for production:
------------------------

1. Run `yarn build`