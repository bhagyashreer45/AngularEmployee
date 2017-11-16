var app=angular.module('EmployeeApp',["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider.when('/',{
        templateUrl:'home.html'
    })
        .when('/login',{
            templateUrl:'Login.html'
        })
        .when('/empList',{
            templateUrl:'empList.html',
            controller: 'empListCtrl'
        })
        .when('/add',{
            templateUrl:'empDetail.html',
            controller:'empAddCtrl'
        })
        .when('/edit',{
            templateUrl:'empDetail.html',
            controller:'empEditCtrl'
        })
});

app.controller('loginCtrl',function ($scope, $location) {
    $scope.checkUser=function() {
        if($scope.myForm.uName.$viewValue!="Admin@gmail.com" || $scope.myForm.pswd.$viewValue!="Admin12!"){
            $scope.myForm.err="Enter Valid Username or Password";
        }
        else {
            $location.path("/");
        }
    }
});

app.service('empService', function ($http) {
    this.index=-1;

    this.dataArray="";
    this.getEmpData=function () {
        return $http.get('empData.json');
    };

});

app.controller('empListCtrl',function ($scope, empService, $location, $filter) {

     if(!empService.dataArray) {
         empService.getEmpData().then(function (resp) {
             empService.dataArray = resp.data;
             $scope.data = empService.dataArray;
         })
     }
     else{
         $scope.data = empService.dataArray;
     }
    $scope.addEmp=function(){
        $location.path('/add');
    };

    $scope.editEmp=function (id) {

            empService.index=id;
            //console.log(empService.dataArray[i].empId, $scope.data[id].empId);
        $location.path('/edit');
    };

    $scope.calcDate=function (bDate) {
        var ageDifMs = Date.now() - new Date(bDate);
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    $scope.deleteEmp=function (id) {
        var emp=angular.copy($scope.data[id]);
        if($scope.data.id===emp.id){
            $scope.data.splice($scope.data.indexOf($scope.data[id]),1)
        }
    }
});

app.controller('empAddCtrl', function ($scope, empService, $location) {
    $scope.user={};
    $scope.addData=function () {
        $location.path('/empList');
        empService.dataArray.push($scope.user);
    }
});

app.controller('empEditCtrl',function ($scope, $location, empService, $filter) {
    var i = empService.index;

    empService.dataArray[i].bDate = new Date($filter('date')(empService.dataArray[i].bDate, "MM/dd/yyyy"));
    console.log(empService.dataArray[i]);
    $scope.user = empService.dataArray[i];

    $scope.updateData=function () {
        empService.dataArray[i]=$scope.user;
        console.log(empService.dataArray[i]);
        $location.path('/empList');
    }
});

