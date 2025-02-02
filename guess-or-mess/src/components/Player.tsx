import React, { useState } from "react";
import "./Player.css";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";

interface PlayerProps {
  name: string;
  disableEmojiChange?: boolean;
}

const Player: React.FC<PlayerProps> = ({ name, disableEmojiChange = false }) => {
  const [emoji, setEmoji] = useState("🙂");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const togglePicker = () => {
    if (!disableEmojiChange) {
      setIsPickerOpen((prev) => !prev);
    }
  };

  const handleEmojiChange = (emojiObject: EmojiClickData) => {
    if (!disableEmojiChange) {
      setEmoji(emojiObject.emoji);
      setIsPickerOpen(false); // Close after selection
    }
  };

  return (
    <div className="player-container">
      <div className="emoji-selector">
        <div 
          onClick={togglePicker} 
          style={{ cursor: disableEmojiChange ? "default" : "pointer" }}
        >
          {emoji}
        </div>
        <span className="emoji-name">{name}</span>
      </div>

      {/* Full-screen emoji picker modal */}
      {isPickerOpen && (
        <div className="modal">
          <div className="modal-content">
            <EmojiPicker onEmojiClick={handleEmojiChange} emojiStyle={EmojiStyle.TWITTER} />
            <button className="close-button" onClick={() => setIsPickerOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
