import React, { useState } from "react";
import "./Player.css"; // Import CSS file for styling
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const Player = ({ name }: { name: string }) => {
  const [emoji, setEmoji] = useState("🙂");
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  const handleEmojiChange = (emojiObject: EmojiClickData) => {
    toggleSelection();
    setEmoji(emojiObject.emoji); // Set the selected emoji
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
      <EmojiPicker open={isSelected} onEmojiClick={handleEmojiChange} />
    </div>
  );
};

export default Player;
