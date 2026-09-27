'use client'

import { useEffect, useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div
    className="py-4 cursor-pointer transition-all duration-300 px-4 -mx-4 border-b border-gray-200"
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">{question}</h3>
      <span
        className={`text-[#234c8b] text-2xl transition-all duration-300 transform ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}
      >
        {isOpen ? '−' : '+'}
      </span>
    </div>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}
    >
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  </div>
)

const faqs = [
  {
    question: 'Who can rush KTP?',
    answer:
      'Anyone is allowed to rush — we gladly accept (and encourage) rushees from all disciplines! The only requirement is that you must have at least 3 semesters left in school after your pledging semester.',
  },
  {
    question: 'What is KTP looking for?',
    answer:
      'There\'s no cookie cutter "ideal" rushee — if there were, Kappa Theta Pi wouldn\'t be the multi-talented, interdisciplinary organization that it is! In our experience, the qualities you\'re looking for are often what we\'d love to have in new members. In the end, we are an org united by our love for technology, and people who are truly passionate about tech are the ones who usually fit in the best.',
  },
  {
    question: 'How would I benefit from KTP?',
    answer:
      'KTP offers a supportive community of undergraduates who are all passionate about technology! Among other things, we offer mentoring in areas such as career advising, interview prep, resume development, and coursework. Additionally, we have current members and alumni working everywhere from the brightest startups to the tech giants of the corporate world. We believe that networking is far more than just professionalism — it\'s a process built on friendship, trust, and brotherhood.',
  },
  {
    question: 'Which majors are represented in KTP?',
    answer:
      'KTP is made up of a diverse group of people from schools all across campus. Generally, our members tend to be computer science majors or in the School of Information, but we are proud to have actives with backgrounds in creative writing, philosophy, business, women\'s studies, and entrepreneurship! We love (and encourage) rushees from all disciplines.',
  },
  {
    question: 'What types of social events does KTP have?',
    answer:
      'KTP aims to have at minimum one sober and one non-sober event per month. In the past, we have had barn dances, bowling nights, formals, Smash tournaments, and many more events.',
  },
  {
    question: 'How much of a time commitment is pledging?',
    answer:
      'As with all campus organizations, what you get out of the organization depends on what you put into it. We believe that our pledging process isn\'t strenuous and could be accommodated by most schedules.\nIf you have any further questions or want to learn more about KTP before rush, feel free to send us an email at ktp-board@umich.edu or stop by our booth at Winterfest.',
  },
]

export default function RushFaq() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([])
  const [faqVisible, setFaqVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFaqVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <div className="mt-16 mb-16 relative z-1">
      <h2
        className={`text-center text-2xl sm:text-4xl font-black mb-10 transition-all duration-700 ${
          faqVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-8'
        }`}
      >
        Frequently Asked Questions
      </h2>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ease-out ${
              faqVisible
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-8'
            }`}
            style={{ transitionDelay: `${(index + 1) * 100}ms` }}
          >
            <FAQItem
              question={faq.question}
              answer={faq.answer}
              isOpen={openQuestions.includes(index)}
              onClick={() => toggleQuestion(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
