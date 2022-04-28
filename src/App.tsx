import { useCallback, useEffect, useState } from 'react'
import Confetti from 'react-confetti'

import Word from './components/Word'

import GithubIcon from './icons/GithubIcon'

import type { GameStatus } from './types'
import { words } from './words'

interface globalStateInterface {
  answer: string,
  words: string[][],
  turn: number,
  letter: number,
  status: GameStatus,
  isGameOver: boolean,
  isScoreTime: boolean,
}

const INITIAL_WORDS: string[][] = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]
const OPPORTUNITIES: number = 5
const WAIT_TIME: number = 500

const INITIAL_STATE: () => globalStateInterface = (): globalStateInterface => ({
  answer:
    words[Math.floor(Math.random() * words.length)] || words[words.length - 1],
  words: INITIAL_WORDS,
  turn: 0,
  letter: 0,
  status: 'PLAYING',
  isGameOver: false,
  isScoreTime: false
})

function App () {
  const [globalState, setGlobalState] = useState<globalStateInterface>(INITIAL_STATE)
  const [confetti, setConfetti] = useState<boolean>(false)

  const { words, turn, answer, letter, status, isScoreTime, isGameOver } = globalState
  const { innerHeight: viewportHeight, innerWidth: viewportWidth } = window

  const handleKeyDown = useCallback(
    ({ key, code }: KeyboardEvent) => {
      if (status !== 'PLAYING') return

      const word = words[turn]

      if (key === 'Enter' && letter === 5) {
        if (word.join('') === answer) {
          setGlobalState((_globalState) => ({
            ..._globalState,
            status: 'FINISHED'
          }))

          setTimeout(async () => {
            setGlobalState((_globalState) => ({
              ..._globalState,
              isScoreTime: true
            }))
            setConfetti(true)
          }, WAIT_TIME)

          return
        }

        if (turn === OPPORTUNITIES) {
          setTimeout(() => {
            setGlobalState((_globalState) => ({
              ..._globalState,
              status: 'FINISHED',
              isScoreTime: true,
              isGameOver: true
            }))
          }, WAIT_TIME)

          return
        }

        setGlobalState((_globalState) => ({
          ..._globalState,
          turn: _globalState.turn + 1,
          letter: 0
        }))

        return
      }

      if (code.startsWith('Key')) {
        if (letter === 5) return

        const letterTyped = key.toLowerCase()

        setGlobalState((_globalState) => ({
          ..._globalState,
          words: _globalState.words.map((_word, _idx) => {
            if (_idx !== turn) return _word

            const newWord = [..._word]
            newWord[letter] = letterTyped
            return newWord
          }),
          letter: _globalState.letter + 1
        }))

        return
      }

      if (key === 'Backspace') {
        if (letter === 0) return

        setGlobalState((_globalState) => ({
          ..._globalState,
          words: _globalState.words.map((_word, _idx) => {
            if (_idx !== turn) return _word

            const newWord = [..._word]
            newWord[letter - 1] = ''
            return newWord
          }),
          letter: _globalState.letter - 1
        }))
      }
    },
    [status, words, turn, letter, answer, OPPORTUNITIES]
  )

  useEffect(() => {
    const { addEventListener, removeEventListener } = globalThis

    addEventListener('keydown', handleKeyDown)

    return () => removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (confetti) {
      setTimeout(() => setConfetti(false), 7 * 1000)
    }
  }, [confetti])

  const resetGame: () => void = (): void => setGlobalState(INITIAL_STATE())

  return (
    <>
      <h1 className="text-8xl text-center font-extrabold pt-8 tracking-tight text-transparent">
        <span className="bg-clip-text bg-gradient-to-r from-[#6aaa64] to-[#c9b458]">
          Wordle
        </span>
      </h1>

      <main>
        {!isScoreTime && (
          <div className="board flex flex-col items-center gap-2 mt-20">
            {words.map((word, row) => {
              return (
                <Word
                  key={`${row}`}
                  word={word}
                  turn={turn}
                  status={status}
                  wordNumber={row}
                  answer={answer}
                />
              )
            })}
          </div>
        )}

        {isScoreTime && (
          <>
            <Confetti
              width={viewportWidth}
              height={viewportHeight}
              recycle={confetti}
              numberOfPieces={350}
            />

            <div className="message text-center mt-36">
              {isGameOver && (
                <p className="text-7xl text-[#bb3429] font-bold tracking-tighter">
                  Game Over 😔 !!
                </p>
              )}
              {!isGameOver && (
                <p className="text-7xl text-[#6aaa64] font-bold tracking-tighter">
                  You win 🎉 !!
                </p>
              )}

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-sm text-2xl mt-10"
                onClick={() => resetGame()}
              >
                Start again
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="font-extrabold text-gray-600 text-base text-center mt-16">
        <p className="mb-2">Made by Carlos Fernandez Cabrero</p>
        <a
          href="https://github.com/carlosfernandezcabrero/wordle"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon />
        </a>
      </footer>
    </>
  )
}

export default App
