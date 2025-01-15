document.addEventListener("DOMContentLoaded", function () {


    const searchButton = document.getElementById('search-btn')
    const usernameInput = document.getElementById('input');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const cardStatsContainer = document.querySelector('.stats-cards');


    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be Empty!");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username!")
        }
        return isMatching;

    }
    async function fetchUserDetails(username) {

        try {
            searchButton.textContent = "Searching..."
            searchButton.disabled = true;
            // statsContainer.style.display = "hidden";
            const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);

            displayUserDetails(parsedData);
        }
        catch (Error) {
            statsContainer.innerHTML = `<p>${Error.message}</p>`   
        }
        finally {
            searchButton.textContent = "Search"
            searchButton.disabled = false;
        }

    }
    function updateProgress(total, solved, label, cirlce) {
        const percentage = (solved/total)*100;
        cirlce.style.setProperty("--progress-degree", `${percentage}%`);
        label.textContent = `${solved}/${total}`;
        
    }
    function displayUserDetails(parsedData) {
        const totalQuestions = parsedData.totalQuestions;
        const totalEasyQuestions = parsedData.totalEasy;
        const totalMediumQuestions = parsedData.totalMedium;
        const totalHardQuestions = parsedData.totalHard;

        const totalQuestionsSolved = parsedData.totalSolved;
        const totalEasyQuestionsSolved = parsedData.easySolved;
        const totalMediumQuestionsSolved = parsedData.mediumSolved;
        const totalHardQuestionsSolved = parsedData.hardSolved;

        updateProgress(totalEasyQuestions, totalEasyQuestionsSolved, easyLabel, easyProgressCircle);
        updateProgress(totalMediumQuestions, totalMediumQuestionsSolved, mediumLabel, mediumProgressCircle);
        updateProgress(totalHardQuestions, totalHardQuestionsSolved, hardLabel, hardProgressCircle);

        const cards = [
            {label: "Overall Submissions", value: parsedData.totalSubmissions[0].submissions},
            {label: "Easy Submissions", value: parsedData.totalSubmissions[1].submissions},
            {label: "Medium Submissions", value: parsedData.totalSubmissions[2].submissions},
            {label: "Hard Submissions", value: parsedData.totalSubmissions[3].submissions}
        ]

        console.log("cards: ", cards);
        cardStatsContainer.innerHTML = cards.map(
            data => 
                `<div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>`
        ).join("");
        

    }


    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }

    })

})