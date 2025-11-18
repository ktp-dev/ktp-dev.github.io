-- Test SQL to insert a rush event
-- Copy and paste this into Supabase SQL Editor

INSERT INTO rush_events (
  title,
  datetime,
  location,
  description,
  button_label,
  button_url,
  order_index
) VALUES (
  'Festifall',
  'Wednesday, August 27, 4:30-6:00 PM',
  'Ingalls Mall, Table E066',
  'Stop by our table to meet our brothers, hear about our professional development and social events, and learn how you can get involved this semester. Whether you''re curious about the rush process or just want to see what KTP is all about, we''d love to talk to you!',
  NULL,
  NULL,
  0
);

-- You can add more events by running additional INSERT statements
-- Just change the order_index to control the display order

INSERT INTO rush_events (
  title,
  datetime,
  location,
  description,
  button_label,
  button_url,
  order_index
) VALUES (
  'Open House #1',
  'Tuesday, September 2, 8:00-10:00 PM',
  'CCCB 3460',
  'Join us for one of our Open Houses! First, we''ll give a presentation about what it means to be a brother in KTP. Then, we''ll break out into open discussion and you''ll have a chance to ask our brothers any questions related to rush, Kappa Theta Pi, or anything else you may be wondering!',
  NULL,
  NULL,
  1
);

INSERT INTO rush_events (
  title,
  datetime,
  location,
  description,
  button_label,
  button_url,
  order_index
) VALUES (
  'Application Office Hours',
  'Thursday, September 4, 8:00-9:00 PM',
  'Virtual (Zoom)',
  'At this event, we''ll share tips for crafting a strong resume, then move into both high-level discussions and 1:1 support to help you with your KTP Rush applications!',
  'Join Zoom Meeting',
  'https://umich.zoom.us/j/92338618781?jst=2',
  2
);

INSERT INTO rush_events (
  title,
  datetime,
  location,
  description,
  button_label,
  button_url,
  order_index
) VALUES (
  'Application Deadline',
  'Saturday, September 6, 11:59 PM',
  'Online',
  'Applications are due by 11:59 PM on September 6th.',
  'Apply Here',
  'https://forms.gle/nhgTGks5KmpTFz1j6',
  3
);

