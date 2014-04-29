define([], function () {
  var uri = {};

  uri.defaultOptions = {
    scheme: 'http',
    host: 'isondev.net',
    parameterBase: '?'
  };

  uri.componentsOrder = ['scheme', 'username', 'password', 'host', 'port', 'path', 'parameterBase'];

  uri.schema = {
    scheme: '(^.^)://',
    username: '(^.^)',
    password: ':(^.^)@',
    host: '(^.^)',
    port: ':(^.^)',
    path: '/(^.^)',
    parameterBase: '/(^.^)'
  }

  return uri;
});
