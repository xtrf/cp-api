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