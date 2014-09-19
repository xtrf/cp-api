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