import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const GameCode = () => {
  const [copied, setCopied] = useState(false);
  const textToCopy = "game code";

  return (
    <div className="flex items-center space-x-3 border-2 border-black p-3 rounded-lg">
      <span className="text-lg font-semibold">{textToCopy}</span>

      <CopyToClipboard
        text={textToCopy}
        onCopy={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000); // Reset after 4s
        }}
      >
        <button className="flex items-center gap-2 bg-white opacity-30 text-white px-3 py-2 rounded-lg hover:opacity-40 transition active:opacity-60 transition">
          {copied ? (
            <CheckRoundedIcon sx={{ color: "text.primary" }} />
          ) : (
            <ContentCopyRoundedIcon sx={{ color: "text.primary" }} />
          )}
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default GameCode;
