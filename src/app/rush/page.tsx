import Footer from '@/components/Footer'
import Header from '@/components/Header'
import RushEvent from '@/components/RushEvent'
import RushFaq from '@/components/RushFaq'
import { getActiveCycle } from '@/lib/applications'
import { getRushEventsForCycle } from '@/lib/rush-events'
import { toYoutubeEmbedUrl } from '@/lib/youtube-embed'

function cycleDisplayName(cycleName: string) {
  return cycleName.replace(/\s*\(local\)\s*/gi, '').trim()
}

function formatDueDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function Rush() {
  const cycle = await getActiveCycle()
  const events = cycle ? await getRushEventsForCycle(cycle.id) : []
  const displayName = cycle ? cycleDisplayName(cycle.name) : null
  const dueDate = cycle ? formatDueDate(cycle.closesAt) : null
  const blurb =
    cycle?.publicBlurb?.trim() ||
    (displayName
      ? `Welcome to Kappa Theta Pi's ${displayName} Rush!\nHere's our rush schedule.${dueDate ? ` Applications are due ${dueDate}.` : ''}`
      : "Welcome to Kappa Theta Pi rush. Check back soon for this semester's schedule.")
  const youtubeEmbed = toYoutubeEmbedUrl(cycle?.youtubeUrl)

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
                className="text-base sm:text-xl mt-8 mb-8 font-medium text-gray-600 max-w-3xl mx-auto whitespace-pre-line"
                style={{ color: 'grey' }}
              >
                {blurb}
              </p>
              <div className="flex justify-center space-x-4 mb-8">
                {cycle?.interestFormUrl ? (
                  <a
                    href={cycle.interestFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
                  >
                    Interest Form
                  </a>
                ) : null}
                <a
                  href="/apply"
                  className="px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
                >
                  Application
                </a>
              </div>
              {cycle?.calendarUrl ? (
                <p
                  className="text-sm sm:text-lg mb-16 font-medium text-gray-600"
                  style={{ color: 'grey' }}
                >
                  You can also join our{' '}
                  <a
                    href={cycle.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#315CA9] hover:text-[#234c8b]"
                  >
                    {displayName ? `${displayName} Google Calendar` : 'rush Google Calendar'}
                  </a>{' '}
                  to see the dates, times, and locations of all Open Rush events.
                </p>
              ) : (
                <div className="mb-16" />
              )}
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

          {youtubeEmbed ? (
            <div className="relative w-full lg:w-1/3 p-2 mb-10">
              <div className="absolute blob-c">
                <div className="shape-blob rush-static-green"></div>
                <div className="shape-blob rush-static-blue"></div>
              </div>
              <div className="relative z-1 h-64 lg:h-80">
                <iframe
                  className="rounded-xl w-full h-full"
                  src={youtubeEmbed}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : null}
        </div>

        <RushFaq />
      </div>

      <Footer />
    </div>
  )
}
