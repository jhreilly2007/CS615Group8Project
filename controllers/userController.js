//This is the Controller in the MVC

var User = require('../models/userModel');
const path = require("path");

//Authenticate User
exports.user_auth = function (request, response) {
    console.log(request.body);
    var user = new User(
        {
            fName: request.body.fName,
            lName: request.body.lName,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        }
    );
    user.save(function (err) {
        if (err) {
            var signupFailMessage =request.session.signupFailMessage = {
                signupFailMessage: 'Signup Failed!'
            };
            request.session.save();
            return response.render('index.ejs', signupFailMessage);

        } else
            request.session.user = {
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                password: user.password
            };
        request.session.save();

        //For testing
        console.log(request.session.user);
        console.log('Sign up successful!');
        response.redirect('/welcome');

    })
};

//Sign in
exports.user_signin = function (request, response) {
    //predefined function .findOne
    User.findOne({ 'email': request.body.email }, (err, user) => {
        //no email matching user, throw error
        if (!user) {
            var userNotFound =request.session.userNotFound = {
                userNotFound: 'Username not Found! Please try again'
            };
            request.session.save();
            return response.render("index.ejs", userNotFound);
        } else {

            //if emailed found, compare passwords
            user.comparePassword(request.body.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) {
                    var wrongPassword =request.session.wrongPassword = {
                        userNotFound: 'Wrong Password! Please try again'
                    };
                    request.session.save();
                    return response.render("index.ejs", wrongPassword);
                }
                request.session.user = {
                    fName: user.fName,
                    lName: user.lName,
                    email: user.email,
                    password: user.password
                };
                request.session.save();
                //responses are temporary for testing
                //response.send(request.session);//testing
                response.redirect('/welcome');//should send to a personalised page

            })
        }

    })
};

//Logout & delete stored session data
exports.user_logout = function (request, response) {
    if (request.session.user) {
        console.log(request.session.user)//just for testing
        delete request.session.user;
        response.redirect('/');//change routes as we develop
    } else {
        console.log('No session found')//just for testing
        response.redirect('/');//change routes as we develop
    }
};

exports.user_details = function (request, response) {
    if (request.session.user) {
        var userDetails = request.session.user;
        response.send(userDetails);
    } else {
        console.log('No session found')//just for testing
        response.send();
    }
};

exports.signup_failed = function (request, response) {
    if (request.session.signupfailed) {
        var signupFailed = request.session.signupfailed;
        console.log('Session found');//testing
        response.send(signupFailed);

    } else {
        console.log('Session not found')//testing
        response.send();
    }
};
