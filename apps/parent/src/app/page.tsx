


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Curio Critters Parent Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Monitor your child's math learning journey
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Child Profiles Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Child Profiles
            </h2>
            <p className="text-gray-600 mb-4">
              Manage your children's learning profiles
            </p>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
              Manage Profiles
            </button>
          </div>

          {/* Progress Overview Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Progress Overview
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sessions</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minutes Played</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Facts Mastered</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>

          {/* Skills Heatmap Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Skills Heatmap
            </h2>
            <p className="text-gray-600 mb-4">
              View mastery levels across different math skills
            </p>
            <div className="bg-gray-100 rounded p-4 text-center">
              <span className="text-gray-500">Heatmap coming soon</span>
            </div>
          </div>

          {/* Learning Plan Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Learning Plan
            </h2>
            <p className="text-gray-600 mb-4">
              Suggested activities based on progress
            </p>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
              View Plan
            </button>
          </div>

          {/* Reports Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Progress Reports
            </h2>
            <p className="text-gray-600 mb-4">
              Generate printable progress reports
            </p>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
              Generate Report
            </button>
          </div>

          {/* Subscription Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Subscription
            </h2>
            <p className="text-gray-600 mb-4">
              Upgrade for cloud sync and advanced analytics
            </p>
            <button className="bg-success-500 text-white px-4 py-2 rounded-md hover:bg-success-600 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}


