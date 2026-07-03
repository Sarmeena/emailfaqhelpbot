export default function BrandingPanel() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white p-12">
      <div className="max-w-md text-center">

        <div className="mb-8">
          <div className="mx-auto h-28 w-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl">
            📧
          </div>
        </div>

        <h1 className="text-5xl font-bold text-blue-700">
          Email FAQ Help Bot
        </h1>

        <p className="mt-6 text-gray-600 leading-7">
          Automate customer support using AI-powered FAQ retrieval,
          email conversations, and intelligent responses.
        </p>

      </div>
    </div>
  );
}