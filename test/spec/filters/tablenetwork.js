'use strict';

describe('Filter: tableNetwork', function () {

  // load the filter's module
  beforeEach(module('cop21App'));

  // initialize a new instance of the filter before each test
  var tableNetwork;
  beforeEach(inject(function ($filter) {
    tableNetwork = $filter('tableNetwork');
  }));

  it('should return the input prefixed with "tableNetwork filter:"', function () {
    var text = 'angularjs';
    expect(tableNetwork(text)).toBe('tableNetwork filter: ' + text);
  });

});
