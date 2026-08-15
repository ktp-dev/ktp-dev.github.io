import Footer from '@/components/Footer'
import Header from '@/components/Header'
import RushEvent from '@/components/RushEvent'
import RushFaq from '@/components/RushFaq'
import { getRushEvents } from '@/lib/rush-events'

export default async function Rush() {
  const events = await getRushEvents()

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="inset-0 blob-c z-0">
          <div className="shape-blob eight"></div>
          <div className="shape-blob nine"></div>
        </div>

        <div className="relative w-full z-10">
          <div className="relative pt-12 sm:pt-16 z-10">
            <div className="flex flex-col text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-0">
                Learn About Joining KTP!
              </h1>
              <p
                className="text-base sm:text-xl mt-8 mb-8 font-medium text-gray-600 max-w-3xl mx-auto"
                style={{ color: 'grey' }}
              >
                Welcome to Kappa Theta Pi&apos;s Winter 2026 Rush! <br></br>
                Here&apos;s our rush schedule. Applications are due Saturday, January 17, 2026.
              </p>
              <div className="flex justify-center space-x-4 mb-8">
                <a
                  href="https://forms.gle/or4rGyotsRRLzvfz5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
                >
                  Interest Form
                </a>
                <a
                  href="https://forms.gle/DzouVtUQfhFEMGo16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
                >
                  Application Link
                </a>
              </div>
              <p
                className="text-sm sm:text-lg mb-16 font-medium text-gray-600"
                style={{ color: 'grey' }}
              >
                You can also join our{' '}
                <a
                  href="https://calendar.google.com/calendar/u/0?cid=Y185ODc2N2QxZDFmMmE1MzdlMGNhM2ZkNzlkN2ZhNjIyYWE0MmMzODZlZjkyNTM4MDgwMWFkOGY2NDdlYzI5NWJiQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20"
                  target="_blank"
                  className="text-[#315CA9] hover:text-[#234c8b]"
                >
                  W26 Rush Google Calendar
                </a>{' '}
                to see the dates, times, and locations of all Open Rush events.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="relative flex-1 mr-0 md:mr-8">
            <div className="border-l-2 border-dotted border-gray-400 absolute h-full left-4 top-0 transform -translate-x-1/2"></div>

            {events.length === 0 ? (
              <div className="ml-8 pl-4 py-8">
                <p className="text-gray-600">No rush events scheduled yet.</p>
              </div>
            ) : (
              events.map((event) => (
                <RushEvent
                  key={event.id}
                  title={event.title}
                  datetime={event.datetime}
                  location={event.location}
                  description={event.description}
                  buttonLabel={event.buttonLabel}
                  buttonUrl={event.buttonUrl}
                />
              ))
            )}
          </div>

          <div className="relative w-full lg:w-1/3 p-2 mb-10">
            <div className="absolute blob-c">
              <div className="shape-blob rush-static-green"></div>
              <div className="shape-blob rush-static-blue"></div>
            </div>
            <div className="relative z-1 h-64 lg:h-80">
              <iframe
                className="rounded-xl w-full h-full"
                src="https://www.youtube.com/embed/4wKA80PV2GI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        <RushFaq />
      </div>

      <Footer />
    </div>
  )
}
