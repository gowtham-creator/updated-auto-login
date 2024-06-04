// to know about all available voices

let synth = window.speechSynthesis;

// Wait on voices to be loaded before fetching list
synth.onvoiceschanged = function() {
    let voices = synth.getVoices();
    voices.forEach(function(voice) {
        console.log('Voice: ', voice.name);
    });
};


const statusEl = document.getElementById("MSPL_status_page");
const inputEl = document.getElementById("MSPL_homepage");
voiceAssistantActivated = false;
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === "Google UK English Female");
  speechSynthesis.speak(utterance);
}


navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

navigator.getUserMedia(
  { audio: true },
  (stream) => {
    function closeWindow() {
      if (inputEl && inputEl.value === "MSPL_homepage") {
        window.close();
      }
    }

    function statusChanger(text) {
      if (statusEl) {
        statusEl.innerText = text;
      }
      console.log(text);
    }

    speak("Voice activated Say start MSPL");
    speak();
    speak("To Know more about the possible commands click on the commands button in the webpage.");


    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition;

    let activatedVoice = false;
    let speechResult = "";

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = (event) => {
      speechResult = event.results[0][0].transcript;
      console.log(speechResult);
    };

    recognition.onend = async () => {
      if (
        speechResult.toLowerCase().slice(0, 10) === "start mspl" &&
        !activatedVoice
      ) {
        activatedVoice = true;
        voiceAssistantActivated = true;
        speak("Welcome To MSPL")
        speak(" Transforming industries through digital engineering excellence and sustainable innovation");
 
      } else if (
        speechResult.toLowerCase().slice(0, 5) === "begin" && !activatedVoice)
        {
        activatedVoice=true;
        voiceAssistantActivated = true;
        speak("Welcome To MSPL");
        statusChanger("Status: Started MSPL Voice-Assistant");
 
      } else if (
        (speechResult.toLowerCase().slice(0, 9) === "stop mspl" ||
          speechResult.toLowerCase().slice(0, 8) === "end mspl") &&
        !activatedVoice
      ) {
        speak("MSPL-voice assistant is already terminated.");
        statusChanger("Status: MSPL Voice-Assistant Stopped.");
      } else if (
        (speechResult.toLowerCase().slice(0, 10) === "stop mspl" ||
          speechResult.toLowerCase().slice(0, 9) === "end mspl") &&
        activatedVoice
      ) {
        activatedVoice = false;
        voiceAssistantActivated = false;
        speak("MSPL-voice assistant is stopped, Say start MSPL");
        statusChanger("Status: MSPL Voice-Assistant Stopped.");
      } 
      else if (
        speechResult.toLowerCase().includes("stop") ||
        speechResult.toLowerCase().includes("exit") ||
        speechResult.toLowerCase().includes("terminate")
      ) {
        activatedVoice = false;
        voiceAssistantActivated = false;
        speak("Voice terminated.");
        statusChanger("Status: Voice Terminated.");
        stream.getTracks().forEach((track) => track.stop());
        closeWindow();
        return;
      } 
      else if (
        speechResult.toLowerCase().slice(0, 4) === "open" &&
        activatedVoice
      ) {
        const command = await chrome.runtime.sendMessage({
          text: speechResult.split("open ")[1],
        });
        if (command && command.message) {
          speak(command.message);
          speechResult = "";
        }
      }
      speechResult = "";
      recognition.start();
    };

    recognition.onerror = (event) => {
      console.log(event.error);
    };
  },
  (error) => {
    console.log(error);
  }
  
);

/*

The following code is to click on the command button in the webpage.


const button = document.querySelector('[data-text="Awesome"]');
if (button){
button.dispatchEvent(new MouseEvent('click',{bubbles:true}));
}
statusChanger("Status: Voice Activated");
*/