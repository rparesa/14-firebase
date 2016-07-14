'use strict';

var app = angular.module('ChirperApp', ["firebase"]);

app.controller('ChirperCtrl', ['$scope', '$firebaseAuth', '$firebaseObject','$firebaseArray', function ($scope, $firebaseAuth, $firebaseObject, $firebaseArray) {

	// putting a console.log here won't work, see below
	//name as Auth because it's like a class!
	var Auth = $firebaseAuth();

	//get reference to the "root" of the database: the containing JSON
	var baseRef = firebase.database().ref();
	  // Get a reference to the database service
  var database = firebase.database();


	var usersRef = baseRef.child('users'); //refers to "users" value
		//assign the "users" value to $scope.users
	$scope.users = $firebaseObject(usersRef);


	$scope.newUser = {}; //empty object to start
	$scope.signUp = function () {
		Auth.$createUserWithEmailAndPassword($scope.newUser.email, $scope.newUser.password)
			.then(function (firebaseUser) {
				var newUserRef = usersRef.child(firebaseUser.uid);
	
				console.log('user created: ' + firebaseUser.uid);
				newUserRef.set(userData); //set the key's value to be the object you created
			})
			.catch(function (error) { //report any errors
				console.log(error);
			});
	}
	Auth.$onAuthStateChanged(function (firebaseUser) {
		if (firebaseUser) {
			console.log('logged in');
		$scope.userId = firebaseUser.uid;

			//assign firebaseUser.uid to $scope.userId
		}
		else {
			console.log('logged out');
			//assign undefined to $scope.userId
					$scope.userId = undefined;
		}
	});

	//respond to "Sign Out" button
	$scope.signOut = function () {
		Auth.$signOut(); //AngularFire method
	};

	//respond to "Sign In" button
	$scope.signIn = function () {
		Auth.$signInWithEmailAndPassword($scope.newUser.email, $scope.newUser.password); //AngularFire method
	};


	$scope.chirppad = {};


	var padRef = baseRef.child('chirppad');
	var chirpPadObj = $firebaseObject(padRef);  
	chirpPadObj.$bindTo($scope, "chirppad");
	var chirpsRef = baseRef.child('chirps');
		$scope.chirps = $firebaseArray(chirpsRef)
		$scope.newChirp = {};
	var userRef = baseRef.child('users');
	var userId = $firebaseObject(userRef);  
	userId.$bindTo($scope, "users");
	var chirperDatabase = baseRef.child('user');	
			$scope.handle = chirperDatabase.users[userId].handle;
			$scope.avatar = chirperDatabase.users[userId].avatar;
;

		$scope.postChirp = function(){
		var chirpData = {
   			 text: $scope.chirppad.txt,
    		userId: $scope.userId,
   			 likes: 0,
    		time: firebase.database.ServerValue.TIMESTAMP        
			}
			console.log(chirpData);
			$scope.chirps.$add(chirpData).then(chirpData.text='');
		}
}]);