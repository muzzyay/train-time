var config = {
    apiKey: "AIzaSyChx90nqmHuBBP49v2DDiFKYlAds5ucGS4",
    authDomain: "train-schedule-837c2.firebaseapp.com",
    databaseURL: "https://train-schedule-837c2.firebaseio.com",
    projectId: "train-schedule-837c2",
    storageBucket: "train-schedule-837c2.appspot.com",
    messagingSenderId: "610897255699"
  };
firebase.initializeApp(config);



var database = firebase.database();



$("#submit-button").on("click", function (event) {
    event.preventDefault();

    var tname = $("#train-name").val().trim();
    var tdestination = $("#destination").val().trim();
    var tFrequency = $("#frequency").val();
    var firstTime = $("#first-time").val().trim();


    database.ref().push({
        trainName: tname,
        trainDestination: tdestination,
        firstTime: firstTime,
        trainFrequency: tFrequency
        
    });

    $("#train-name").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#first-time").val("");

})


database.ref().on("child_added", function (childSnapshot) {

    var tFreq = childSnapshot.val().trainFrequency;
   
    var fTime = childSnapshot.val().firstTime;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(fTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFreq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



    var newTableItem = $("<tr>");
    var tableTrainName = $("<td>");
    tableTrainName.text(childSnapshot.val().trainName);
    var tableDestination = $("<td>");
    tableDestination.text(childSnapshot.val().trainDestination);
    var tableFrequency = $("<td>");
    tableFrequency.text(childSnapshot.val().trainFrequency);   
    var tableNextArrival = $("<td>");
    tableNextArrival.text(moment(nextTrain).format("hh:mm"));   
    var tableMinutesAway = $("<td>");
    tableMinutesAway.text(tMinutesTillTrain);
    
    newTableItem.append(tableTrainName);
    newTableItem.append(tableDestination);
    newTableItem.append(tableFrequency);
    newTableItem.append(tableNextArrival);
    newTableItem.append(tableMinutesAway);
    
    $("#table-body").append(newTableItem);



}, function (errorObject) {

    // In case of error this will print the error
    console.log("The read failed: " + errorObject.code);
})