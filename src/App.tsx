import { useState } from "react";
import Create from "./components/Create";
import Posts from "./components/Posts";

export default function App() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsMounted((prev) => !prev)}
            className="px-6 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300"
          >
            Toggle
          </button>
        </div>
        {isMounted && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Create />
            <Posts />
          </div>
        )}
      </div>
    </div>
  );
}
