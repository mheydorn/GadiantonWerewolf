var mongoose = require('mongoose');
var GameSchema = new mongoose.Schema({
  name: String,
  players: {type: Number, default: 0},
  player_names: [{name : String, side : String, playerstatus : String, role : String}],
});
GameSchema.methods.incrementPlayers = function(cb){
	this.players += 1;
	this.save(cb);
};
GameSchema.methods.addPlayer = function(cb, name){
	//console.log(cb);
	this.player_names.push(cb);    //{name: cb,role:'Not Assigned', stat:'Dead'});
	//this.save(cb);
};
GameSchema.methods.killPlayer = function(cb, name){
	console.log("*************Start model killPlayer");	
        
//	this.player_names.push({name : 'Dead', side : 'Dead', playerstatus : 'Dead', role : 'ead'});
//        this.players += 100;                                                                                          
//	this.save(cb);

	console.log("Killing the player" + cb);
        //this.player_names.push({name : "Dead"});
        
	for(var i = 0; i < this.player_names.length; i++){
		if(this.player_names[i].name == cb){
		    console.log("Found the player to kill");
		    this.player_names[i].playerstatus = "Killed";
		    //this.player_names.push({name : "Dead"});
		}
	}
	this.save(cb);
	console.log("All done *************");
	
}
mongoose.model('Game', GameSchema);
