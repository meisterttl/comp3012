const wordPosition = (words) => {
  const obj = {};
  words.map((word, index) => {
    if (!(word in obj)) obj[word] = [];
    obj[word].push(index);
  });

  const sortedObj = Object.fromEntries(Object.entries(obj).sort());
  console.log(sortedObj);
};

const input = [
  "buy",
  "it",
  "use",
  "it",
  "break",
  "it",
  "fix",
  "it",
  "trash",
  "it",
  "change",
  "it",
  "mail",
  "upgrade",
  "it",
];

const output = wordPosition(input);

/*
Output should look like so:
{
  break: [ 4 ],
  buy: [ 0 ],
  change: [10],
  fix: [ 6 ],
  it:  [1, 3, 5, 7, 9, 11, 14],
  mail: [ 12 ],
  trash: [ 8 ],
  upgrade: [ 13 ],
  use: [ 2 ],
}

*/
