-- Reset rush_events table with original events
-- This will delete all existing events and insert the original ones

-- Delete all existing events
DELETE FROM rush_events;

-- Insert all original rush events
INSERT INTO rush_events (title, datetime, location, description, button_label, button_url, order_index) VALUES
(
  'Festifall',
  'Wednesday, August 27, 4:30-6:00 PM',
  'Ingalls Mall, Table E066',
  'Stop by our table to meet our brothers, hear about our professional development and social events, and learn how you can get involved this semester. Whether you''re curious about the rush process or just want to see what KTP is all about, we''d love to talk to you!',
  NULL,
  NULL,
  0
),
(
  'Open House #1',
  'Tuesday, September 2, 8:00-10:00 PM',
  'CCCB 3460',
  'Join us for one of our Open Houses! First, we''ll give a presentation about what it means to be a brother in KTP. Then, we''ll break out into open discussion and you''ll have a chance to ask our brothers any questions related to rush, Kappa Theta Pi, or anything else you may be wondering!',
  NULL,
  NULL,
  1
),
(
  'Open House #2',
  'Wednesday, September 3, 7:00-9:00 PM',
  'CCCB 3460',
  'The same information will be presented at both Open Houses. Feel free to come to just one Open House or both!',
  NULL,
  NULL,
  2
),
(
  'DEI Panel',
  'Thursday, September 4, 6:30-8:00 PM',
  'League - Michigan Room (Second Floor)',
  'In KTP, we love to celebrate our members'' diversity and share honest conversations about how the DEI climate can be improved in KTP, on campus, and beyond. At our DEI Panel, you will have the opportunity to hear brothers'' experiences as underrepresented minorities in tech. After the panel, we''ll break out into open discussion. Come learn about the many people and communities that make up KTP!',
  NULL,
  NULL,
  3
),
(
  'Application Office Hours',
  'Thursday, September 4, 8:00-9:00 PM',
  'Virtual (Zoom)',
  'At this event, we''ll share tips for crafting a strong resume, then move into both high-level discussions and 1:1 support to help you with your KTP Rush applications!',
  'Join Zoom Meeting',
  'https://umich.zoom.us/j/92338618781?jst=2',
  4
),
(
  'Application Deadline',
  'Saturday, September 6, 11:59 PM',
  'Online',
  NULL,
  'Apply Here',
  'https://forms.gle/nhgTGks5KmpTFz1j6',
  5
),
(
  'Closed Rush',
  'From Monday, September 8 onward',
  NULL,
  'KTP''s closed rush process consists of events for us to get to know each other, including 1:1 coffee chats and a final round of interviews.',
  NULL,
  NULL,
  6
);

