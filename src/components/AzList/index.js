import { Link } from 'react-router-dom';

export default function AzList({ selectedLetter}) {

    const alphabet = Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode(65 + index)
  );
  const modifiedAlphabet = ['All', '0-9', ...alphabet];

  return (
    <div className="p-2">
      <ul className="flex justify-center  flex-wrap mb-3">
        {modifiedAlphabet.map((letter) => (
          <li key={letter} className="mx-1 border-b-2" >
            <Link
              to={`/az-list/${letter}`}
              className={`text-white bg-neutral-800 hover:text-emerald-500 text-xl md:text-xl lg:text-xl xl:text-xl 2xl:text-xl px-2 ${
                selectedLetter === letter ? 'bg-lime-700' : 'text-emerald-400'
              } hover:text-emerald-500`}
            >
              {letter}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
