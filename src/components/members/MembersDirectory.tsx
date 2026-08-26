'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { AlumniGroup, LeadershipMember, Member } from '@/lib/members-data'
import { GREEK_LETTERS, MEMBER_CATEGORIES } from '@/lib/members-data'
import MemberPhoto from './MemberPhoto'

type MembersDirectoryProps = {
  activeMembers: Member[]
  alumni: AlumniGroup[]
  leadership: LeadershipMember[]
}

export default function MembersDirectory({
  activeMembers,
  alumni,
  leadership,
}: MembersDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<(typeof MEMBER_CATEGORIES)[number]>(
    'Actives'
  )
  const [selectedGreekLetter, setSelectedGreekLetter] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const selector =
        selectedCategory === 'Actives'
          ? '.active-member'
          : selectedCategory === 'E-Board'
            ? '.e-board-member'
            : selectedCategory === 'Directors'
              ? '.director-member'
              : null
      if (!selector) return
      document.querySelectorAll(selector).forEach((el) => el.classList.add('visible'))
    }, 100)
    return () => window.clearTimeout(timer)
  }, [selectedCategory])

  const filteredAlumni = (
    selectedGreekLetter
      ? alumni.filter((group) => group.pledgeClass === selectedGreekLetter)
      : alumni
  ).sort(
    (a, b) =>
      (GREEK_LETTERS as readonly string[]).indexOf(a.pledgeClass) -
      (GREEK_LETTERS as readonly string[]).indexOf(b.pledgeClass)
  )

  return (
    <>
      <div className="relative mb-8 sm:mb-12 sm:mt-0 lg:mb-16">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:gap-6 lg:gap-8">
          {MEMBER_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`cursor-pointer whitespace-nowrap rounded-[40px] px-3 py-2 text-center text-xs font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md tap-press sm:px-4 sm:text-sm md:text-base ${
                selectedCategory === category
                  ? 'bg-[#315CA9] text-white'
                  : 'bg-gray-200/60 text-gray-700 hover:bg-gray-300/80'
              }`}
              onClick={() => {
                setSelectedCategory(category)
                setSelectedGreekLetter(null)
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory === 'Alumni' && (
        <div className="relative mb-8 px-6 sm:mb-12 sm:px-8 md:px-16 lg:mb-16 lg:px-24 xl:px-32">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto py-4 sm:gap-3 md:gap-4">
            <div className="mx-auto flex min-w-max gap-2 px-2 sm:gap-3 md:gap-4">
              <button
                type="button"
                className={`flex-shrink-0 cursor-pointer whitespace-nowrap rounded-[40px] px-3 py-2 text-center text-xs font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md tap-press sm:px-4 sm:text-sm md:text-base ${
                  selectedGreekLetter === null
                    ? 'bg-[#315CA9] text-white'
                    : 'bg-gray-200/60 text-gray-700 hover:bg-gray-300/80'
                }`}
                onClick={() => setSelectedGreekLetter(null)}
              >
                All
              </button>
              {GREEK_LETTERS.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className={`flex-shrink-0 cursor-pointer whitespace-nowrap rounded-[40px] px-3 py-2 text-center text-xs font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md tap-press sm:px-4 sm:text-sm md:text-base ${
                    selectedGreekLetter === letter
                      ? 'bg-[#315CA9] text-white'
                      : 'bg-gray-200/60 text-gray-700 hover:bg-gray-300/80'
                  }`}
                  onClick={() => setSelectedGreekLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedCategory === 'E-Board' ? (
        <div className="mb-12 grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-2">
          {leadership
            .filter((member) => member.category === 'E-Board')
            .map((member, index) => (
              <div
                key={`${member.name}-${member.category}`}
                className="e-board-member group w-full min-w-0 transform overflow-hidden rounded-xl border border-gray-100 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                style={{ backgroundColor: 'rgba(249, 250, 251, 0.95)' }}
              >
                <div className="flex h-full flex-col items-center p-6 md:flex-row md:items-start">
                  <div className="relative mb-4 flex flex-shrink-0 justify-center self-center md:mb-0 md:mr-6">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-lg ring-4 ring-blue-100 transition-all duration-300 ease-in-out group-hover:ring-blue-200 lg:h-36 lg:w-36">
                      <MemberPhoto
                        src={member.imageUrl}
                        alt={member.name}
                        className="object-cover"
                        sizes="144px"
                        priority={index < 2}
                      />
                    </div>
                  </div>
                  <div className="flex-1 break-normal text-center md:self-start md:text-left">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 ease-in-out group-hover:text-[#315CA9]">
                      {member.name}
                    </h3>
                    <div className="mb-3 inline-block rounded-full bg-[#315CA9] px-3 py-1.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-in-out">
                      {member.role}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 transition-colors duration-300 ease-in-out lg:text-base">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : selectedCategory === 'Directors' ? (
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {(() => {
            const directorsByRole = leadership
              .filter((member) => member.category === 'Directors')
              .reduce(
                (acc, member) => {
                  if (!acc[member.role]) acc[member.role] = []
                  acc[member.role].push(member)
                  return acc
                },
                {} as Record<string, LeadershipMember[]>
              )

            return Object.entries(directorsByRole)
              .sort(([roleA], [roleB]) => {
                if (roleA.includes('Social Engagement')) return 1
                if (roleB.includes('Social Engagement')) return -1
                return 0
              })
              .map(([role, members]) => (
                <div
                  key={role}
                  className="director-member group mx-auto w-full min-w-0 transform overflow-hidden rounded-xl border border-gray-100 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                  style={{ backgroundColor: 'rgba(249, 250, 251, 0.95)' }}
                >
                  <div className="p-6">
                    <div className="mb-6 text-center">
                      <div className="mb-3 inline-block rounded-full bg-[#315CA9] px-3 py-1.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-in-out">
                        {role}
                      </div>
                      <div className="flex items-start justify-center lg:min-h-[4rem]">
                        <p className="text-sm leading-relaxed text-gray-600 transition-colors duration-300 ease-in-out lg:text-base">
                          {members[0].description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`grid justify-items-center gap-2 ${
                        role.includes('Social Engagement')
                          ? 'mx-auto max-w-md grid-cols-2 lg:max-w-4xl lg:grid-cols-2'
                          : members.length === 1
                            ? 'grid-cols-1 place-items-center'
                            : 'mx-auto max-w-md grid-cols-2'
                      }`}
                    >
                      {members.map((member) => (
                        <div
                          key={member.name}
                          className="flex w-full max-w-48 flex-col items-center space-y-2 rounded-lg p-3 transition-all duration-300 ease-in-out hover:bg-gray-50"
                        >
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full shadow-lg ring-4 ring-blue-100 transition-all duration-300 ease-in-out group-hover:ring-blue-200 lg:h-28 lg:w-28">
                            <MemberPhoto
                              src={member.imageUrl}
                              alt={member.name}
                              className="object-cover"
                              sizes="112px"
                            />
                          </div>
                          <div className="text-center">
                            <h4 className="text-base font-semibold text-gray-900 transition-colors duration-300 ease-in-out group-hover:text-[#315CA9]">
                              {member.name}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          })()}
        </div>
      ) : selectedCategory === 'Alumni' ? (
        <div className="mb-12">
          {filteredAlumni.map((group) => {
            const names = [...group.names].sort((a, b) => {
              const lastNameA = a.split(' ').pop() || ''
              const lastNameB = b.split(' ').pop() || ''
              return lastNameA.localeCompare(lastNameB)
            })
            const column1: string[] = []
            const column2: string[] = []
            const column3: string[] = []
            names.forEach((name, i) => {
              if (i % 3 === 0) column1.push(name)
              else if (i % 3 === 1) column2.push(name)
              else column3.push(name)
            })

            return (
              <div key={group.pledgeClass} id={`pledgeClass-${group.pledgeClass}`} className="mb-8">
                <div className="flex flex-col items-start sm:flex-row">
                  <div className="mb-4 w-32 text-lg font-bold sm:mb-0 sm:mr-24 sm:text-xl">
                    {group.pledgeClass}
                  </div>
                  <div className="flex-1 gap-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:pl-8 lg:grid-cols-3 lg:gap-8">
                    <div className="hidden sm:block">
                      {column1.map((name) => (
                        <div key={name} className="mb-1 text-base md:text-lg">
                          {name}
                        </div>
                      ))}
                    </div>
                    <div className="hidden sm:block">
                      {column2.map((name) => (
                        <div key={name} className="mb-1 text-base md:text-lg">
                          {name}
                        </div>
                      ))}
                    </div>
                    <div className="hidden lg:block">
                      {column3.map((name) => (
                        <div key={name} className="mb-1 text-base md:text-lg">
                          {name}
                        </div>
                      ))}
                    </div>
                    <div className="sm:hidden">
                      {names.map((name) => (
                        <div key={name} className="mb-1 text-base md:text-lg">
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mb-12 grid grid-cols-3 gap-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-12">
          {activeMembers.map((member, index) => (
            <div key={`${member.name}-${member.imageUrl}`} className="active-member text-center">
              <div className="relative mx-auto aspect-square w-full">
                <MemberPhoto
                  src={member.imageUrl}
                  alt={member.name}
                  className="blue-shadow rounded-lg object-cover"
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 18vw, 12vw"
                  priority={index < 6}
                />
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-logo-container"
                >
                  <Image
                    src="/images/linkedin.jpg"
                    alt="LinkedIn"
                    width={32}
                    height={32}
                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-10 md:w-10"
                  />
                </a>
                <div className="pledge-class">{member.pledgeClass}</div>
              </div>
              <p className="mt-4 text-center text-xs font-semibold sm:text-sm">{member.name}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
