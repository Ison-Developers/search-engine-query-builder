require.config({
  paths: {
    underscore: '../../libs/underscore/underscore',
    uri: '../../src/options/uri'
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});
define(['underscore', 'uri'], function (_, uri) {

  var getInstance = function (schema, uriOpts) {
    this.schema = schema;
    this.uriOptions = {};
    var _this = this;

    this.queryString = '';
    this.options = {};
    this.templatePlaceHolder = '(^.^)'

    function makeUriComponents () {
      var output = '';
      uriOptions = _.extend({}, uri.defaultOptions, uriOpts);
      _.each(uri.componentsOrder, function (component, index) {
        if (uriOptions[component]) {
          output += uri.schema[component].
              replace(_this.templatePlaceHolder, uriOptions[component]);
        }
      });
      return output;
    }

    function makeQuery () {
      _this.queryString = '';
      _this.queryString += makeUriComponents();

      return _this.queryString;
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
