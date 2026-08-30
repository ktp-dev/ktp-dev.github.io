/** Placeholder rush schedule for a new cycle (Winter-style template). */
export type DefaultRushEventSeed = {
  title: string
  datetime: string
  location: string
  description: string | null
  buttonLabel: string | null
  buttonUrl: string | null
  orderIndex: number
}

export function buildDefaultRushEventSeeds(): DefaultRushEventSeed[] {
  return [
    {
      title: 'Winterfest Central',
      datetime: 'Monday, January 12, 4:00-7:00 PM',
      location: '[EDIT ME]',
      description:
        "Stop by our table to meet our brothers, hear about our professional development and social events, and learn how you can get involved this semester. Whether you're curious about the rush process or just want to see what KTP is all about, we'd love to talk to you!",
      buttonLabel: null,
      buttonUrl: null,
      orderIndex: 0,
    },
    {
      title: 'Open House #1',
      datetime: 'Tuesday, January 13, 7:00-10:00 PM',
      location: '[EDIT ME]',
      description:
        "Join us for one of our Open Houses! First, we'll give a presentation about what it means to be a brother in KTP. Then, we'll break out into open discussion and you'll have a chance to ask our brothers any questions related to rush, Kappa Theta Pi, or anything else you may be wondering!",
      buttonLabel: null,
      buttonUrl: null,
      orderIndex: 1,
    },
    {
      title: 'DEI Panel',
      datetime: 'Wednesday, January 14, 6:30-8:00 PM',
      location: '[EDIT ME]',
      description:
        "In KTP, we love to celebrate our members' diversity and share honest conversations about how the DEI climate can be improved in KTP, on campus, and beyond. At our DEI Panel, you will have the opportunity to hear brothers' experiences as underrepresented minorities in tech. After the panel, we'll break out into open discussion. Come learn about the many people and communities that make up KTP!",
      buttonLabel: null,
      buttonUrl: null,
      orderIndex: 2,
    },
    {
      title: 'Open House #2',
      datetime: 'Thursday, January 15, 7:00-9:00 PM',
      location: '[EDIT ME]',
      description:
        'The same information will be presented at both Open Houses. Feel free to come to just one Open House or both!',
      buttonLabel: null,
      buttonUrl: null,
      orderIndex: 3,
    },
    {
      title: 'Application Office Hours',
      datetime: 'Saturday, January 17, 4:00-6:00 PM',
      location: 'Virtual (Zoom)',
      description:
        "At this event, we'll share tips for crafting a strong resume, then move into both high-level discussions and 1:1 support to help you with your KTP Rush applications!",
      buttonLabel: 'Zoom Link',
      buttonUrl: 'https://umich.zoom.us/j/example',
      orderIndex: 4,
    },
    {
      title: 'Application Deadline',
      datetime: 'Saturday, January 17, 11:59 PM',
      location: 'Online',
      description: null,
      buttonLabel: 'Apply Here',
      buttonUrl: '/apply',
      orderIndex: 5,
    },
    {
      title: 'Closed Rush',
      datetime: 'Tuesday, January 20, 12:00 AM',
      location: 'TBD',
      description:
        "KTP's closed rush process consists of events for us to get to know each other, including 1:1 coffee chats and a final round of interviews.",
      buttonLabel: null,
      buttonUrl: null,
      orderIndex: 6,
    },
  ]
}
