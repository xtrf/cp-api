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