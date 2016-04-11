var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = mongoose.model('Game');

router.get('/',function(req,res){
	console.log("In / route");
	res.sendFile('start.html', {root : 'public'});
});

router.post('/kill', function(req,res,next){
	var tokill = req.body.tokill;
	var game = req.body.game;
	console.log("Time to kill" + tokill + "in game " + game);
//	Game.update( {name: game}, { $pullAll: {uid: [req.params.deleteUid] } } )

	Game.find({name: game},function(err,games){
                if(err){return next(err);}
                if(games.length == 0){
 			console.log("Couldn't find game " + game);    
                        return;
                }
		console.log("Now calling models removePlayer");
		games[0].killPlayer(tokill);
	

		return;
        });
	res.json({message : "the deed is not done"});


});
router.get('/getStatus', function(req,res,next){
	var game = req.query.game;
	var player = req.query.player;
	Game.find({name: game},function(err,games){
		if(err){return next(err);}
		if(games.length == 0){
			res.json({error: "Can't get this player status because " + game + " is not a real game"});
			return;
		}
		//res.json(games[0]);
		if(games[0].player_names.length == 0){
			res.json({error : "Problem"});
			return;
		}
		for(var i = 0; i < games[0].player_names.length; i++){
			if(games[0].player_names[i].name == player){
				res.json({playerstatus : games[0].player_names[i].playerstatus, role : games[0].player_names[i].role});
				return;
			}
		}
		res.json({message: "That game exits but the player " + player + " is not found in the game " + game});
	});
			
});
router.post('/createGame',function(req,res,next){
	console.log("In Create Game Route POST");
	console.log(req.body.name);
	Game.find({name:req.body.name},function(err,games){
		if(err){return next(err);}
		if(games.length != 0){
			res.json({checkError : "error"});
			console.log("game with same name already exists!");
			return;
		}else{
      			var game = new Game(req.body);
      	  		game.save(function(err,game){
        	        	if(err){return next(err);}
	                	res.json({checkError : "No Error"});
       			});
		}
	});
});
router.get('/getGame',function(req,res,next){
	var q = req.query.q;
	console.log("In getGame route with q = " + q);
	Game.find({name: q},function(err,games){
		if(err){return next(err);}
		res.json(games);
	});
});
router.get('/getAllGames',function(req,res,next){
        console.log("Getting ALL games");
        Game.find(function(err,games){
                if(err){return next(err);}
                res.json(games);
        });
});
router.get('/removeGame', function(req, res, next){
	console.log("removing a game");
	var q = req.query.q;
	Game.remove({name: q}, function(err,games){
		if(err){return next(err);}
		res.json(games);
	})
	
})
router.post('/joinGame', function(req,res,next){
	console.log("In join Game route");
	var q = req.body['q'];
	var player = req.body.player;
        var otherPlayers = ["gadiantonSpy", "traitor", "angel", "prophet", "nephite", "executioner", "nephiteSpy", "apostate", "memberMissionary", "missionaryLeader", "assassin"];
	var randomeIndex = Math.floor((Math.random() * 10) + 1);
	var role;
	switch (randomeIndex){
		case 0:
			role = "gadiantonSpy";
			break;
		case 1:
			role = "traitor"
			break;
		case 2:
			role = "angel"
			break;
		case 3:
			role = "prophet";
			break;
		case 4:
			role = "nephite";
			break;
		case 5:
			role = "executioner";	
			break;
		case 6:
			role = "nephiteSpy";
			break;
		case 7:
			role = "apostate";
			break;
		case 8:
			role = "memberMissionary";
			break;
		case 9:
			role = "missionaryLeader";
			break;
		case 10:
			role = "assassin";
			break;

		}
	console.log("*******Randome index is " + randomeIndex);

        function shuffle(a) {
                var j, x, i;
                for (i = a.length; i; i -= 1) {
                        j = Math.floor(Math.random() * i);
                        x = a[i - 1];
                        a[i - 1] = a[j];
                        a[j] = x;
                }
        }
	if(randomeIndex == 5 || randomeIndex == 0 || randomeIndex == 1 || randomeIndex == 7 || randomeIndex == 10){
		player.side = "Evil";
	}else{
		player.side = "Good";
	}	
	shuffle(otherPlayers);
	player.role = role;
	var pid;
	console.log("Trying to add player " + player.name + " to game "  + q);
	Game.find({name: q},function(err,games){
		if(err){return next(err);}
		if(games.length == 0){
			res.json({checkError : "error"});
			return;
		}
		pid = games[0]['_id'];
	        Game.findById(pid,function(err,games){
        	        if(err){return next(err);}
                	res.json({name : player.name, checkError : "allGood", role : player.role, side : player.side});
               	 	games.incrementPlayers();
			games.addPlayer(player);
                        //games.addRole(role);
                        //games.addLivingStatus("Living");
                        //call angular with player name if array is not empty
                        //else put out error message
                
        	});
	});
});
router.post('/startGame', function(req, res, next){
	console.log("starting a game");
	//var q = req.query.q;
	function shuffle(a) {
        	var j, x, i;
    		for (i = a.length; i; i -= 1) {
        		j = Math.floor(Math.random() * i);
        		x = a[i - 1];
        		a[i - 1] = a[j];
        		a[j] = x;
    		}
	}
	function getPlayers(otherplayers, werewolfNum, chiefCheck) {
   		var playersLeft = 0;
   		for(var i = 0; i < werewolfNum; i++)
   		{
     			players.push("gadiantonRobber");
   		}
   		if(chiefCheck == TRUE)
   		{
     			for(var i = 0; i < 3; i++)
     		{
       			players.push("nephiteJudge");
     		}
     			playersLeft = numplayers - (werewolfNum + 3); 
   		}
   		else
   		{
      			playersLeft = numplayers - werewolfNum;
   		}
   			shuffle(otherplayers);
   		for (var i = 0; i < playersLeft; i++)
   		{
     			players.push(otherplayers[i]);
   		}
	}
	var otherPlayers = ["gadiantonSpy", "traitor", "angel", "prophet", "nephite", "executioner", "nephiteSpy", "apostate", "memberMissionary", "missionaryLeader", "assassin"]
	var players = [] 
	if(numplayers >= 8 <= 11)
	{
   		getPlayers(otherPlayers, 2);
	}
	else if(numplayers >= 12 && numplayers <= 17)
	{
   		players.push("gadiantonLeader");
   		getPlayers(otherPlayers, 3);
	}
	else if(numplayers == 18)
	{
   		players.push("gadiantonLeader");
   		getPlayers(otherPlayers, 4);
	}
	
})

module.exports = router;
