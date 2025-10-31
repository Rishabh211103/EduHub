import React from 'react'

function HomePage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="hero bg-base-100 rounded-box shadow-xl mb-8">
          <div className="hero-content flex-col lg:flex-row-reverse gap-8 py-12">
            <img 
              src="/eduhubcoverimage.jpg" 
              alt="EduHub" 
              className="max-w-sm rounded-lg shadow-2xl w-full lg:max-w-md" 
            />
            <div>
              <h1 className="text-5xl font-bold text-primary mb-4">Edu-Hub</h1>
              <p className="text-lg leading-relaxed">
                Your journey to knowledge begins with us. Our platform offers a seamless enrollment process, competitive course rates, and quick approval. Start your enrollment today and get one step closer to enhancing your knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-6 text-center justify-center">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm opacity-60">Email</p>
                  <p className="font-semibold">example@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm opacity-60">Phone</p>
                  <p className="font-semibold">123-456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage