$(function () {
  let recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;

  recognition.onresult = function (event) {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        $("#recognizedText").text(event.results[i][0].transcript);
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };

  $("#btnVoiceRecognition").click(function () {
    if (recognition.running) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  $("#btnSendVoiceText").click(function () {
    let message = $("#recognizedText").text();
    $("#messages").append("<div>" + message + "</div>");
    // Send the recognized text to the chat section

    // Clear the recognized text from the input field after sending
    $("#recognizedText").text("");
  });
});
