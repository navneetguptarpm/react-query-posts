export default function Create() {
  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        name="post"
        placeholder="Enter a new posts..."
        className="flex-1 px-4 py-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="px-6 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300">
        Create
      </button>
    </div>
  );
}
