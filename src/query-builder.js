require.config({
  paths: {
    underscore: '../../libs/underscore/underscore'
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});
define(['underscore'], function (_) {
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
  };

  /**
   *  this is the default user options, you can customize
   *  this by passing a new object into make query or update query
   */
  var defaultOptions = {
    rows: 20,
    start: 0,
    query: 'This is my query',
    dataType: 'json'
  };


  /**
   * The actual code for the query builder
   */
  var getInstance = function (schema, uriOpts) {
    var _this = this;
    this.schema = schema;
    this.uriOptions = {};

    this.queryString = '';
    this.options = {};
    this.templatePlaceHolder = '(^.^)';

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

    function isValidTemplate(tmpl) {
      if ( _.isString(tmpl) && tmpl.search(_this.templatePlaceHolder) ) {
        return true;
      } else if ( _.isObject(tmpl) && _.isObject(tmpl.types) ) {
        return true;
      }
      return false;
    }

    function makeSingleParameter(template, opt) {
      if ( _.isString(template) ) {
        return template.replace(_this.templatePlaceHolder, opt);
      } else if ( _.isObject(template) ) {
        if (opt.value) {
          return template.types[opt.type].replace(_this.templatePlaceHolder, opt.value);
        }
      }
      throw new Error('none standard template passed in.');
    }

    function makeParameters () {
      var output = [];
      var opts = _.extend({}, defaultOptions, _this.options );
      _.each(_this.options, function (opt, parameter) {
        if (opt) {
          var template = _this.schema[parameter];
          if (isValidTemplate(template)) {
            output.push(makeSingleParameter(template, opt));
          } else {
            throw new Error('none standard template found in your schema!');
          }
        }
      });
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
    };
  };

  return {getInstance: getInstance};
});
