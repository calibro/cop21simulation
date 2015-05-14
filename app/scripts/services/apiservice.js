'use strict';

/**
 * @ngdoc service
 * @name cop21App.apiService
 * @description
 * # apiService
 * Factory in the cop21App.
 */
angular.module('cop21App')
  .factory('apiService', function ($q, $http) {

    var googleDriveBaseUrl = 'https://docs.google.com/spreadsheets/d/';

    return {
      getGoogleDriveDoc: function (id, params) {
        var deferred = $q.defer();
       $http({
          method: 'JSONP',
          url : googleDriveBaseUrl + id + '/gviz/tq',
          params : params
        }).success(function(data){
         deferred.resolve(data);
       }).error(function(){
         deferred.reject('An error occured while fetching data');
       });

       return deferred.promise;
     },
     getFile : function(url){
  var deferred = $q.defer();
  $http.get(url).success(function(data){
    deferred.resolve(data);
  }).error(function(){
    deferred.reject('An error occured while fetching file');
  });

  return deferred.promise;
},
  getTable: function(id){
    var deferred = $q.defer();
    Tabletop.init({
          key: id,
          simpleSheet: true,
          parseNumbers: true,
          callback: function(data, tabletop) {
            deferred.resolve(data);
          }
        });
        return deferred.promise;
  }
    };
  });
