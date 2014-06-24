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
    __placeholder: '(^.^)',
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
   *  this by passing a new object into make function
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
  var getInstance = function (uriOpts, schema) {
    var _this = this;
    this.schema = schema;
    this.uriOptions = {};

    this.queryString = '';
    this.options = {};
    this.templatePlaceholder = schema.__placeholder || '(^.^)';

    function makeUriComponents () {
      if ( typeof uriOpts === 'string') { 
        return uriOpts;
      }
      var output = '';
      var uriOptions = extend({}, uri.defaultOptions, uriOpts);
      for( var i = 0; i <= uri.componentsOrder.length; i++) {
        var component = uri.componentsOrder[i];
        if (uriOptions[component]) {
          output += uri.schema[component].
              replace(uri.schema.__placeholder, uriOptions[component]);
        }
      }
      return output;
    }

    function isValidTemplate(tmpl) {
      if ( _.isString(tmpl) && tmpl.search(_this.templatePlaceholder) ) {
        return true;
      } else if ( _.isObject(tmpl) && _.isObject(tmpl.types) ) {
        return true;
      }
      return false;
    }

    function makeSingleParameter(template, opt) {
      if ( _.isString(template) ) {
        return template.replace(_this.templatePlaceholder, opt);
      } else if ( _.isObject(template) ) {
        if (opt.value) {
          return template.types[opt.type].replace(_this.templatePlaceholder, opt.value);
        }
      }
      throw new Error('none standard template passed in.');
    }

    function makeParameters () {
      var output = [];
      var opts = extend({}, defaultOptions, _this.options );
      for ( var parameter in _this.options) {
        if (_this.options.hasOwnProperty(parameter)) {
          opt = _this.options[parameter];
          if (opt) {
            var template = _this.schema[parameter];
            if (isValidTemplate(template)) {
              output.push(makeSingleParameter(template, opt));
            } else {
              throw new Error('none standard template found in your schema!');
            }
          }
        }
      }
      return output.join('&');
    }

    function makeQuery (opt) {
      _this.options = extend({}, _this.options, opt);
      _this.queryString = '';
      _this.queryString += makeUriComponents();
      _this.queryString += makeParameters();
      return encodeURI(_this.queryString);
    }

    function resetOptions () {
      _this.options = {};
      return this;
    }

    function extend(){
      for(var i=1; i<arguments.length; i++)
      for(var key in arguments[i])
      if(arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
      return arguments[0];
    }

    return {
      make: makeQuery,
      reset: resetOptions
    };
  };

  return {getInstance: getInstance};
});
