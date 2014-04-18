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

require(['../src/query-builder.js', 'underscore'], function (QueryBuilder) {

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
    var uriOptions = {
      host: 'solr.myhost.com',
      path: 'solr/select'
    };
    var qb = new QueryBuilder.getInstance({}, uriOptions);
    ok( /^http:\/\/solr\.myhost\.com\/solr\/select/.test(qb.make()), qb.make());
  })

});
