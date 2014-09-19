'use strict';

var app = angular.module('apiIntegration', ['ngCookies']);


app.config(['$httpProvider', function($httpProvider) {
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  //disable IE ajax request caching
  $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);

var showSnippet = function(snippetID){
  console.log(snippetID);
  $("pre.bg-warning").hide();
  $(snippetID).show();
  $(snippetID).toggleClass('hide');
}


app.controller('mainController',function($scope, $http, $cookies, $q){
  $http.defaults.useXDomain = true;

  var deferredSession = $q.defer();
  var deferredLanguages = $q.defer();
  var deferredSpecializations = $q.defer();
  var deferredWorkflows = $q.defer();
  var deferredContactPersons = $q.defer();

  $scope.languages = [];
  $scope.workflows = [];
  $scope.specializations = [];
  $scope.contactPersons = [];
  $scope.customerID = null;
  $scope.session = null;
  $scope.quoteResponse = null;
  $scope.dictionariesLoaded = false;
  $scope.uploadedFiles = [];
  $scope.apiURL = 'http://xtrf-trunk1.dev.xtrf.eu/xtrf-api-rest/';
  $scope.userLogin = "C000001";
  $scope.userPassword = "Test123!";
  $scope.sendingQuote = false;
  $scope.originProblem = false;
  $scope.loginFailed = false;


  var getSession = function(success) {
    var sessionURL = $scope.apiURL + 'system/session.json;jsessionid='+$cookies.jsessionid;
    $.ajax({
      url: sessionURL,
      dataType: 'json',
      timeout : 5000,
      xhrFields: { withCredentials: true},
      success: function(data){
        if(data.type == "Customer")
          $scope.customerID = data.id;
        else if(data.type == "CustomerPerson")
          $scope.customerID = data.parentId;
        success(data);
      }

    });
  };

  $scope.logIn = function() {
    $scope.loginFailed = false;
    $scope.originProblem = false;
    $.ajax({
      url: $scope.apiURL + 'system/login',
      dataType: 'json',
      data: ({username :  $scope.userLogin, password: $scope.userPassword}),
      timeout:5000,
      type: "POST",
      xhrFields: { withCredentials: true},
      success: function(data) {
        $scope.loggedOut = false;
        console.log('logged in');
        $cookies.jsessionid = data.jsessionid;
        $scope.jsessionid = data.jsessionid;
        getSession(function(data){
          console.log('session loaded');
          $scope.session = data;
          deferredSession.resolve();
          $scope.$apply();

        });
      },
      error: function(XHR, textStatus, errorThrown){
        console.log(XHR);
        console.log(textStatus);
        console.log(errorThrown);
        console.log(XHR.status);
        if(XHR.status == '403' || XHR.status == 0){
          $scope.originProblem = true;
          $scope.$apply();
        };
        if(XHR.status == 401){
          $scope.loginFailed = true;
          $scope.$apply();
        }

      }

    });
  }

  $scope.getDictionaryValues = function(){
    loadLanguages();
    loadWorkflows();
    loadContactPersons();
    loadSpecializations();
  }


  $scope.logOut = function() {
    $scope.loggedOut = true;
    $cookies.jessionid = null;
    console.log('loggin out...');
    $.ajax({
      url: $scope.apiURL+'system/logout',
      dataType: 'json',
      xhrFields: { withCredentials: true},
      success: function(){

        console.log('logged out');
      }
    });
  };

  var loadLanguages = function() {
    /* you can also use $.ajax from jQuery like in getSession function */
    $.ajax({
      url: $scope.apiURL+'system/values/languages',
      dataType: 'json',
      xhrFields: { withCredentials: true},
      success: function(data){
        deferredLanguages.resolve();
        console.log('success')
        console.log(data);
        $scope.languages = data;
      },
      error:function(data){
        console.log('fail');
        console.log(data);
      }

    });
    /*angularjs version */
    /*  $http({method: 'GET', url: $scope.apiURL+'system/values/languages', withCredentials: true, dataType: 'json'}).
     success(function(data) {
     deferredLanguages.resolve();
     console.log('success')
     console.log(data);
     $scope.languages = data;
     }).
     error(function(data) {
     console.log('fail');
     console.log(data);
     });*/
  }

  var loadWorkflows = function() {

    $.ajax({
      url: $scope.apiURL+'system/values/workflows',
      dataType: 'json',
      xhrFields: { withCredentials: true},
      success: function(data){
        deferredWorkflows.resolve();
        console.log('success')
        console.log(data);
        $scope.workflows = data;
      },
      error:function(data){
        console.log('fail');
        console.log(data);
      }

    });

  }

  var loadSpecializations = function() {
    $.ajax({
      url: $scope.apiURL+'system/values/specializations',
      dataType: 'json',
      xhrFields: { withCredentials: true},
      success: function(data){
        deferredSpecializations.resolve();
        console.log('success')
        console.log(data);
        $scope.specializations = data;
      },
      error:function(data){
        console.log('fail');
        console.log(data);
      }

    });

  }


  var loadContactPersons = function() {
    $.ajax({
      url: $scope.apiURL+'customers/'+$scope.customerID+'/persons',
      dataType: 'json',
      xhrFields: { withCredentials: true},
      success: function(data){
        deferredContactPersons.resolve();
        console.log('success')
        console.log(data);
        $scope.contactPersons = data;
      },
      error:function(data){
        console.log('fail');
        console.log(data);
      }

    });

  }

  var getSampleJSON = function(languages, specializations, workflows, contactPersons){
    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var uniqueProjectNumber = getRandomInt(1,100000);


    var sampleJSON = {
      "name" : "Google Gloves",
      "customerProjectNumber" : uniqueProjectNumber,
      "workflow" : { "name" : "API-test-Input2output" }, //sample workflow
      "specialization" : { "name" : specializations[0].name},
      "sourceLanguage" : {"name" : languages[0].name},
      "targetLanguages" : [{"name" : languages[1].name},{"name" : languages[2].name}],
      "deliveryDate" : {formatted:"2014-10-20 00:00:00"},
      "notes" : "Sample notes",
      "autoAccept" : true,
      "person":{"id":contactPersons[0].id},
      "files" : [],
      "referenceFiles" : []
    };
    return sampleJSON;
  }

  $scope.uploadFile = function(files) {
    var fd = new FormData();
    fd.append("file", files[0]);
    $.ajax({
      url: $scope.apiURL+'system/session/files',
      type: 'POST',
      data: fd,
      xhrFields: { withCredentials: true},
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      success: function(data){
        $scope.uploadedFiles.push({filename:data[0].name, id: data[0].id});
        var tmpQuoteJSON = angular.fromJson($scope.jsonString);
        tmpQuoteJSON.files.push({id: data[0].id});
        $scope.jsonString = JSON.stringify(tmpQuoteJSON, null,"    ");
        $scope.$apply();
      },
      error:function(data){
        console.log('error while uploading file');
        console.log(data);
      }

    });

  };

  $scope.sendQuote = function(){
    $scope.sendingQuote = true;;
    var quoteData = angular.fromJson($scope.jsonString);
    $.ajax({
      url: $scope.apiURL+'quotes',
      type: 'POST',
      dataType:'json',
      contentType: "application/json",
      data:JSON.stringify(quoteData),
      xhrFields: { withCredentials: true},
      success: function(data){
        $scope.quoteResponse = data;
        $scope.sendingQuote = false;
        $scope.$apply();
      },
      error:function(data){
        console.log('sending quote failed');
        console.log(data);
        $scope.sendingQuote = false;
      }

    });

  }

  $scope.getProject = function(projectCustomerID){
    $.ajax({
      url: $scope.apiURL+'projects?customerProjectNumber='+projectCustomerID,
      dataType: 'json',
      xhrFields: { withCredentials: true},
      success: function(data){
        $scope.projectData = data[0];
        $scope.$apply();
      },
      error:function(data){
        console.log('getting project data failed');
        console.log(data);
      }

    });
  }

  $scope.getFiles = function(projectInternalID){
    $.ajax({
      url: $scope.apiURL+'projects/'+projectInternalID+'/files',
      dataType: 'json',
      xhrFields: { withCredentials: true},
      success: function(data){
        $scope.filesData = data;
        $scope.$apply();
      },
      error:function(data){
        console.log('getting files data failed');
        console.log(data);
      }
    });

  }


  /*when all dictionary values loaded create sample JSON using first values from array
   * promises are used to be sure that data are loaded
   * */
  $q.all([deferredContactPersons.promise, deferredLanguages.promise, deferredSpecializations.promise, deferredWorkflows.promise]).then(function(){
    $scope.dictionariesLoaded = true;
    $scope.jsonString = JSON.stringify(getSampleJSON($scope.languages, $scope.specializations, $scope.workflows, $scope.contactPersons), null,"    ");
  })



});