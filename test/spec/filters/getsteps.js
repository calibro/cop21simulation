'use strict';

describe('Filter: getSteps', function () {

  // load the filter's module
  beforeEach(module('cop21App'));

  // initialize a new instance of the filter before each test
  var getSteps;
  beforeEach(inject(function ($filter) {
    getSteps = $filter('getSteps');
  }));

  it('should return the input prefixed with "getSteps filter:"', function () {
    var text = 'angularjs';
    expect(getSteps(text)).toBe('getSteps filter: ' + text);
  });

});
