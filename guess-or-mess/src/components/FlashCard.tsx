const FlashCard = () => {
  return (
    <div style={{ border: "2px solid black", padding: "10px;" }}>
      {/* Top Text */}
      <h2 className="text-2xl font-mono">Souper</h2>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <button className="bg-gray-700 rounded-lg h-12 shadow-md hover:bg-gray-600">
          lmao
        </button>
        <button className="bg-gray-700 rounded-lg h-12 shadow-md hover:bg-gray-600">
          lol
        </button>
        <button className="bg-gray-700 rounded-lg h-12 shadow-md hover:bg-gray-600">
          mdr
        </button>
        <button className="bg-gray-700 rounded-lg h-12 shadow-md hover:bg-gray-600">
          lmfaolooool
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
