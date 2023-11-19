//https://codebeautify.org/excel-to-json
let wordCountsInPage = 52;

let currentIndex = 0; // Initialize currentIndex
let wordList; // Declare wordList at the top level
// Add a variable to keep track of the current set of words
let currentSetIndex = 0;


document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', shuffleWords);

    fileInput.addEventListener('change', handleFile);
   /* fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    wordList = data.Sheet1;
                    displayWords();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file);
        }

        const checkbox = document.querySelector('.checkbox');
        checkbox.addEventListener('change', displayWords);
    });*/

    const checkbox = document.querySelector('.checkbox');
    checkbox.addEventListener('change', displayWords);
//    const nextButton = document.getElementById('nextButton');
//    nextButton.addEventListener('click', showNextWords);
});


function shuffleWords() {
    currentIndex = 0;
    currentSetIndex = 0;
    displayWords(wordList.slice(0, wordCountsInPage));
}
function displayWords(wordList) {
    const wordListDiv = document.getElementById('wordList');
    const useForeignLanguage = document.querySelector('.checkbox').checked;
    const flipButton = document.getElementById('flipButton');

    wordListDiv.innerHTML = '';

    if (wordList) {
        // Shuffle the wordList array
        const shuffledList = shuffleArray(wordList);

        // Take the first 12 elements or fewer if the array is smaller
        const wordsToDisplay = shuffledList.slice(0, Math.min(wordCountsInPage, shuffledList.length));

        const wordListDiv = document.getElementById('wordList');

        const wordsPerRow = 4; // Change to 4 columns
        const wordWidth = 100 / wordsPerRow; // Calculate the width of each word

        for (let i = 0; i < wordsToDisplay.length; i++) {
            // Create a new row for every 'wordsPerRow' words
            if (i % wordsPerRow === 0) {
                var row = document.createElement('div');
                row.classList.add('row');
                wordListDiv.appendChild(row);
            }

            const wordDiv = document.createElement('div');
            wordDiv.classList.add('word', 'btn', 'btn-one');
            wordDiv.style.width = `calc(${wordWidth}% - 2px)`; // Adjust width with 1px space on each side



            if (useForeignLanguage) {
                wordDiv.textContent = wordsToDisplay[i].foreign;

            } else {
                wordDiv.textContent = wordsToDisplay[i].english;
            }

            wordDiv.addEventListener('click', () => {
                //                showTranslation(useForeignLanguage ? wordsToDisplay[i].english : wordsToDisplay[i].foreign);
                flipButton.setAttribute('data-front', useForeignLanguage ? wordsToDisplay[i].english : wordsToDisplay[i].foreign);
                flipButton.setAttribute('data-back', useForeignLanguage ? wordsToDisplay[i].foreign_2 ? wordsToDisplay[i].foreign_2 : '' : wordsToDisplay[i].english_2 ? wordsToDisplay[i].english_2 : '');
                wordDiv.classList.add('clicked');
            });

            // Append the word to the current row
            row.appendChild(wordDiv);
        }
    }
}


// Helper function to shuffle an array
function shuffleArray(array) {
    const shuffledArray = array.slice(); // Create a copy of the array to avoid modifying the original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function showFileInput() {
    const fileInput = document.getElementById('fileInput');
    fileInput.style.display = 'block';

    fileInput.addEventListener('change', handleFile);
}

function handleFile(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const extension = file.name.split('.').pop().toLowerCase();

                if (extension === 'xlsx') {
                    // Handle Excel (xlsx) file
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
//                    wordList = jsonData;
                    wordList = shuffleArray(jsonData);
                } else if (extension === 'json') {
                    // Handle JSON file
                    //wordList = JSON.parse(e.target.result);
                    wordList = shuffleArray(JSON.parse(e.target.result));
                } else {
                    console.error('Unsupported file type');
                    return;
                }

                currentIndex = 0;
                currentSetIndex = 0
                displayWords(wordList.slice(0, wordCountsInPage));
            } catch (error) {
                console.error('Error processing file:', error);
            }
        };

        if (file.name.endsWith('.json')) {
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
//                    wordList = data.Sheet1;
                    wordList = shuffleArray(data.Sheet1);
                    currentSetIndex = 0
                    displayWords(wordList.slice(0, wordCountsInPage)); 
                    } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file);


        } else {
            reader.readAsBinaryString(file);
        }
    }

}

/*
function showTranslation(translation) {
//    console.log('Translation:', translation);
    const translationDiv = document.getElementById('translation');

    if (translationDiv) {
     //   console.log('Translation Div found:', translationDiv);

        // Use setTimeout to add a delay before setting the text
        setTimeout(() => {
            translationDiv.innerText = translation || '';
        }, 100);
    } else {
        console.error('Translation element not found');
    }

}
*/


function showNextWords() {
    // Increase the current set index
    currentSetIndex++;

    // Calculate the start and end indices for the next set of words
    const startIndex = currentSetIndex * wordCountsInPage;
    const endIndex = (currentSetIndex + 1) * wordCountsInPage;


    // Check if there are still words to display
    if (endIndex-wordCountsInPage <= wordList.length) {
        const nextSet = wordList.slice(startIndex, endIndex);
        displayWords(nextSet);
    } else {
        console.log(startIndex);
        console.log(endIndex);
        console.log(wordList.length);
    
        // If no more words, you can handle it as you wish (e.g., start over or display a message)
        console.log('No more words to display.');
    }
}