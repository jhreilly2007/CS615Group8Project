//This is the Model in the MVC
//User Schema

var mongoose = require('mongoose');
//requesta a schema
var Schema = mongoose.Schema;

// Setup userAuthentication Schema
//should add username
var UserSchema = new Schema({
	fName: {type: String, required: true, maxLength: 25},
	lName: {type: String, required: true, maxLength: 25},
	username: {type: String, required: true, minLength: 6, maxLength: 10},
    email: {type: String, required: true, unique: 1, trim: true},
    password: {type: String, required: true, minLength: 6}
});

//using bcrypt for hashing password
const bcrypt = require('bcrypt');
//Length of password-used in encryption
let SALT = 10;

//Hashing the password before saving it to the database//pre
UserSchema.pre('save', function(next){
	//refers to the user at signup
	var user =this; 
	
	//isModified checks that user entered something as password
	if(user.isModified('password')){
		bcrypt.genSalt(SALT, function(err, salt){
			if(err) return next(err);

			//if no error has and store password
			bcrypt.hash(user.password, salt, function(err, hash){
				if(err) return next(err);
				user.password = hash;
				next();
			})
		})
	}else{
		next()
	}
})

//method to compare passwords
UserSchema.methods.comparePassword = function(candidatePassword, checkpassword){
	
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return checkpassword(err)
		checkpassword(null, isMatch)
	})
}

module.exports = mongoose.model('User',UserSchema);
