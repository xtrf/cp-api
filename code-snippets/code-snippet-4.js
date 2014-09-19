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