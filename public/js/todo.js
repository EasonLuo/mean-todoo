(function(){
	var todo = angular.module('Todoo',[]);
	todo.directive('ngEnter', function() {
	        return function(scope, element, attrs) {
	            element.bind("keydown keypress", function(event) {
	                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
	                    event.preventDefault();
	                }
	            });
	        };
	});
	todo.controller('todoController',['$scope','$http', function($scope, $http){
			$http.get('/todos').success(function(data){
				$scope.todos = data;
			});
			$scope.add = function(){
				var title = $scope.todo.title;
				if(title && title.trim()!=''){
					$http.post('/todos',$scope.todo).success(function(res){
						$scope.todos.push(res);
						$('input[ng-model="todo.title"]').val('').trigger('focus');
					});
				}
			};
			$scope.remove = function(id){
				//var id = $(elt).parents('li').data('id');
				//event.preventDefault();
				console.log(id);
				$http.delete('/todos/'+id).success(function(response){
					$(this).parent('li').remove();
				});
			};
		}]
	);
})();