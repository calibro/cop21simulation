'use strict';

describe('Filter: parseSankey', function () {

  // load the filter's module
  beforeEach(module('cop21App'));

  // initialize a new instance of the filter before each test
  var parseSankey;
  beforeEach(inject(function ($filter) {
    parseSankey = $filter('parseSankey');
  }));

  it('should return the input prefixed with "parseSankey filter:"', function () {
    var text = 'angularjs';
    expect(parseSankey(text)).toBe('parseSankey filter: ' + text);
  });

});
