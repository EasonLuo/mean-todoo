(function(){

// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
var todo = angular.module('Todoo', ['ui.router'])

// configuring our routes E
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider.state('request', {
            url: '/request',
            templateUrl: 'templates/request.html',
            controller: 'requestController'
        }).state('request.contact', {
            url: '/contact',
            templateUrl: 'templates/request-contact.html'
        }).state('request.business', {
            url: '/business',
            templateUrl: 'templates/request-business.html'
        }).state('request.content', {
            url: '/content',
            templateUrl: 'templates/request-content.html'
        });
    $urlRouterProvider.otherwise(function($injector, $location) {
            var $state = $injector.get("$state");
            $state.transitionTo("request.contact");
        });
}).controller('requestController', ['$scope','$http', '$state',function($scope, $http, $state) {
	event.preventDefault();
	$scope.request = {};
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
		var parts = fromState.name.split('.');
		var i=0;
		var part = null;
		var tmp = $scope;
		while(part = parts[i++]){
			if(tmp[part]){
				tmp = tmp[part];
			}
		}
		// console.log(tmp);
		$http.post('/request'+fromState.url+'/validate',tmp).then(function(response){
			var content = "<ul>";
			var data = response.data;
			for(var prop in data){
				content += "<li><strong>"+prop+"</strong> : "+data[prop]+"</li>";
			}
			content += "</ul>";
			jQuery('#request-summary').append(content);
			$state.transitionTo(toState.name,toParams);
		});
	});
	$scope.processForm = function() {
        alert('awesome!');  
    };
    
}]);


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
/*
	todo.directive('stepoForm', function(){
		return {
			restrict: 'A',
			replace: true,
			controller: function($scope, $element, $attrs){
				$scope.current = $attrs.current;
				console.log('parent controller');
			},
			compile : function(){
				console.log('parent compile');
				return {
					pre: function(scope, element, attrs){ console.log('parent pre-link');},
					post: function (scope, element, attrs){console.log('parent post-link')}
				};
			}
		};
	});

	todo.directive('stepoStep', function($http, $compile){
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				current: '@currentAttr',
				next: '=?'
			},
			controller: function ($scope, $element){
				console.log('child controller');
			},
			compile: function (element, attrs){
				console.log('child compile');
				return { 
					pre : function (scope, element, attrs){console.log('child pre-link');},
					post: function(scope, element, attrs){
						console.log('child post-link');
						$http.get(attrs.template).success(function(content){
							element.html(content);
							$compile(element.contents())(scope);
						});
					}
				};
			}
		};
	});
	*/

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