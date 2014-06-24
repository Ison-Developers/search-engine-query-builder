require.config({
  paths: {
    solrSchema: '../../src/schemas/solr',
    especialSolrSchema: '../../src/schemas/especialSolrSchema'
  },
});

require([
  '../src/query-builder.js',
  'solrSchema',
  'especialSolrSchema',
  ], function (QueryBuilder, solrSchema, especialSolrSchema) {

  var commonOptions = {
    query: {
      type: 'and',
      value: 'This is my query'
    },
    startPage: 10
  };

  var commonUriOptions = {
    host: 'solr.myhost.com',
    path: 'solr/select',
    parameterBase: '?'
  };

  module('Query builder basics');

  test('QueryBuilder can be instantiated', function () {
    var qb = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    ok(qb !== null, 'passed');
  });

  test('uri contains scheme', function () {
    var uriOptions = { scheme: 'https' };
    var qb = new QueryBuilder.getInstance(uriOptions, {});
    ok( /^https:\/\//.test(qb.make()) , qb.make());
  });

  test('uri contains username & password', function () {
    var uriOptions = {
      scheme: 'https',
      username: 'user',
      password: 'pass'
    };
    var qb = new QueryBuilder.getInstance(uriOptions, {});
    ok( /^https:\/\/user:pass/.test(qb.make()) , qb.make());
  });

  test('calling make multiple times will return the same thing', function () {
    var uriOptions = { scheme: 'https' };
    var qb = new QueryBuilder.getInstance(uriOptions, {});
    ok(qb.make() == qb.make(), qb.make());
  });

  test('query builder uses default uri options correctly', function () {
    var uriOptions = {username: 'user', password: 'pass'};
    var qb = new QueryBuilder.getInstance(uriOptions, {});
    ok( /^http:\/\/user:pass@/.test(qb.make()), qb.make());
  });

  test('uri host name loads correctly', function () {
    var uriOptions = {
      username: 'user',
      password: 'pass',
      host: 'solr.myhost.com'
    };
    var qb = new QueryBuilder.getInstance(uriOptions, {});
    ok( /^http:\/\/user:pass@solr.myhost.com/.test(qb.make()), qb.make());
  });

  test('uri port loads correctly', function () {
    var uriOptions = {
      host: 'solr.myhost.com',
      port: '4545'
    };
    var qb = new QueryBuilder.getInstance(uriOptions, {});
    ok( /^http:\/\/solr\.myhost\.com:4545/.test(qb.make()), qb.make());
  });

  test('port number disapear if not specified', function () {
    var uriOptions = {
      host: 'solr.myhost.com'
    };
    var qb = new QueryBuilder.getInstance(uriOptions, {});
    ok( /^http:\/\/solr\.myhost\.com/.test(qb.make()), qb.make());
  });

  test('path loads correctly', function () {
    var qb = new QueryBuilder.getInstance(commonUriOptions, {});
    ok( /^http:\/\/solr\.myhost\.com\/solr\/select/.test(qb.make()), qb.make());
  });

  test('parameter parameterBase', function () {
    var qb = new QueryBuilder.getInstance(commonUriOptions, {});
    ok( /^http:\/\/solr\.myhost\.com\/solr\/select\/\?/.test(qb.make()), qb.make());
  });

  test('Only objects or string templates are accepted in options schema', function () {
    throws(
      function () {
        var qb = new QueryBuilder.getInstance(
          {noneStandardParameter: 'value'},
          {noneStandardParameter: []}
        );

        qb.make({noneStandardParameter: 'value'});
      },
      /none standard/,
      'Raised an error that contains none standard'
    );
  });

  test('pageSize parameter works', function () {
    var options = { pageSize : 10 };
    var qb = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    ok( /rows=10/.test(qb.make(options)), qb.make(options));
  });

  test('Multiple parameters concatenated with "&"', function () {
    var options = { pageSize : 10, startPage : 4 };
    var qb = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    ok( /&/.test(qb.make(options)), qb.make(options));
  });

  test('compelex query parameters work', function () {
    var options = {
      query: {
        type: 'and',
        value: 'This is my query'
      }
    };
    var qb = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    ok( /q=AND\(This%20is%20my%20query\)/.test(qb.make(options)), qb.make(options));
  });

  test('compelex query parameters work with normal query parameters', function () {
    var options = {
      query: {
        type: 'and',
        value: 'This is my query'
      },
      startPage: 10
    };
    var qb = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    ok( /q=AND\(This%20is%20my%20query\)/.test(qb.make(options)), qb.make(options));
    ok( /start=10/.test(qb.make(options)), qb.make(options));
    ok( /&/.test(qb.make(options)), qb.make(options));
  });

  test('string can be passed as uri options', function () {
    var qb = new QueryBuilder.getInstance('http://www.isondev.net', solrSchema);
    equal( qb.make(), 'http://www.isondev.net' );
  });

  test('make method can also update options', function () {
    var qb = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    equal( qb.make({startPage: 10}), 'http://solr.myhost.com/solr/select/?start=10');
    equal( qb.make({pageSize: 30}), 'http://solr.myhost.com/solr/select/?start=10&rows=30');
  });

  test('different place holders can be set via placeholder option', function () {
    var qb1 = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    var qb2 = new QueryBuilder.getInstance(commonUriOptions, especialSolrSchema);
    var options = {
      query: {
        type: 'and',
        value: 'This is my query'
      },
      startPage: 10
    };

    equal( qb1.make(options), qb2.make(options));
  });

  test('reset method deletes all previous options', function () {
    var qbBase = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    var qb1 = new QueryBuilder.getInstance(commonUriOptions, solrSchema);
    qb1.make(commonOptions);
    equal(qb1.reset().make(), qbBase.make());
  });

});
