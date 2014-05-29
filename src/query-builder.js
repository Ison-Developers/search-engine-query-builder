require.config({
  paths: {
    underscore: '../../libs/underscore/underscore',
    options: '../../src/options/query'
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});
define(['underscore', 'options'], function (_, defaultOptions) {
  /**
   *  this is the default uri object, you can customize
   *  it by passing a uri object to the getInstance method.
   */
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

  //The actual code for the query builder
  var getInstance = function (schema, uriOpts) {
    var _this = this;
    this.schema = schema;
    this.uriOptions = {};

    this.queryString = '';
    this.options = {};
    this.templatePlaceHolder = '(^.^)'

    function makeUriComponents () {
      var output = '';
      var uriOptions = _.extend({}, uri.defaultOptions, uriOpts);
      _.each(uri.componentsOrder, function (component) {
        if (uriOptions[component]) {
          output += uri.schema[component].
              replace(_this.templatePlaceHolder, uriOptions[component]);
        }
      });
      return output;
    }

    function makeParameters () {
      var output = [];
      var opts = _.extend({}, defaultOptions, _this.options );
      _.each(_this.options, function (opt, parameter) {
        if (opt) {
          var template = _this.schema[parameter];
          if (typeof template == 'string') {
            output.push(template.replace(_this.templatePlaceHolder, opt))
          } else if (typeof template == 'object') {
            if (opt.value) {
              output.push(template.types[opt.type].replace(_this.templatePlaceHolder, opt.value))
            }
          }
        }
      })
      return output.join('&');
    }

    function makeQuery (opt) {
      _this.options = opt;
      _this.queryString = '';
      _this.queryString += makeUriComponents();
      _this.queryString += makeParameters();

      return encodeURI(_this.queryString);
    }

    function updateUserOptions (opt) {
      _this.options = opt;
      return this;
    }

    return {
      update: updateUserOptions,
      make: makeQuery
    }
  }

  return {getInstance: getInstance}
});
