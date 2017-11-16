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

app.controller('loginCtrl',function ($scope) {
    $scope.checkUser=function() {
        if($scope.myForm.uName.$viewValue!="Admin@gmail.com" || $scope.myForm.pswd.$viewValue!="Admin12!"){
            $scope.myForm.err="Enter Valid Username or Password";
        }
    }
});

app.service('empService', function ($http,$q) {
    this.index=-1;
    this.dataArray = [];
    //Trying it through $q logic
    var deferred = $q.defer();
    $http.get('empData.json').then(
        function(response) { // Success callback
            deferred.resolve(response.data); // Resolve
        },
        function(response) { // Error callback
            deferred.reject(response); // Reject
        }
    );
    this.getEmpData = function () {
        return deferred.promise;
};

    //This logic is not working properly I don't know why but promises work properly
    // this.getEmpData=function () {
    //   return $http.get('empData.json').then(function (response) {
    //       return response.data;
    //   });
    // };
});

app.controller('empListCtrl',function ($scope, empService, $location) {
    empService.getEmpData().then(function (res) {
        empService.dataArray = res;
        $scope.data=empService.dataArray;
        console.log('detail',$scope.data);
    });

    $scope.addEmp=function(){
        $location.path('/add');
    };

    $scope.editEmp=function (id) {
        empService.index=id;
        empService.obj = angular.copy($scope.data[id]);
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

app.controller('empAddCtrl', function ($scope, empService, $location, $filter) {
    $scope.user={
        'empId':'',
        'empName':'',
        'bDate':''
    };
    $scope.addData=function () {
        console.log($scope.user);
        // // var id=$scope.user.eid;
        // // var name=$scope.user.ename;
        // $scope.user.bDate= $filter('date')($scope.user.bDate, "MM/dd/yyyy");
        // var obj={'empId': id, 'empName': name, 'b,Date': dt};
        // if(empService.record===undefined) {
        //     empService.record = {'empId': id, 'empName': name, 'bDate': dt};
        // }
        // console.log(empService.array);
        $scope.emp=angular.copy($scope.user);
        $location.path('/empList');
        empService.dataArray.push($scope.emp);
        console.log(empService.dataArray);
        //console.log(empService.record);
    }
});

app.controller('empEditCtrl',function ($scope, $location, empService, $filter) {
    $scope.copyData=function () {
        $scope.eid=empService.obj.empId;
        $scope.ename=empService.obj.empName;
        $scope.bdate=new Date( $filter('date')(empService.obj.bDate, "MM/dd/yyyy"));
    };
    $scope.copyData();
    $scope.updateData=function () {
        var i=empService.index;
        empService.obj.empId=$scope.eid;
        empService.obj.empName=$scope.ename;
        empService.obj.bDate= $filter('date')($scope.bdate, "MM/dd/yyyy");

        empService.record=empService.obj;
       // console.log('empedit :'+empService.record);
        $location.path('/empList');
    }
});
