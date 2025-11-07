import React, { useState, useEffect } from "react";
import "./App.css";

function AmbuQuickApp() {
  const [view, setView] = useState("home");
  const [countdown, setCountdown] = useState(10);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    let timer;
    if (view === "sosCountdown" && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setView("sosAlert");
    }
    return () => clearInterval(timer);
  }, [view, countdown]);

  const startBooking = () => setView("bookingConfirm");
  const startSOS = () => {
    setCountdown(10);
    setView("sosCountdown");
  };
  const cancelSOS = () => {
    setView("home");
  };

  const chatbotResponse = (input) => {
    const normalized = input.toLowerCase();
    if (normalized.includes("how")) return "Click 'Book Ambulance' to schedule a ride.";
    if (normalized.includes("eta")) return "The ambulance usually arrives within 5 minutes.";
    if (normalized.includes("cancel")) return "You can cancel your booking from the confirmation screen.";
    return "I can help with ambulance booking. Try asking about booking or ETA.";
  };

  const addChatMessage = (msg, isUser) => {
    setChatMessages((prev) => [...prev, { text: msg, fromUser: isUser }]);
  };

  return (
    <div className="app-container">
      {view === "home" && (
        <>
          <header><h1>AmbuQuick Emergency Ambulance Booking</h1></header>
          <img
            src="static_map_placeholder.png"
            alt="Dummy map"
            className="dummy-map"
          />
          <div className="button-group">
            <button onClick={startBooking} className="normal-btn">
              Book Ambulance
            </button>
            <button onClick={startSOS} className="sos-btn">
              SOS
            </button>
          </div>
          <Chatbot
            chatMessages={chatMessages}
            onUserMessage={addChatMessage}
            chatbotResponse={chatbotResponse}
          />
        </>
      )}

      {view === "bookingConfirm" && (
        <div className="confirmation-screen">
          <h2>Booking Confirmed</h2>
          <p>Status: Confirmed</p>
          <p>ETA: 5 minutes</p>
          <p>Driver: John Doe</p>
          <p>Vehicle: Ambulance Type A</p>
          <button onClick={() => setView("home")}>Back to Home</button>
        </div>
      )}

      {view === "sosCountdown" && (
        <div className="sos-countdown-screen">
          <h2>SOS Activated</h2>
          <p>Countdown: {countdown} seconds</p>
          <button onClick={cancelSOS} className="cancel-btn">
            Cancel
          </button>
        </div>
      )}

      {view === "sosAlert" && (
        <div className="sos-alert-screen">
          <h2>Help is on the way</h2>
          <p>Your location has been shared with the nearest emergency response team.</p>
          <button onClick={() => setView("home")}>Back to Home</button>
        </div>
      )}
    </div>
  );
}

function Chatbot({ chatMessages, onUserMessage, chatbotResponse }) {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    onUserMessage(input, true);
    const reply = chatbotResponse(input);
    onUserMessage(reply, false);
    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={msg.fromUser ? "user-msg" : "bot-msg"}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask the assistant..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default AmbuQuickApp;
