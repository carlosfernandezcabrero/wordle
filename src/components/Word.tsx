import type React from 'react'

import type { GameStatus } from '../types'

import Letter from './Letter'

interface Props {
  word: string[]
  wordNumber: number
  answer: string
  turn: number
  status: GameStatus
}

const Word: React.VFC<Props> = ({ word, wordNumber, answer, turn, status }) => {
  return (
    <div className="word columns-5 gap-2">
      {word.map((letter, idx) => {
        if (letter === answer[idx] && wordNumber !== turn) {
          return (
            <Letter
              key={`${wordNumber}${idx}`}
              correct={true}
              letter={letter}
            />
          )
        }
        if (wordNumber === turn && status === 'FINISHED') {
          return (
            <Letter
              key={`${wordNumber}${idx}`}
              finished={true}
              correct={true}
              letter={letter}
            />
          )
        }

        if (wordNumber !== turn && letter !== '' && answer.includes(letter)) {
          return (
            <Letter
              key={`${wordNumber}${idx}`}
              letter={letter}
              isIncluded={true}
            />
          )
        }

        return <Letter key={`${wordNumber}${idx}`} letter={letter} />
      })}
    </div>
  )
}

export default Word
