//https://codebeautify.org/excel-to-json
let maxWordCountsInPage = 52;
let wordCountsInPage = 52;

let currentIndex = 0; // Initialize currentIndex
let wordList; // Declare wordList at the top level
// Add a variable to keep track of the current set of words
let currentSetIndex = 0;
let IsShuffle;
let wordListFirst;


document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', shuffleWords);
    //get Count from text field, if empty set  wordCountsInPage, max value   is wordCountsInPage
    wordCountsInPage=parseInt(document.getElementById('inpCountId').value? document.getElementById('inpCountId').value :wordCountsInPage);
    wordCountsInPage=Math.min(wordCountsInPage,maxWordCountsInPage);
    IsShuffle=document.querySelector('.isShuffle').checked;

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

 //   const checkbox = document.querySelector('.checkbox');
//    checkbox.addEventListener('change', displayWords(wordList.slice(0, wordCountsInPage)));
    const checkboxIsShuffle = document.querySelector('.isShuffle');
    checkboxIsShuffle.addEventListener('change', function (e) {

            IsShuffle=document.querySelector('.isShuffle').checked;
//            handleFile({ target: { files: [fileInput.files[0]] } }); // Reload words based on new IsShuffle value

    });
 

 
//    const nextButton = document.getElementById('nextButton');
//    nextButton.addEventListener('click', showNextWords);
});


function shuffleWords() {
    currentIndex = 0;
    currentSetIndex = 0;
    if(wordList[0].english.length>0){
    if(IsShuffle)
    {
        displayWords(wordList.slice(0, wordCountsInPage));

    }
    else
    {
        displayWords(wordListFirst.slice(0, wordCountsInPage));


    }
    }

}
function displayWords(wordList) {
    const wordListDiv = document.getElementById('wordList');
    const useForeignLanguage = document.querySelector('.checkbox').checked;
    const flipButton = document.getElementById('flipButton');
    const useQuezeMode = document.querySelector('.quizMode').checked;
    wordCountsInPage=parseInt(document.getElementById('inpCountId').value? document.getElementById('inpCountId').value :wordCountsInPage);
    wordCountsInPage=Math.min(wordCountsInPage,maxWordCountsInPage);

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
                     // Display a question popup with the clicked item's value and four approximate answers
                
                     if(useQuezeMode)
                     {
                        displayQuestionPopup(wordsToDisplay[i],wordDiv,useForeignLanguage ? wordsToDisplay[i].english : wordsToDisplay[i].foreign,useForeignLanguage ? wordsToDisplay[i].foreign_2 ? wordsToDisplay[i].foreign_2 : '' : wordsToDisplay[i].english_2 ? wordsToDisplay[i].english_2 : '')
                        
                     }
            
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
                    wordListFirst= jsonData;
                    if(IsShuffle)
                    {
                        wordList = shuffleArray(jsonData);
                    }
                    else
                    {
                    wordList = jsonData;
                    }
                } else if (extension === 'json') {
                    // Handle JSON file
                    //wordList = JSON.parse(e.target.result);
                    wordListFirst= JSON.parse(e.target.result);

                    if(IsShuffle)
                    {
                        wordList = shuffleArray(JSON.parse(e.target.result));
                    }
                    else
                    {
                    wordList = JSON.parse(e.target.result)
                    }
                    
                } 
                else {
                    console.error('Unsupported file type');
                    return;
                }


                currentIndex = 0;
                currentSetIndex = 0
                
            // Call fillDefaultAnswer before displaying words
            if(document.querySelector('.defaultAns').checked)
            {
                wordList = fillDefaultAnswer(wordList);
            }
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
                    if(IsShuffle)
                    {
                        displayWords(wordList.slice(0, wordCountsInPage));
    
                    }
                    else
                    {
                        displayWords(wordList);
                    }
    
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file);


        } else {
            reader.readAsBinaryString(file);
        }
    }

    document.getElementById("inpCountId").disabled = true;
    document.getElementById("isShuffleId").disabled = true;
    document.getElementById("quizId").disabled = true;
    document.getElementById("languageCheckboxId").disabled = true;
    document.getElementById("defaultAnsId").disabled = true;


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




function displayQuestionPopup(clickedWord,wordDiv,front,back) {
    clickedWord=fillDefaultAnswer(clickedWord);
    // Get the clicked word's values
    const useForeignLanguage = document.querySelector('.checkbox').checked;
    const flipButton = document.getElementById('flipButton');
    flipButton.setAttribute('data-front', '');
    flipButton.setAttribute('data-back', '');
    let foreignValue;
    let ans1;
    let ans2;
    let ans3;
    let question;

    
    if(useForeignLanguage)
    {
        question=clickedWord.foreign;
        foreignValue = clickedWord.english;
        ans1 = clickedWord.f_ans_1;
        ans2 = clickedWord.f_ans_2;
        ans3 = clickedWord.f_ans_3;
    
    }
    else
    {
        question=clickedWord.english;
        foreignValue = clickedWord.foreign;
        ans1 = clickedWord.ans_1;
        ans2 = clickedWord.ans_2;
        ans3 = clickedWord.ans_3;    
    }


    // Create an array with the answers (including the correct one)
    const answers = [foreignValue, ans1, ans2, ans3];

    // Shuffle the answers array
    const shuffledAnswers = shuffleArray(answers);

    // Display the question popup
    const questionPopup = document.createElement('div');
    questionPopup.classList.add('question-popup');
    questionPopup.innerHTML = `
        <p>What is the translation of <strong>${question}</strong>?</p>
        <ul>
            ${shuffledAnswers.map(answer => `<li>${answer}</li>`).join('')}
        </ul>
    `;

    // Append the question popup to the body
    document.body.appendChild(questionPopup);

    // Add click event listeners to each answer
    questionPopup.querySelectorAll('li').forEach(answerElement => {
        answerElement.addEventListener('click', function () {
            // Check if the clicked answer is correct
            const isCorrect = answerElement.textContent === foreignValue;
            result =isCorrect;

            // Highlight the correct and incorrect answers
            answerElement.style.backgroundColor = isCorrect ? 'green' : 'red';
            answerElement.style.color = 'white';
            wordDiv.style.backgroundColor = isCorrect ? 'green' : 'red';
            wordDiv.style.color = 'white';

            wordDiv.classList.add('answerElement');

            // Close the question popup after a short delay
            setTimeout(() => {
                questionPopup.remove();
                flipButton.setAttribute('data-front', front);
                flipButton.setAttribute('data-back', back);
                        }, 1000);
        });
    });


}





function fillDefaultAnswer(wordList) {
    // Loop through each word in the wordList
    for (let i = 0; i < wordList.length; i++) {
        // Generate random indices for ans_1, ans_2, ans_3
        const ansIndices = getRandomIndices(wordList.length, i);
        // Fill ans_1, ans_2, ans_3 from foreign column values
        wordList[i].ans_1 = wordList[ansIndices[0]].foreign;
        wordList[i].ans_2 = wordList[ansIndices[1]].foreign;
        wordList[i].ans_3 = wordList[ansIndices[2]].foreign;

        // Generate random indices for f_ans_1, f_ans_2, f_ans_3
        const fAnsIndices = getRandomIndices(wordList.length, i);
        // Fill f_ans_1, f_ans_2, f_ans_3 from english column values
        wordList[i].f_ans_1 = wordList[fAnsIndices[0]].english;
        wordList[i].f_ans_2 = wordList[fAnsIndices[1]].english;
        wordList[i].f_ans_3 = wordList[fAnsIndices[2]].english;
    }

    return wordList;
}

// Helper function to generate random indices excluding the current index
function getRandomIndices(count, currentIndex) {
    const indices = [];
    while (indices.length < count - 1) {
        const randomIndex = Math.floor(Math.random() * count);
        if (randomIndex !== currentIndex && !indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
}
