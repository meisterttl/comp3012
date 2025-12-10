/* 
Create a function called wordPosition which takes a list of words, and returns the indices where each word shows up in the list. 
Take a look at the comment below to see how the output should look. 
The order of the keys in the dictionary does not matter, but the overall structure should match. 
The values for each key are a list of integers (indices). 
Make sure to use modern javascript syntax. 
This question is for me to get a general understanding of how strong this set is regarding Javascript knowledge. 
Avoid using AI, it will make things more authentic for me to understand your overall skill level coming into this course with Javascript. 
*/

const wordPosition = (words) => {
  const obj = {};

  words.map((word, index) => {
    if (!(word in obj)) obj[word] = [];

    obj[word].push(index);
  });

  const array = Object.entries(obj).sort();
  const sortedObj = Object.fromEntries(array);

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
