-- Local-only fake rush events. Applied after migrations on
-- `npx supabase start` (empty DB) and `npx supabase db reset`.
-- Never copy production applicant or member data here.
-- Do not put admin emails here (this file is committed). Use
-- LOCAL_ADMIN_EMAILS in .env.local and `npm run db:seed-admins`.

INSERT INTO public.rush_events (
  title,
  datetime,
  location,
  description,
  button_label,
  button_url,
  order_index
) VALUES
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
    'Application Office Hours',
    'Thursday, September 4, 8:00-9:00 PM',
    'Virtual (Zoom)',
    'At this event, we''ll share tips for crafting a strong resume, then move into both high-level discussions and 1:1 support to help you with your KTP Rush applications!',
    'Join Zoom Meeting',
    'https://umich.zoom.us/j/example',
    2
  ),
  (
    'Application Deadline',
    'Saturday, September 6, 11:59 PM',
    'Online',
    'Applications are due by 11:59 PM on September 6th.',
    'Apply Here',
    'https://example.com/apply',
    3
  );

INSERT INTO public.rush_cycles (
  name,
  opens_at,
  closes_at,
  intro_markdown,
  hear_about_options,
  is_active
) VALUES (
  'Fall 2026',
  timezone('utc'::text, now()) - interval '1 day',
  timezone('utc'::text, now()) + interval '30 days',
  'Thank you for your interest in rushing Kappa Theta Pi. This local cycle is for development only.',
  ARRAY[
    'Search engine / ktpmichigan.com',
    'Flyer',
    'Email',
    'Previous semester rush',
    'Festifall/Northfest/Winterfest',
    'Word of mouth',
    'Diag Board',
    'Instagram',
    'Club Presentation',
    'Other'
  ],
  true
);

INSERT INTO public.cycle_questions (
  cycle_id,
  prompt,
  help_text,
  max_words,
  sort_order,
  required
)
SELECT
  id,
  prompt,
  help_text,
  max_words,
  sort_order,
  true
FROM public.rush_cycles
CROSS JOIN (
  VALUES
    (
      'Pitch a product idea that reflects an aspect of your identity or personal values. What makes this idea meaningful to you?',
      '"Product" refers to a technical idea such as an app, tool, service, or system. It does not need to be fully built.',
      350,
      0
    ),
    (
      'Share a memory that has stayed with you. How does it reflect the person you''ve become today?',
      NULL,
      350,
      1
    ),
    (
      'In three sentences or fewer, choose one of KTP''s Pillars of P.A.S.T.A. and explain why it inspires you to join KTP.',
      NULL,
      80,
      2
    )
) AS q(prompt, help_text, max_words, sort_order)
WHERE public.rush_cycles.is_active;
