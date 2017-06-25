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
// Firebase Refs I want to u
var databaseRefPlayer = firebase.database().ref("/Player");
var databaseRefPOne = firebase.database().ref("/Player/One");
var databaseRefPTwo = firebase.database().ref("/Player/Two");
var databaseRefChat = firebase.database().ref("/Chat");
var databaseRefUserGuessedOne = firebase.database().ref("/Player/One/userGuessed");
var databaseRefUserGuessOne = firebase.database().ref("/Player/One/userGuess");
var databaseRefUserGuessTwo = firebase.database().ref("/Player/Two/userGuess");
var databaseRefUserGuessedTwo = firebase.database().ref("/Player/Two/userGuessed");

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
                databaseRefUserGuessedOne.set({
                    chose: false
                });
            } else if (!(snapshot.child("Two").exists())) {
                playerTwo = 2;
                databaseRefPTwo.set({
                    name: usernameInput,
                    wins: 0,
                    losses: 0
                });
                databaseRefUserGuessedTwo.set({
                    chose: false
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
function addPlayerTwoName() {
    databaseRefPTwo.child("name").on("value", function(snapshot) {
        talkShitGetHit();
        $("#nameArea").empty().append("<p class='headSize'>" + snapshot.val() + " you are Player 2!");
        $("#scoreOne").append('<br/><p>Wins: <span id="winsTwo">0</span>      Losses: <span id="lossesTwo">0</span></p>');
        $("#nameArea").append('<button id="disconnectTwo" class="btn btn-danger">Disconnect</button>');
        $("#disconnectTwo").on("click", function() {
            databaseRefPTwo.remove();
            playerTwo = 0;
            resetIfDisconnect();
            $("#nameArea").html('<input type="text" id="nameInput" placeholder="Enter name"><button id="nameSubmission" class="btn btn-danger">Submit</button>');
            getUserName();
        });
    }, function(error) {
        //Handle Error
    });

};
// This function will listen to the server and save some variables for me.
function listenUp () {
    databaseRefUserGuessOne.child("choice").on("value", function(snapshot) {
            userChoicePOne = snapshot.val();
            console.log("User 1 CHoice: " + userChoicePOne);
        },
        function(error) {
            alert("Oops we have an issue.....")
        });
    databaseRefUserGuessTwo.child("choice").on("value", function(snapshot) {
            userChoicePTwo = snapshot.val();
            console.log("User 2 CHoice: " + userChoicePTwo);
        },
        function(error) {
            alert("Oops we have an issue.....")
        });
    databaseRefUserGuessedOne.child("chose").on("value", function(snapshot) {
            playOneChose = snapshot.val();
            console.log("Player One Has Chosen? " + playOneChose)
        },
        function(error) {
            alert("Oops we have an issue.....")
        });
    databaseRefUserGuessedTwo.child("chose").on("value", function(snapshot) {
            playTwoChose = snapshot.val();
            console.log("Player One Has Chosen? " + playTwoChose)
        },
        function(error) {
            alert("Oops we have an issue.....")
        });
};
// This function uses basic logic to determine who wins
function whichOneTakesIt () {
    if (userChoicePOne === "rock") {
        if (userChoicePTwo === "rock") {
                $("#middleBox").append("<h3>You Tied!</h3>");
                
        } 
        else if (userChoicePTwo === "paper") {
                $("#middleBox").append("<h3>Player 2 Wins!</h3>");
        } 
        else {
                $("#middleBox").append("<h3>Player 1 Wins!</h3>");
        }
    }
    else if (userChoicePOne === "paper") {
        if (userChoicePTwo === "rock") {
                $("#middleBox").append("<h3>Player 1 Wins!</h3>");
        } 
        else if (userChoicePTwo === "paper") {
                $("#middleBox").append("<h3>You Tied!</h3>");
        } 
        else {
                $("#middleBox").append("<h3>Player 2 Wins!</h3>");
        }
    }
    else if (userChoicePOne === "scissors") {
        if (userChoicePTwo === "rock") {
                $("#middleBox").append("<h3>Player 2 Wins!</h3>");
        } 
        else if (userChoicePTwo === "paper") {
                $("#middleBox").append("<h3>Player 1 Wins!</h3>");
        } 
        else {
                $("#middleBox").append("<h3>You Tied!</h3>");
        }
    }
};
// This will combined some functions toogether to listen to the server and determine who wins.
function iAmPrettySureIWon() {
        listenUp();
    if ((playOneChose === true) && (playTwoChose === true)) {
        whatDidYouPickOne(userChoicePOne);
        whatDidYouPickTwo(userChoicePTwo);
        whichOneTakesIt();
        console.log("made it to choose");  
    } 
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
                    alert("nothing chosen");
            }
};
// This function will allow regeneration of choices
function bringThemBack() {
            $("#choicesToShowOne").empty();
            $("#choicesToShowTwo").empty();
            databaseRefUserGuessedOne.set(false);
            databaseRefUserGuessedTwo.set(false);
            databaseRefUserGuessOne.remove();
            databaseRefUserGuessTwo.remove();
            // Add a value listener that watches the user guess. if they dont exist tehn do this for all.
            databaseRefPlayer.on("value", function(snapshot) {
                if ((snapshot.child("One").exists()) && (snapshot.child("Two").exists())) {
                    $("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
                    if (playerOne === 1) {
                        var choicesToShowOne = $("<p class='choices' data-player='One' data-choice='rock'>Rock</p><p class='choices' data-player='One' data-choice='paper'>Paper</p><p class='choices' data-player='One' data-choice='scissors'>Scissors</p>");
                        $("#choicesToShowOne").html(choicesToShowOne);
                        $(".choices").on("click", function() {
                            databaseRefUserGuessedOne.set({
                                chose: true
                            });
                            userChoice = $(this).attr("data-choice");
                            userData = $(this).attr("data-player");
                            WhatAndWhereToPush();

                        });
                    }
                    if (playerTwo === 2) {
                        addPlayerTwoName();
                        $("#choicesToShowOne").empty();
                        $("#choicesToShowTwo").html(choicesToShowTwo);
                        $("#scoreTwo").append('<br/><p>Wins: <span id="winsTwo">0</span>      Losses: <span id="lossesTwo">0</span></p>');
                        $(".choices").on("click", function() {
                            databaseRefUserGuessedTwo.set({
                                chose: true
                            });
                            userChoice = $(this).attr("data-choice");
                            userData = $(this).attr("data-player");
                            WhatAndWhereToPush();

                        });
                    }



                }
            }, function(error) {
                alert("OOPS -- Something went wrong");
            });
};
function playerOneJoined () {
    if (playerOne === 1) {
        var choicesToShowOne = $("<p class='choices' data-player='One' data-choice='rock'>Rock</p><p class='choices' data-player='One' data-choice='paper'>Paper</p><p class='choices' data-player='One' data-choice='scissors'>Scissors</p>");
        $("#choicesToShowOne").html(choicesToShowOne);
        $(".choices").on("click", function() {
            databaseRefUserGuessedOne.set({
                chose: true
            });
            userChoice = $(this).attr("data-choice");
            userData = $(this).attr("data-player");
            $("#choicesToShowOne").html("<p>Waiting on Other Player.</p>");
            WhatAndWhereToPush();


        });
    }
};
function playerTwoJoined () {
    if (playerTwo === 2) {
        var choicesToShowTwo = $("<p class='choices' data-player='Two' data-choice='rock'>Rock</p><p class='choices' data-player='Two' data-choice='paper'>Paper</p><p class='choices' data-player='Two' data-choice='scissors'>Scissors</p>");
        addPlayerTwoName();
        $("#choicesToShowOne").empty();
        $("#choicesToShowTwo").html(choicesToShowTwo);
        $("#scoreTwo").append('<br/><p>Wins: <span id="winsTwo">0</span>      Losses: <span id="lossesTwo">0</span></p>');
        $(".choices").on("click", function() {
            databaseRefUserGuessedTwo.set({
                chose: true
            });
            userChoice = $(this).attr("data-choice");
            userData = $(this).attr("data-player");
            $("#choicesToShowTwo").html("<p>Waiting on Other Player.</p>");
            WhatAndWhereToPush();

        });
    }
};
// This function will generate the choices on the screen and then call another function to determine what to send off.
function generateChoices() {
            databaseRefPlayer.on("child_added", function(snapshot) {
                databaseRefPlayer.once("value", function(snapshot) {
                        if ((snapshot.child("One").exists()) && (snapshot.child("Two").exists())) {
                            $("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
                            playerOneJoined ();
                            playerTwoJoined();
                        
                        }
                });
            });
};
// This function determines when to show what the players chose and then tell who won
function whatDidYouPickOne(x) {
            switch (x) {
                case "rock":
                    $("#choicesToShowOne").html("<img alt='rock' src='images/rock.png' class='img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
                    break;
                case "paper":
                    $("#choicesToShowOne").html("<img alt='paper' src='images/paper.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                case "scissors":
                    $("#choicesToShowOne").html("<img alt='scissors' src='images/scissors.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                default:
                    alert("nothing chosen");
            }
            $("#middleBox").empty();
};

function whatDidYouPickTwo(y) {
            switch (y) {
                case "rock":
                    $("#choicesToShowTwo").html("<img alt='rock' src='images/rock.png' class='img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
                    break;
                case "paper":
                    $("#choicesToShowTwo").html("<img alt='paper' src='images/paper.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                case "scissors":
                    $("#choicesToShowTwo").html("<img alt='scissors' src='images/scissors.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
                    break;
                default:
                    alert("nothing chosen");
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
            // For testing purposes only
            $("#disconnect").on("click", function() {
                databaseRefPlayer.remove();
            });
            // body.addEventListener("unload", function () {
            //  alert("This Worked");
            // });




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
            // databaseRefUserGuessedTwo.child("chose").on("value", function (snapshot) {
            //     console.log(snapshot.val());
            //  shouldDisplayTwo = snapshot.val();
            //  if ((shouldDisplayOne === true) && (shouldDisplayTwo === true)) {
            // whatDidYouPickOne();
            // whatDidYouPickTwo();
            // iAmPrettySureIWon();
            // }; 
            // }, function (error) {
            //  alert("Oops looks like we srewed up.");
            // });
            // databaseRefUserGuessedOne.child("chose").on("value", function (snapshot) {
            //  shouldDisplayOne = snapshot.val();
            //  console.log(snapshot.val());
            //  if ((shouldDisplayOne === true) && (shouldDisplayTwo === true)) {
            // whatDidYouPickOne();
            // whatDidYouPickTwo();
            // iAmPrettySureIWon();
            // };
            // }, function (error) {
            //  alert("Oops looks like we srewed up.");
            // });
            

});