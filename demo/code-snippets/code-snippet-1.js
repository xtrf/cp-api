$scope.logIn = function() {    //called when submit button clicked
  $.ajax({
    url: $scope.apiURL + 'system/login',
    dataType: 'json',
    data: ({username :  'yourUsername', password: 'yourPassword'}),
    timeout:5000,
    type: "POST",
    xhrFields: { withCredentials: true},
    success: function(data) {

      $cookies.jsessionid = data.jsessionid; //remember the cookie with sessionID
      getSession(function(data){
        $scope.session = data;
        deferredSession.resolve();
        $scope.$apply();

      });
    },
    error: function(XHR, textStatus, errorThrown){
      console.log(XHR);
      console.log(textStatus);   //handle errors   here
    }
  });
}

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
        $scope.customerID = data.parentId;     //if logged as Contact Person then customerID is your parentID
      success(data);
    }

  });
};