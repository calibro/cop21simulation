'use strict';

describe('Directive: fullSankey', function () {

  // load the directive's module
  beforeEach(module('cop21App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<full-sankey></full-sankey>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fullSankey directive');
  }));
});
