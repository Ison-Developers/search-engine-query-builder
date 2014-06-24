search-engine-query-builder
===========================
An powerful yet easy to use query builder for generating complex custom queries

#1. What can I do with it?
You can create pretty much any query string you want. All you need to do is to create a shim,a uri string and pass in the correct options.
You can have optional parameters, you can have parameters that have different keys based on user options and you can create uri options programatically

#2. Usage
Include the query-builder.js in your application or web page. there is also query-builder-amd for people using an AMD loader.
Now lest start by creating a small query builder instance. The first thing we need is a schema. A schema tells the query builder what parameters we will have in our query string.
create a schema like this:

<pre>
  <code>
    var schema = {
      keywords:'q=(^.^)',
      pageSize: 'rows=(^.^)',
      startPage: 'start=(^.^)'
    };
  </code>
</pre>

<code>(^.^)</code> Is our place holder, We thing it is cool but you can change it if you want. Now that we have a schema, we can create a new instance of the query builder.

<pre>
  <code>
    var myQueryBuilder = new QueryBuilder.getInstance('http://isondev.net/search/', schema);
  </code>
</pre>

In order to extract a query from this query generator we need to pass in some options. These options are the ones we specified when we where creating the shim object(query, pageSize, startPage).

<pre>
  <code>
    myQueryBuilder.make({
      keywords: 'some key word',
      pageSize: '20',
      startPage: '3'
    });
  </code>
</pre>

This should return a query string as fallow:

<pre>
  <code>
    http://isondev.net/search/q=some%20key%20word&rows=20&start=3
  </code>
</pre>

#3. API

<table>
  <tr>
    <td>Type</td>
    <td>Name</td>
    <td>Paramerters</td>
    <td>details</td>
  </tr>
  <tr>
    <td>function</td>
    <td>getInstance</td>
    <td>(uriObject | uriString, schema)</td>
    <td>Uri can be also an string just to make it easier to quickly create an instance</td>
  </tr>
  <tr>
    <td>function</td>
    <td>make</td>
    <td>optionsObject</td>
    <td>propeties of optionsObject is specified in your shema</td>
  </tr>
  <tr>
    <td>function</td>
    <td>reset</td>
    <td></td>
    <td>An easy way to remove all previous options form a query builder</td>
  </tr>
</table>

#4. Changing placeholder
In order to change the placeholder of your query builder pass in a shim with a field called <code>__placeholder </code> at it's root and you are done with it.
