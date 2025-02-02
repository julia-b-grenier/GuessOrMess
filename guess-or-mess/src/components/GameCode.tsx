import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { blue } from "@mui/material/colors";

const GameCode = () => {
  const [copied, setCopied] = useState(false);
  const textToCopy = "game code";

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg">
      <span className="text-lg font-semibold">{textToCopy}</span>

      <CopyToClipboard
        text={textToCopy}
        onCopy={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000); // Reset after 4s
        }}
      >
        <button className="flex items-center gap-2 bg-[#37373a] text-white px-3 py-2 rounded-lg hover:bg-[#414142] transition active:bg-[#4a4a4a] transition">
          {copied ? (
            <CheckRoundedIcon color="success" />
          ) : (
            <ContentCopyRoundedIcon sx={{ color: blue[500] }} />
          )}
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default GameCode;
