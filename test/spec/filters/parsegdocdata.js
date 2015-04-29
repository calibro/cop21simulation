'use strict';

describe('Filter: parseGdocData', function () {

  // load the filter's module
  beforeEach(module('cop21App'));

  // initialize a new instance of the filter before each test
  var parseGdocData;
  beforeEach(inject(function ($filter) {
    parseGdocData = $filter('parseGdocData');
  }));

  it('should return the input prefixed with "parseGdocData filter:"', function () {
    var text = 'angularjs';
    expect(parseGdocData(text)).toBe('parseGdocData filter: ' + text);
  });

});
