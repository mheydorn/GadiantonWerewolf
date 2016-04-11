
angular.module('game', [])
.controller('MainCtrl', [
  '$scope','$http', '$window',
  function($scope,$http, $window){
	$scope.game = "";
	$scope.players = [];
	$scope.games = [{name : "test"}];
        $scope.playerRoles = {angel:$scope.angel, gadiantonRobber:$scope.gadiantonRobber, seer:$scope.seer, gadiantonSpy:$scope.gadiantonSpy, 
	gadiantonLeader:$scope.gadiantonLeader, nephiteSpy:$scope.nephiteSpy, nephite:$scope.nephite, executioner:$scope.executioner, 
	chiefJudge:$scope.chiefJudge, nephiteJudge:$scope.nephiteJudge, prophet:$scope.prophet, dead:$scope.dead, 
	missionaryLeader:$scope.missionaryLeader, traitor:$scope.traitor, assassin:$scope.assassin, apostate:$scope.apostate, 
	memberMissionary:$scope.memberMissionary}
	$scope.roles = "Assigning Role";
        $scope.playerImage = "gImages/" + $scope.roles + ".jpg";

	$scope.addGame = function(){
		console.log("Creating Game in controller");
		return $http.post('/createGame',{name: $scope.title,players: $scope.players}).success(function(data){
			console.log("Create Game Success");
		});
	};
	$scope.createGame = function(){
		console.log("Creating Game in controller with name" + $scope.createGameField);
		var title = $scope.createGameField;
		$scope.currentGame = title;
		$scope.createGameField = "";
    	        localStorage.setItem("gameName", title);
                //$window.location.href = '/narrator.html';
		return $http.post('/createGame',{name: title, players : 0}).success(function(data){if(data.checkError == "error"){alert("Game Name Already Exists!"); return;}else{$window.location.href = '/narrator.html';}
			console.log("Create Game Success");
		});
	};
	$scope.findGame = function(){
		localStorage.setItem("gameName", $scope.findGameField);
		console.log("In find game in controller looing for game " + $scope.findGameField);
		return $http.post('/joinGame', {q : $scope.findGameField, player :{name : $scope.playerName, playerstatus : "Living", role : "Not Assigned", side : "Good"}}).success(function(data){
			if(data.checkError == "error" ){alert("No such Game");return;} 
			console.log("***************************In controller, role is " + data.role + "and name is " + data.name);
			localStorage.setItem("role", data.role);
			localStorage.setItem("name", data.name);
			$window.location.href = '/playerScreen.html';
		}); 		
	
	};
	$scope.loginSubmit = function(){
		console.log("In loginSubmit in controller with value " + $scope.areYouNarrator + " and name " + $scope.createGamePlayerName
		+ " with game name " + localStorage.getItem("gameName"));
		$window.location.href = '/narrator.html';
	};
        $scope.getAll = function() {
    		return $http.get('/getAllGames').success(function(data){
			console.log("Got game Data!");
      			angular.copy(data, $scope.games);
    		});
  	};
	$scope.getAllPlayers = function(){
		$scope.game = localStorage.getItem("gameName");
		return $http.get('/getGame?q=' + localStorage.getItem("gameName")).success(function(data){
				console.log("Got player names");
				console.log(data[0].player_names);
				//$scope.players = [];
				//angular.copy(data[0].player_names, $scope.players);	
				for(var i = 0; i < data[0].player_names.length ; i++){
				
					if(i >= $scope.players.length){
						console.log("Copying in player "  + data[0].player_names[i].name);
						$scope.players.push({name : data[0].player_names[i].name, playerstatus :data[0].player_names[i].playerstatus, role : data[0].player_names[i].role, side : data[0].player_names[i].side});			
					}
			           if($scope.players[i].playerstatus != data[0].player_names[i].playerstatus){
                                                $scope.players[i] = data[0].player_names[i];
                                        }

				}
			});
	};
	$scope.endGame = function(){
		console.log("Ending Game");
		return $http.get('/removeGame?q=' + localStorage.getItem("gameName")).success(function(data){
				$window.location.href = '/start.html';
				alert("Game Ended Successfully");		
			});
		
	};
        $scope.startGame = function(){
		console.log("Starting Game");
		return $http.get('/startGame?q=' + localStorage.getItem("gameName")).success(function(data){
				$window.location.href = '/start.html';
				alert("Game Started Successfully");		
			});
		
	};
	$scope.getStatus = function(){
		console.log("Getting status");
		return $http.get('/getStatus?game=' + localStorage.getItem("gameName") + "&player="+localStorage.getItem("name")).success(function(data){
			if(data.playerstatus == "Killed"){
				$scope.roles = "Killed";
			        $scope.playerImage = "gImages/" + data.playerstatus + ".jpg";

			}else{
				$scope.roles = data.role;
        	                $scope.playerImage = "gImages/" + $scope.roles + ".jpg";
	
		        }
//			$scope.playerImage = "gImages/" + $scope.roles + ".jpg";
		});
	}
	$scope.kill = function(toKill){
		console.log("Killing " + toKill + " in game " + localStorage.getItem("gameName"));
		return $http.post('/kill', {tokill : toKill, game : localStorage.getItem("gameName")}).success(function(data){
				$scope.getAllPlayers();
			});
	}
	setInterval($scope.getStatus, 1000);
	var intervalID = setInterval($scope.getAllPlayers, 5000);
	$scope.getAllPlayers();	
	$scope.getAll();
  }
]);
