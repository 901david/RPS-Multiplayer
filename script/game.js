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
var databaseRefPlayer = firebase.database().ref("/Player");
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
var userChoice; //Choice made R, P, S
var usernameInput; //Name user enters
var defaultUserName = "Guest"; //Default username if not name is entered
var playerOne = 0;
var playerTwo = 0;
var userChoicePOne;
var userChoicePTwo;
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
      chatEmUp();
      $("#nameArea").empty().append("<p class='headSize'>" + usernameInput + " you are Player 1</p><div id='disconnectOne' class='btn-lg btn-danger col-lg-4 col-lg-offset-2'>Disconnect</div>");
      $("#disconnectOne").on("click", function() {
        databaseRefPOne.remove();
        databaseRefChat.remove();
        playerOne = 0;
        resetIfDisconnect();
        $("#nameArea").html('<input type="text" id="nameInput" placeholder="Enter name"><button id="nameSubmission" class="btn btn-danger">Submit</button>');
      });

      databaseRefPOne.child("name").on("value", function(snapshot) {
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
  $("#choicesToShowOne").empty();
  $("#choicesToShowTwo").empty();
  $("#middleBox").empty();
  $("#scoreOne").empty();
  $("#scoreTwo").empty();
};
// Determines if we have two players or not but does not allow 3 or more
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
      $("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
    }, function(error) {
      alert("Something went wrong...OOPS!");
    });

    $("#choicesToShowOne").empty();
  }
};

// This function will change the Dom independently while players make a choice
function addPlayerTwoName () {
  databaseRefPTwo.child("name").on("value", function (snapshot) {
    chatEmUp();
    $("#nameArea").empty().append("<p class='headSize'>" + snapshot.val() + " you are Player 2!");
    $("#nameArea").append('<button id="disconnectTwo" class="btn-lg btn-danger col-lg-4 col-lg-offset-2">Disconnect</button>');
    $("#disconnectTwo").on("click", function () {
      databaseRefPTwo.remove();
      databaseRefChat.remove();
      playerTwo = 0;
      resetIfDisconnect();
      $("#nameArea").html('<input type="text" id="nameInput" placeholder="Enter name"><button id="nameSubmission" class="btn btn-danger">Submit</button>');
      getUserName();
    });
  }, function (error) {
    console.log("An Error occurred.");
  });

};
// After both have made a choice this shows images
function flashEmUp () {
  $(".one").removeClass("hide");
  $(".two").removeClass("hide");
  $(".removeMe").addClass("hide");
};
// This statement determines who wins
function whichOneTakesIt () {

  if (userChoicePOne === "rock") {
    if (userChoicePTwo === "rock") {
      $("#middleBox").empty();
      $("#middleBox").append("<h3>You Tied!</h3>");
      flashEmUp();
      setTimeout(function () {
        bringThemBack();
      }, 5000);

    }
    else if (userChoicePTwo === "paper") {
      $("#middleBox").empty();
      $("#middleBox").append("<h3>Player 2 Wins!</h3>");
      playerTwoWon ();
      flashEmUp();
      setTimeout(function () {
        bringThemBack();
      }, 5000);
    }
    else if (userChoicePTwo === 'scissors') {
      $("#middleBox").empty();
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
      $("#middleBox").empty();
      $("#middleBox").append("<h3>Player 1 Wins!</h3>");
      playerOneWon ();
      flashEmUp();
      setTimeout(function () {
        bringThemBack();
      }, 5000);
    }
    else if (userChoicePTwo === "paper") {
      $("#middleBox").empty();
      $("#middleBox").append("<h3>You Tied!</h3>");
      flashEmUp();
      setTimeout(function () {
        bringThemBack();
      }, 5000);
    }
    else if (userChoicePTwo === "scissors"){
      $("#middleBox").empty();
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
      $("#middleBox").empty();
      $("#middleBox").append("<h3>Player 2 Wins!</h3>");
      playerTwoWon ();
      flashEmUp();
      setTimeout(function () {
        bringThemBack();
      }, 5000);
    }
    else if (userChoicePTwo === "paper") {
      $("#middleBox").empty();
      $("#middleBox").append("<h3>Player 1 Wins!</h3>");
      playerOneWon ();
      flashEmUp();
      setTimeout(function () {
        bringThemBack();
      }, 5000);
    }
    else if (userChoicePTwo === "scissors"){
      $("#middleBox").empty();
      $("#middleBox").append("<h3>You Tied!</h3>");
      flashEmUp();
      setTimeout(function () {
        bringThemBack();
      }, 5000);
    }
  }
};
// This listens for players 2 wins
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
// This listen for players 1 wins
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

// This function will generate the choices on the screen and then call another function to determine what to send off to Database
function generateChoices () {
  databaseRefPlayer.on("child_added", function (snapshot) {
    databaseRefPlayer.once("value", function (snapshot) {
      if ((snapshot.child("One").exists()) && (snapshot.child("Two").exists())) {
        $("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
        playerOneJoined ();
        playerTwoJoined ();
      }
    }, function(error) {
      console.log("An Error occurred.");
    });
  }, function (error) {
    console.log("An Error occurred.");
  });
};
// This function takes the users selection and decides what player gave that input and also where to set in the database
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
  $("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
  $("#choicesToShowOne").empty();
  $("#choicesToShowTwo").empty();
  userChoicePOne = "";
  userChoicePTwo = "";
  databaseRefUserChoices.set({
    one: false,
    two: false
  });
  databaseRefUserGuessOne.remove();
  databaseRefUserGuessTwo.remove();
  playerOneJoined();
  playerTwoJoined();
};
// This function will update the images on the screens
function setUpListenersThatWillShowImages () {
  databaseRefUserGuessOne.child("choice").on("value", function(snapshot) {
    userChoicePOne = snapshot.val();
    databaseRefPTwo.once("value", function (snapshot){
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
// This function is called once player one joins and updates the server to let us know player 1 has joined
function playerOneJoined () {
  if (playerOne === 1) {
    $("#oneGrab").removeClass("oneScore");
    $("#twoGrab").removeClass("twoScore");
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
// This function is called once player two joins and updates the server to let us know player 2 has joined
function playerTwoJoined () {
  if (playerTwo === 2) {
    $("#oneGrab").removeClass("oneScore");
    $("#twoGrab").removeClass("twoScore");
    var choicesToShowTwo = $("<p class='choices' data-player='Two' data-choice='rock'>Rock</p><p class='choices' data-player='Two' data-choice='paper'>Paper</p><p class='choices' data-player='Two' data-choice='scissors'>Scissors</p>");
    addPlayerTwoName();
    $("#choicesToShowOne").empty();
    $("#choicesToShowTwo").html(choicesToShowTwo);
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
// This function determines when to show what the players chose and then calls the function that tells us who has won--for player one
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
};
// This function determines when to show what the players chose and then calls the function that tells us who has won--for player two
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
};
// This function will control chat capabilities
function chatEmUp() {
  databaseRefChat.on("value", function(snapshot) {
    let chats = snapshot.val();
    $(".boxCreate").empty()
    for (let key in chats) {
      $(".boxCreate").append("<p>" + chats[key] + "</p>");
    }

  });
  $("#clearSubmit").click(function() {
    databaseRefChat.remove();
    $(".boxCreate").empty();
  });
  $("#chatSubmit").click(function() {
    let tempvar = $("#chatInput").val().trim();
    if (tempvar === "") {
      console.log("No data provided");
    }
    else {
      databaseRefChat.push(usernameInput + ": " + tempvar);
      $("#chatInput").val("");
    }
  });
};
$(document).ready(function() {
  keepScore();
  databaseRefPlayer.onDisconnect().remove();
  databaseRefUserChoices.set({
    one: false,
    two: false
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
  setUpListenersThatWillShowImages();
});
