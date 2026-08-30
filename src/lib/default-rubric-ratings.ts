/** Default per-score guidance for the standard 7-category rush rubric (by sort_order). */
export const DEFAULT_RUBRIC_RATINGS_BY_SORT_ORDER: Record<
  number,
  Array<{ label: string; bullets: string[] }>
> = {
  0: [
    {
      label: 'Strong No',
      bullets: [
        'Minimalistic and terse responses lacking proper sentence structure.',
        'Evident lack of proofreading.',
        'Overall carelessness in presentation and content.',
      ],
    },
    {
      label: 'Weak No',
      bullets: [
        'Responses of moderate length that lack depth or detail.',
        'Missed opportunities to elaborate on key aspects of the application.',
        'Limited thought and consideration evident in the responses.',
      ],
    },
    {
      label: 'Weak Yes',
      bullets: [
        'Adequately lengthy responses, though lacking standout qualities.',
        'Some areas within the application could benefit from further expansion and deeper insight.',
      ],
    },
    {
      label: 'Strong Yes',
      bullets: [
        'Comprehensive and well-structured responses.',
        'Thorough proofreading and clear intention in presentation.',
        'A polished and thoughtful overall application.',
      ],
    },
  ],
  1: [
    {
      label: 'Strong No',
      bullets: [
        "The proposal lacks personal relevance or reflection of the applicant's unique background or experiences.",
        "No indication that the app idea is meaningfully connected to the applicant's life, values, or interests.",
      ],
    },
    {
      label: 'Weak No',
      bullets: [
        "Sparse details that loosely tie the technology concept to the applicant's personal experiences or characteristics.",
        "An attempt to relate the solution to the applicant's identity, but the connection is superficial or underdeveloped.",
      ],
    },
    {
      label: 'Weak Yes',
      bullets: [
        "Appropriate references to how the solution reflects personal aspects of the applicant's life, interests, or values.",
        "Clear efforts to tie the solution concept to the applicant's own experiences, although these may not be deeply explored or highly inventive.",
      ],
    },
    {
      label: 'Strong Yes',
      bullets: [
        "A clear and compelling connection between the solution concept and significant aspects of the applicant's personal experiences, culture, or passions.",
        "Innovative integration of the applicant's identity into the functionality, purpose, or target audience of the solution.",
        "Detailed explanations and thoughtful reflections on how the solution represents or enhances the applicant's own life and values.",
      ],
    },
  ],
  2: [
    {
      label: 'Strong No',
      bullets: [
        'The narrative lacks any personal insights or reflection on how the solution has impacted the applicant.',
        "Absence of details that link the solution to defining aspects of the applicant's life or character.",
      ],
    },
    {
      label: 'Weak No',
      bullets: [
        "Limited details that connect the solution to the applicant's broader personal narrative.",
        "A superficial mention of how the solution relates to the applicant's life, lacking depth or significant impact.",
      ],
    },
    {
      label: 'Weak Yes',
      bullets: [
        "References to personal insights or impacts related to the solution, though these may not be fully developed or deeply impactful.",
        "An attempt to connect the solution to defining aspects of the applicant's identity, but lacking strong integration or vivid storytelling.",
      ],
    },
    {
      label: 'Strong Yes',
      bullets: [
        "Detailed and insightful explanation of how the solution significantly impacts or reflects important aspects of the applicant's life.",
        "A clear and compelling connection between the solution and the applicant's personal development, values, or beliefs.",
        "Rich storytelling that vividly illustrates the lasting impact of the app on the applicant's identity.",
      ],
    },
  ],
  3: [
    {
      label: 'Strong No',
      bullets: [
        'The response lacks genuine enthusiasm or depth; the topic feels forced, generic, or purely transactional.',
        'No clear indication of why the interest matters personally to the applicant.',
        'May signal apathy, low engagement, or values that clash with an active, collaborative brotherhood.',
      ],
    },
    {
      label: 'Weak No',
      bullets: [
        'Mentions an interest, but the passion is surface-level or poorly explained.',
        'Limited insight into why the applicant cares about the topic or why they could discuss it at length.',
        'The topic could resonate with brothers, but the applicant does not articulate it compellingly.',
      ],
    },
    {
      label: 'Weak Yes',
      bullets: [
        'Demonstrates clear interest and some enthusiasm for the topic.',
        'Provides glimpses of personal motivation or enjoyment, though depth or specificity may be lacking.',
        'Some potential for the topic to resonate with brothers.',
      ],
    },
    {
      label: 'Strong Yes',
      bullets: [
        "The applicant's enthusiasm is clear; the topic is described with energy, specificity, and depth.",
        'Clearly explains why they could talk about it for hours, showing sustained curiosity, commitment, or joy.',
        'The interest naturally invites conversation, bonding, or shared experience with brothers.',
        'The passion feels authentic and memorable, leaving the reader excited to talk with the applicant about it.',
      ],
    },
  ],
  4: [
    {
      label: 'Strong No',
      bullets: [
        'A complete absence of community-oriented themes or actions.',
        'The narrative focuses solely on individualistic pursuits or disengagement from community activities.',
      ],
    },
    {
      label: 'Weak No',
      bullets: [
        'Brief or vague mentions of community involvement or impact.',
        'An overall narrative that lacks depth in demonstrating active participation or emotional connection to community.',
      ],
    },
    {
      label: 'Weak Yes',
      bullets: [
        'Instances of community interaction or engagement, though these are not central to the narrative.',
        'Some positive sentiments towards community, but lacking strong personal commitment or impact.',
      ],
    },
    {
      label: 'Strong Yes',
      bullets: [
        'Detailed and significant instances of community involvement, showcasing active participation and leadership.',
        "Strong emotional connections to community activities, clearly reflecting the applicant's dedication and affection.",
        "A narrative that is rich with examples of how community plays a pivotal role in the applicant's life and values.",
      ],
    },
  ],
  5: [
    {
      label: 'Strong No',
      bullets: [
        'Absence of any mention or indication of interest in learning from KTP or engaging with community initiatives.',
        'The narrative may focus on personal gains without considering community impact or educational growth.',
      ],
    },
    {
      label: 'Weak No',
      bullets: [
        'Slight mentions of benefiting from KTP or community involvement, but these are fleeting and lack conviction.',
        'Limited understanding or appreciation of the potential impact their involvement could have on the community or personal growth.',
      ],
    },
    {
      label: 'Weak Yes',
      bullets: [
        "Moderate mentions of interest in KTP's offerings and some intentions to engage with the community.",
        'A narrative that includes plans or hopes to contribute, though these may not be particularly detailed or deeply integrated into their goals.',
      ],
    },
    {
      label: 'Strong Yes',
      bullets: [
        "Clear and compelling statements of intent to fully engage with KTP's learning opportunities and to actively participate in community initiatives.",
        'Detailed examples or plans that showcase how they intend to apply what they learn to benefit both themselves and the community.',
        'A deep understanding of the reciprocal benefits of learning from and contributing to the community, demonstrating genuine commitment and enthusiasm.',
      ],
    },
  ],
  6: [
    {
      label: 'Strong No',
      bullets: [
        'A lack of achievements or roles that indicate proactivity or motivation.',
        'Absence of involvement in activities or projects that would suggest readiness for self-driven growth or leadership.',
      ],
    },
    {
      label: 'Weak No',
      bullets: [
        'Few and minor examples of proactive behavior or leadership, which do not strongly suggest potential for significant development.',
        "Limited participation in activities that could be relevant to KTP's goals of fostering growth and initiative.",
      ],
    },
    {
      label: 'Weak Yes',
      bullets: [
        'Several examples of proactive involvement or leadership roles, though these may not be prominently featured or particularly impactful.',
        "Evidence of readiness to engage more deeply, suggesting that with KTP's support, these initial steps could be significantly expanded.",
      ],
    },
    {
      label: 'Strong Yes',
      bullets: [
        "Clear and consistent examples of leadership roles, proactive achievements, and significant involvement in initiatives that align with KTP's objectives.",
        "A solid foundation of self-motivation and ambition, indicating the applicant is well-prepared to leverage KTP's resources for substantial personal and professional growth.",
      ],
    },
  ],
}
