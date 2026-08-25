import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LazyYoutubeEmbed from '@/components/LazyYoutubeEmbed'
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

      {/* Spill clip — `page-spill-clip` is relative only on mobile (desktop CB unchanged) */}
      <div className="page-spill-clip w-full max-w-full overflow-x-hidden">
        <div className="flex-1 px-6 sm:px-8 md:px-16 lg:px-20">
          <div className="inset-0 z-0 blob-c rush-mobile-blobs rush-hero-blobs">
            <div className="shape-blob eight"></div>
            <div className="shape-blob nine"></div>
          </div>

          <div className="relative z-10 w-full">
            <div className="relative z-10 pt-12 sm:pt-16">
              <div className="flex flex-col text-center">
                <h1 className="mb-0 text-3xl font-black sm:text-4xl md:text-5xl">
                  Learn About Joining KTP!
                </h1>
                <p
                  className="mx-auto mb-8 mt-8 max-w-3xl whitespace-pre-line text-base font-medium text-gray-600 sm:text-xl"
                  style={{ color: 'grey' }}
                >
                  {blurb}
                </p>
                <div className="mb-8 flex justify-center space-x-4">
                  {cycle?.interestFormUrl ? (
                    <a
                      href={cycle.interestFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer rounded-[40px] bg-[#315CA9] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md sm:text-base"
                    >
                      Interest Form
                    </a>
                  ) : null}
                  <a
                    href="/apply"
                    className="cursor-pointer rounded-[40px] bg-[#315CA9] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md sm:text-base"
                  >
                    Application
                  </a>
                </div>
                {cycle?.calendarUrl ? (
                  <p
                    className="mb-16 text-sm font-medium text-gray-600 sm:text-lg"
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
          <div className="flex flex-col justify-between gap-8 lg:flex-row">
            <div className="relative mr-0 flex-1 md:mr-8">
              <div className="absolute left-4 top-0 h-full -translate-x-1/2 transform border-l-2 border-dotted border-gray-400"></div>

              {events.length === 0 ? (
                <div className="ml-8 py-8 pl-4">
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
              <div className="relative mb-10 w-full p-2 lg:w-1/3">
                <div className="absolute z-0 blob-c rush-mobile-blobs rush-video-blobs">
                  <div className="shape-blob rush-static-green"></div>
                  <div className="shape-blob rush-static-blue"></div>
                </div>
                <div className="relative z-[1] h-64 lg:h-80">
                  <LazyYoutubeEmbed embedUrl={youtubeEmbed} />
                </div>
              </div>
            ) : null}
          </div>

          <RushFaq />
        </div>

        <Footer />
      </div>
    </div>
  )
}
