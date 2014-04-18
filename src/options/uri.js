define([], function () {
  var uri = {};

  uri.defaultOptions = {
    scheme: 'http',
    host: 'isondev.net'
  };

  uri.componentsOrder = ['scheme', 'username', 'password', 'host', 'port', 'path'];

  uri.schema = {
    scheme: '(^.^)://',
    username: '(^.^)',
    password: ':(^.^)@',
    host: '(^.^)',
    port: ':(^.^)',
    path: '/(^.^)'
  }

  // return function () {
  //   return Object.create(defaultUriOptions);
  // }
  return uri;
});
