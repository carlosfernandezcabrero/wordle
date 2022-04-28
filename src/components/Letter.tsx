import React from 'react'

interface Props {
  letter: string,
  finished?: boolean,
  correct?: boolean,
  isIncluded?: boolean,
}

const Letter: React.VFC<Props> = ({
  letter,
  finished = false,
  correct = false,
  isIncluded = false
}) => {
  let bgColor = 'bg-white'

  if (!finished && correct) bgColor = 'bg-[#c9b458]'
  if (!finished && isIncluded) bgColor = 'bg-[#d3d6da]'
  if (finished) bgColor = 'bg-[#6aaa64]'

  return (
    <div
      className={`text-4xl border-2 uppercase h-16 w-16 flex justify-center items-center break-inside-avoid font-medium ${bgColor} ${
        letter === '' ? 'border-gray-400' : 'border-gray-900'
      }`}
    >
      {letter}
    </div>
  )
}

export default React.memo(Letter)
