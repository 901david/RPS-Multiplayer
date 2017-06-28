// Defining and initializing FIrebase
var config = {
    apiKey: "AIzaSyBjl-QYq5haDTWJJ86zU5uuLfgJO1Ii4s8",
    authDomain: "rps-multiplayer-3f9db.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-3f9db.firebaseio.com",
    projectId: "rps-multiplayer-3f9db",
    storageBucket: "rps-multiplayer-3f9db.appspot.com",
    messagingSenderId: "401672091861"
};
firebase.initializeApp(config);

  // Firebase Refs I want to use
  var databaseRef = firebase.database();
  var databaseRefPlayer = firebase.database().ref("/Player");
  var databaseRefPlayerBothChosen = firebase.database().ref("/Player/doit");
  var databaseRefPOne = firebase.database().ref("/Player/One");
  var databaseRefPTwo = firebase.database().ref("/Player/Two");
  var databaseRefPOneWins = firebase.database().ref("/Player/One/wins");
  var databaseRefPTwoWins = firebase.database().ref("/Player/Two/wins");
  var databaseRefPOneLosses = firebase.database().ref("/Player/One/losses");
  var databaseRefPTwoLosses = firebase.database().ref("/Player/Two/losses");
  var databaseRefChat = firebase.database().ref("/Chat");
  var databaseRefUserGuessOne = firebase.database().ref("/Player/One/userGuess");
  var databaseRefUserGuessTwo = firebase.database().ref("/Player/Two/userGuess");
  var databaseRefUserChoices = firebase.database().ref("/Playerchoices");


// Definition of Variables
var userChoicePOne;
var userChoicePTwo;
var shouldDisplayOne;
var shouldDisplayTwo;
var userChoice; //Choice made R, P, S
var usernameInput; //Name user enters
var defaultUserName = "Guest"; //Default username if not name is entered
var wins = 0; //Wins starts at 0
var losses = 0; //Losses start at 0
var playerOneChose = false;
var playerTwoChose = false; //This will be used and eventually pushed to server to determine what to display on the screen
var playerOne = 0;
var playerTwo = 0;
var userChoicePOne;
var userChoicePTwo;
var playOneChose;
var playTwoChose;
var userTwoScore;


// This simply grabs the username input and sets it to a variable -than calls the function to determine if anotehr player should be added.
function getUserName() {
    $("#nameSubmission").click(function() {
        if (($("#nameInput").val().trim()) === "") {
            usernameInput = defaultUserName;
        } else {
            usernameInput = $("#nameInput").val().trim();
        };
        shouldWeAddAnother();
        if (playerOne === 1) {
            talkShitGetHit();
            $("#nameArea").empty().append("<p class='headSize'>" + usernameInput + " you are Player 1</p><div id='disconnectOne' class='btn-lg btn-danger col-lg-4 col-lg-offset-2'>Disconnect</div>");
            $("#disconnectOne").on("click", function() {
                databaseRefPOne.remove();
                playerOne = 0;
                resetIfDisconnect();
                $("#nameArea").html('<input type="text" id="nameInput" placeholder="Enter name"><button id="nameSubmission" class="btn btn-danger">Submit</button>');
            });

            databaseRefPOne.child("name").on("value", function(snapshot) {
                console.log(snapshot.val());
                $("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
            }, function(error) {
                alert("Something went wrong...OOPS!");
            });

        }
    });

};

// This function will reset the game if someone disconnects
function resetIfDisconnect() {
    window.location.reload();
    playerOneChose = false;
    playerTwoChose = false;
    $("#choicesToShowOne").empty();
    $("#choicesToShowTwo").empty();
    $("#middleBox").empty();
    $("#scoreOne").empty();
    $("#scoreTwo").empty();
};
// Determines if we have two players or not btu does not allow 3 or more
function shouldWeAddAnother() {
    databaseRefPlayer.once("value", function(snapshot) {
            if (!(snapshot.child("One").exists())) {
                playerOne = 1;
                databaseRefPOne.set({
                    name: usernameInput,
                    wins: 0,
                    losses: 0
                });
                
            } else if (!(snapshot.child("Two").exists())) {
                playerTwo = 2;
                databaseRefPTwo.set({
                    name: usernameInput,
                    wins: 0,
                    losses: 0
                });
                
            } else {
                alert("Too many players");
            }

        }),
        function(error) {
            alert("OOPS -- Something went wrong");
        };
    if (playerTwo === 2) {
        databaseRefPOne.child("name").on("value", function(snapshot) {
            console.log(snapshot.val());
            $("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
        }, function(error) {
            alert("Something went wrong...OOPS!");
        });

        $("#choicesToShowOne").empty();
    }
};

// This function will change the Dom independently while players make a choice.....hopefully
function addPlayerTwoName () {
	databaseRefPTwo.child("name").on("value", function (snapshot) {
		talkShitGetHit();
		$("#nameArea").empty().append("<p class='headSize'>" + snapshot.val() + " you are Player 2!");
		$("#nameArea").append('<button id="disconnectTwo" class="btn btn-danger">Disconnect</button>');
		$("#disconnectTwo").on("click", function () {
			databaseRefPTwo.remove();
			playerTwo = 0;
			resetIfDisconnect();
			$("#nameArea").html('<input type="text" id="nameInput" placeholder="Enter name"><button id="nameSubmission" class="btn btn-danger">Submit</button>');
			getUserName();
		});
	}, function (error) {
			//Handle Error
		});
	
};
function flashEmUp () {
    $(".one").removeClass("hide");
    $(".two").removeClass("hide");
    $(".removeMe").addClass("hide");
};
function whichOneTakesIt () {

    if (userChoicePOne === "rock") {
        if (userChoicePTwo === "rock") {
                $("#middleBox").append("<h3>You Tied!</h3>");
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
                
        } 
        else if (userChoicePTwo === "paper") {
                $("#middleBox").append("<h3>Player 2 Wins!</h3>");
                playerTwoWon ();
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        } 
        else if (userChoicePTwo === 'scissors') {
                $("#middleBox").append("<h3>Player 1 Wins!</h3>");
                playerOneWon ();
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        }
    }
    else if (userChoicePOne === "paper") {
        if (userChoicePTwo === "rock") {
                $("#middleBox").append("<h3>Player 1 Wins!</h3>");
                playerOneWon ();
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        } 
        else if (userChoicePTwo === "paper") {
                $("#middleBox").append("<h3>You Tied!</h3>");
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        } 
        else if (userChoicePTwo === "scissors"){
                $("#middleBox").append("<h3>Player 2 Wins!</h3>");
                playerTwoWon ();
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        }
    }
    else if (userChoicePOne === "scissors") {
        if (userChoicePTwo === "rock") {
                $("#middleBox").append("<h3>Player 2 Wins!</h3>");
                playerTwoWon ();
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        } 
        else if (userChoicePTwo === "paper") {
                $("#middleBox").append("<h3>Player 1 Wins!</h3>");
                playerOneWon ();
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        } 
        else if (userChoicePTwo === "scissors"){
                $("#middleBox").append("<h3>You Tied!</h3>");
                flashEmUp();
                setTimeout(function () {
                    bringThemBack();
                }, 5000);
        }
    }
};
// This listen for players 2 wins and modifies
function playerTwoWon () {
    databaseRefPTwoWins.once("value", function(snapshot) {
       
        var xvar = snapshot.val();
        xvar += 1;
            databaseRefPTwoWins.set(xvar);
            $("#winsTwo").html(xvar);
        }, function (errorObject) {
            console.log("The read failed.");
        });
    databaseRefPOneLosses.once("value", function(snapshot) {
        
        var yvar = snapshot.val();
        yvar += 1;
            databaseRefPOneLosses.set(yvar);
            $("#lossesOne").html(yvar);
        }, function (errorObject) {
            console.log("The read failed.");
        });
};
// This listen for players 2 wins and modifies
function playerOneWon () {
    databaseRefPOneWins.once("value", function(snapshot) {
        
        var xvar = snapshot.val();
        xvar += 1;
            databaseRefPOneWins.set(xvar);
            $("#winsOne").html(xvar);
    
        }, function (errorObject) {
            console.log("The read failed.");
        });
    databaseRefPTwoLosses.once("value", function(snapshot) {
        
        var yvar = snapshot.val();
        yvar += 1;
            databaseRefPTwoLosses.set(yvar);
            $("#lossesTwo").html(yvar);
        }, function (errorObject) {
            console.log("The read failed.");
        });
    
};

// This function will generate the choices on the screen and then call another function to determine what to send off.
function generateChoices () {
	databaseRefPlayer.on("child_added", function (snapshot) {
		databaseRefPlayer.once("value", function (snapshot) {
			if ((snapshot.child("One").exists()) && (snapshot.child("Two").exists())) {
				$("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
				playerOneJoined ();
				playerTwoJoined ();
            }
        }, function(error) {

        });
    }, function (error) {

    });
};
 // This function takes the users selection and decides what player gave that input and also where to set on server
function WhatAndWhereToPush() {
            switch (userChoice) {
                case "rock":
                    if (userData === "One") {
                        databaseRefUserGuessOne.set({
                            choice: "rock"
                        });
                    } else if (userData === "Two") {
                        databaseRefUserGuessTwo.set({
                            choice: "rock"
                        });;
                    }
                    break;
                case "paper":
                    if (userData === "One") {
                        databaseRefUserGuessOne.set({
                            choice: "paper"
                        });
                    } else if (userData === "Two") {
                        databaseRefUserGuessTwo.set({
                            choice: "paper"
                        });
                    }
                    break;
                case "scissors":
                    if (userData === "One") {
                        databaseRefUserGuessOne.set({
                            choice: "scissors"
                        });
                    } else if (userData === "Two") {
                        databaseRefUserGuessTwo.set({
                            choice: "scissors"
                        });
                    }
                    break;
                default:
                    console.log("Nothing to do");
            }
};
// This function will allow regeneration of choices
function bringThemBack() {
            $("#choicesToShowOne").empty();
            $("#choicesToShowTwo").empty();
            userChoicePOne = ""
            userChoicePTwo = ""
            databaseRefUserChoices.set({
                one: false,
                two: false
            })
            databaseRefUserGuessOne.remove();
            databaseRefUserGuessTwo.remove();
            playerOneJoined();
            playerTwoJoined();
         
};
// This function will update the images on the screens
function setUpListenersThatWillShowImages () {
    databaseRefUserGuessOne.child("choice").on("value", function(snapshot) {
            userChoicePOne = snapshot.val();
            console.log("User 1 CHoice: " + userChoicePOne);
            databaseRefPTwo.once("value", function (snapshot){
                console.log(snapshot.val());
                var fvar = snapshot.val();
                
            if (!(fvar.userGuess === "")) {

            whatDidYouPickOne(userChoicePOne);
            
            whichOneTakesIt();
            
            }
           
            });
        },
        function(error) {
            alert("Oops we have an issue.....")
        });
    databaseRefUserGuessTwo.child("choice").on("value", function(snapshot) {
            userChoicePTwo = snapshot.val();
            databaseRefPOne.once("value", function (snapshot){
                console.log(snapshot.val());
                var gvar = snapshot.val();
                
            if (!(gvar.userGuess === "")) {

            
            whatDidYouPickTwo(userChoicePTwo);
            whichOneTakesIt();
            
            }
           
            });
        },
        function(error) {
            alert("Oops we have an issue.....")
        });

};
// This updates score on screen
function keepScore () {
    $("#scoreOne").html('<br/><p class="oneScore" id="oneGrab">Wins: <span id="winsOne"></span>      Losses: <span id="lossesOne"></span></p>');
    $("#scoreTwo").html('<br/><p class="twoScore" id="twoGrab">Wins: <span id="winsTwo"></span>      Losses: <span id="lossesTwo"></span></p>');
        databaseRefPOneWins.on("value", function(snapshot) {
        var wvar = snapshot.val();
            databaseRefPOneWins.set(wvar);
            $("#winsOne").html(wvar);
        }, function (errorObject) {
            console.log("The read failed.");
        });
        databaseRefPOneLosses.on("value", function(snapshot) {
        var hvar = snapshot.val();
            databaseRefPOneLosses.set(hvar);
            $("#lossesOne").html(hvar);
        }, function (errorObject) {
            console.log("The read failed.");
        });
        
        databaseRefPTwoWins.on("value", function(snapshot) {
        var xvar = snapshot.val();
            databaseRefPTwoWins.set(xvar);
            $("#winsTwo").html(xvar);
        }, function (errorObject) {
            console.log("The read failed.");
        });
        databaseRefPTwoLosses.on("value", function(snapshot) {
        var yvar = snapshot.val();
            databaseRefPTwoLosses.set(yvar);
            $("#lossesTwo").html(yvar);
        }, function (errorObject) {
            console.log("The read failed.");
        });
       

};
function playerOneJoined () {
    if (playerOne === 1) {
        $("#oneGrab").removeClass("oneScore");
        var choicesToShowOne = $("<p class='choices' data-player='One' data-choice='rock'>Rock</p><p class='choices' data-player='One' data-choice='paper'>Paper</p><p class='choices' data-player='One' data-choice='scissors'>Scissors</p>");
        $("#choicesToShowOne").html(choicesToShowOne);
        
        $(".choices").on("click", function() {
            databaseRefUserChoices.update({
                one: true
            });
            userChoice = $(this).attr("data-choice");
            userData = $(this).attr("data-player");
            WhatAndWhereToPush();
            


        });
    }
};
function playerTwoJoined () {
    if (playerTwo === 2) {
        $("#twoGrab").removeClass("twoScore");
        var choicesToShowTwo = $("<p class='choices' data-player='Two' data-choice='rock'>Rock</p><p class='choices' data-player='Two' data-choice='paper'>Paper</p><p class='choices' data-player='Two' data-choice='scissors'>Scissors</p>");
        addPlayerTwoName();
        $("#choicesToShowOne").empty();
        $("#choicesToShowTwo").html(choicesToShowTwo);
        $("#scoreTwo").html('<br/><p id="twoScore">Wins: <span id="winsTwo"></span>      Losses: <span id="lossesTwo"></span></p>');
        $(".choices").on("click", function() {
            databaseRefUserChoices.update({
                two: true
            });
            userChoice = $(this).attr("data-choice");
            userData = $(this).attr("data-player");
            WhatAndWhereToPush();
            

        });
    }
};
// This function determines when to show what the players chose and then tell who won
function whatDidYouPickOne(x) {
            switch (x) {
                case "rock":
                    $("#choicesToShowOne").html("<p class='removeMe'>Waiting on Other Player</p><img alt='rock' src='images/rock.png' class='one hide img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
                    break;
                case "paper":
                    $("#choicesToShowOne").html("<p class='removeMe'>Waiting on Other Player</p><img alt='paper' src='images/paper.png' class='one hide img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                case "scissors":
                    $("#choicesToShowOne").html("<p class='removeMe'>Waiting on Other Player</p><img alt='scissors' src='images/scissors.png' class='one hide img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                default:
                    console.log("Nothing Chosen");
            }
            $("#middleBox").empty();
};

function whatDidYouPickTwo(y) {
            switch (y) {
                case "rock":
                    $("#choicesToShowTwo").html("<p class='removeMe'>Waiting on Other Player</p><img alt='rock' src='images/rock.png' class='two hide img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
                    break;
                case "paper":
                    $("#choicesToShowTwo").html("<p class='removeMe'>Waiting on Other Player</p><img  src='images/paper.png' class='two hide img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                case "scissors":
                    $("#choicesToShowTwo").html("<p class='removeMe'>Waiting on Other Player</p><img  alt='scissors' src='images/scissors.png' class='two hide img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                default:
                    console.log("Nothing Chosen");
            }
            $("#middleBox").empty();
};
// This function will control chat
function talkShitGetHit() {
            var tempvar;
            $("#clearSubmit").click(function() {
                databaseRefChat.remove();
                $(".boxCreate").empty();
            });
            $("#chatSubmit").click(function() {
                tempvar = $("#chatInput").val().trim();
                databaseRefChat.push(usernameInput + ": " + tempvar);
                $("#chatInput").val("");
            });
            databaseRefChat.on("child_added", function(snapshot) {
                $(".boxCreate").append("<p>" + snapshot.val() + "</p>");
            }, function(error) { //Handle Errors
            });
};
$(document).ready(function() {
            databaseRefUserChoices.set({
                one: false,
                two: false
            });
            // For testing purposes only
            $("#disconnect").on("click", function() {
                databaseRefPlayer.remove();
            });
           




            databaseRefPTwo.child("name").on("value", function(snapshot) {
                
                $("#nameSpotRight").html(snapshot.val()).addClass("slightlyBigger");

            }, function(error) {
                alert("Oops looks like we srewed up.");
            });
            databaseRefPOne.child("name").on("value", function(snapshot) {
                $("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
            }, function(error) {
                alert("Oops looks like we srewed up.");
            });
            getUserName();
            generateChoices();
            keepScore();
            setUpListenersThatWillShowImages();
           


           

});