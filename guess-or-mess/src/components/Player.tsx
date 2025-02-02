import React, { useState } from "react";
import "./Player.css"; // Import CSS file for styling
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface PlayerProps {
  name: string;
  disableEmojiChange?: boolean; // Optional prop to disable emoji change
}

const Player: React.FC<PlayerProps> = ({
  name,
  disableEmojiChange = false,
}) => {
  const [emoji, setEmoji] = useState("🙂");
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    if (!disableEmojiChange) {
      setIsSelected(!isSelected);
    }
  };

  const handleEmojiChange = (emojiObject: EmojiClickData) => {
    if (!disableEmojiChange) {
      setEmoji(emojiObject.emoji); // Set the selected emoji
      setIsSelected(false); // Close the emoji picker after selection
    }
  };

  return (
    <div>
      <div className={`emoji-selector ${isSelected ? "selected" : ""}`}>
        {/* Emoji Picker Trigger */}
        <div onClick={toggleSelection}>
          {emoji} {/* Show the selected emoji */}
        </div>

        {/* Player Name */}
        <span className="emoji-name">{name}</span>
      </div>

      {/* Full-screen emoji picker modal */}
      {isPickerOpen && (
        <div className="modal">
          <div className="modal-content">
            <EmojiPicker onEmojiClick={handleEmojiChange} />
            <button className="close-button" onClick={() => setIsPickerOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
