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