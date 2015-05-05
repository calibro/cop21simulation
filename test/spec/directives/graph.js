'use strict';

describe('Directive: graph', function () {

  // load the directive's module
  beforeEach(module('cop21App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<graph></graph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the graph directive');
  }));
});
