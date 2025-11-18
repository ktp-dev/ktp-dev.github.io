import CalendarIcon from './CalendarIcon';
import PinIcon from './PinIcon';

interface RushEventProps {
  title: string;
  datetime: string;
  location: string;
  description?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}

export default function RushEvent({
  title,
  datetime,
  location,
  description,
  buttonLabel,
  buttonUrl,
}: RushEventProps) {
  return (
    <div className="mb-10 flex items-center relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <div className="w-4 h-4 rounded-full bg-[#315CA9] z-10"></div>
      </div>
      <div className="ml-8 pl-4">
        <h2 className="text-lg sm:text-xl font-bold mb-3">{title}</h2>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <CalendarIcon />
            <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">
              {datetime}
            </span>
          </div>
          <div className="flex items-center">
            <PinIcon />
            <span className="ml-1 font-semibold text-black text-[13px] sm:text-base">
              {location}
            </span>
          </div>
        </div>
        {description && (
          <p className="text-gray-600 flex items-center mb-4">{description}</p>
        )}
        {buttonLabel && buttonUrl && (
          <a
            href={buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-[#315CA9] text-white rounded-[40px] text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
}

