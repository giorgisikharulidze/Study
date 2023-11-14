//https://codebeautify.org/excel-to-json

let currentIndex = 0; // Initialize currentIndex
let wordList; // Declare wordList at the top level

document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', shuffleWords);

/*    const defaultFilePath = "C:\\Users\\g.sikharulidze\\Documents\\Study\\wordlist.json";

    if (defaultFilePath) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                // Check if the content is not empty before parsing
                if (e.target.result.trim() !== '') {
                    const data = JSON.parse(e.target.result);
                    wordList = data.Sheet1;
                    displayWords();
                } else {
                    console.error('Error parsing JSON: Empty file');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        // Use Blob to create a non-empty file
        const blob = new Blob(['{}'], { type: 'application/json' });
        const defaultFile = new File([blob], 'wordlist.json', { type: 'application/json' });

        // Set the files property of the file input
        Object.defineProperty(fileInput, 'files', {
            value: [defaultFile],
            writable: false,
        });

        // Trigger the change event manually
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);

        // Read the content of the default file
        reader.readAsText(defaultFile);
    }
*/
    fileInput.addEventListener('change', function (e) {
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
    });
});


function shuffleWords() {
    currentIndex = 0;
    displayWords();
}
function displayWords() {
    const wordListDiv = document.getElementById('wordList');
    wordListDiv.innerHTML = '';

    if (wordList) {
        // Shuffle the wordList array
        const shuffledList = shuffleArray(wordList);

        // Take the first 12 elements or fewer if the array is smaller
        const wordsToDisplay = shuffledList.slice(0, Math.min(54, shuffledList.length));

        const wordListDiv = document.getElementById('wordList');
        const wordsPerRow = 6; // Change to 4 columns
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
            wordDiv.textContent = wordsToDisplay[i].english;
            wordDiv.addEventListener('click', () => {
                showTranslation(wordsToDisplay[i].foreign)
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
            const jsonString = e.target.result;
            wordList = JSON.parse(jsonString);
            currentIndex = 0; // Reset currentIndex
            displayWords();
        };
        reader.readAsText(file);
    }
}


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

/*    const clickedWord = document.querySelector('.word.clicked');
    if (clickedWord) {
        clickedWord.classList.remove('clicked');
    }*/
}
