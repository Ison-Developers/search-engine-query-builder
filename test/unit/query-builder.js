require.config({
  paths: {
    underscore: '../../libs/underscore/underscore',
    solrSchema: '../../src/schemas/solr'
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});

require(['../src/query-builder.js', 'solrSchema', 'underscore'], function (QueryBuilder, solrSchema) {

  var commonUriOptions = {
    host: 'solr.myhost.com',
    path: 'solr/select',
    parameterBase: '?'
  };

  var solrSchema = solrSchema;

  module('Query builder basics');

  test('QueryBuilder can be instantiated', function () {
    var qb = new QueryBuilder.getInstance();
    ok(qb != null, 'passed');
  })

  test('update method supports chaining.', function () {
    var qb = new QueryBuilder.getInstance();
    var chain = qb.update({a: 'a1'});
    deepEqual(qb, chain, 'passed');
  })

  test('uri contains scheme', function () {
    var uriOptions = { scheme: 'https' };
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok( /^https:\/\//.test(qb.make()) , qb.make());
  })

  test('uri contains username & password', function () {
    var uriOptions = {
      scheme: 'https',
      username: 'user',
      password: 'pass'
    };
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok( /^https:\/\/user:pass/.test(qb.make()) , qb.make());
  })

  test('calling make multiple times will return the same thing', function () {
    var uriOptions = { scheme: 'https' };
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok(qb.make() == qb.make(), qb.make());
  })

  test('query builder uses default uri options correctly', function () {
    var uriOptions = {username: 'user', password: 'pass'};
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok( /^http:\/\/user:pass@/.test(qb.make()), qb.make());
  })

  test('uri host name loads correctly', function () {
    var uriOptions = {
      username: 'user',
      password: 'pass',
      host: 'solr.myhost.com'
    };
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok( /^http:\/\/user:pass@solr.myhost.com/.test(qb.make()), qb.make());
  })

  test('uri port loads correctly', function () {
    var uriOptions = {
      host: 'solr.myhost.com',
      port: '4545'
    };
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok( /^http:\/\/solr\.myhost\.com:4545/.test(qb.make()), qb.make());
  })

  test('port number disapear if not specified', function () {
    var uriOptions = {
      host: 'solr.myhost.com'
    };
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok( /^http:\/\/solr\.myhost\.com/.test(qb.make()), qb.make());
  })

  test('path loads correctly', function () {
    var qb = new QueryBuilder.getInstance({}, commonUriOptions);
    ok( /^http:\/\/solr\.myhost\.com\/solr\/select/.test(qb.make()), qb.make());
  })

  test('parameter parameterBase', function () {
    var qb = new QueryBuilder.getInstance({}, commonUriOptions);
    ok( /^http:\/\/solr\.myhost\.com\/solr\/select\/\?/.test(qb.make()), qb.make());
  })

  test('pageSize parameter works', function () {
    var options = { pageSize : 10 };
    var qb = new QueryBuilder.getInstance(solrSchema, commonUriOptions);
    ok( /rows=10/.test(qb.make(options)), qb.make(options));
  })

  test('Multiple parameters concatenated with "&"', function () {
    var options = { pageSize : 10, startPage : 4 };
    var qb = new QueryBuilder.getInstance(solrSchema, commonUriOptions);
    ok( /&/.test(qb.make(options)), qb.make(options));
  })

  test('compelex query parameters work', function () {
    var options = {
      query: {
        type: 'and',
        value: 'This is my query'
      }
    };
    var qb = new QueryBuilder.getInstance(solrSchema, commonUriOptions);
    ok( /q=AND\(This%20is%20my%20query\)/.test(qb.make(options)), qb.make(options));
  })

  test('compelex query parameters work with normal query parameters', function () {
    var options = {
      query: {
        type: 'and',
        value: 'This is my query'
      },
      startPage: 10
    };
    var qb = new QueryBuilder.getInstance(solrSchema, commonUriOptions);
    ok( /q=AND\(This%20is%20my%20query\)/.test(qb.make(options)), qb.make(options));
    ok( /start=10/.test(qb.make(options)), qb.make(options));
    ok( /&/.test(qb.make(options)), qb.make(options));
  })


});