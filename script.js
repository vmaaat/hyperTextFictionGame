document.addEventListener("DOMContentLoaded", function() {
    const startForm = document.getElementById("start-form")
    const gameCanvas = document.getElementById("game-canvas")
    const startMenu = document.getElementById("start-menu")
    const importMenu = document.getElementById("import-menu")
    const descriptionMenu = document.getElementById("description-menu")
    const backButton = document.getElementById("back-button")
    const saveButton = document.getElementById("save-button")
    const importButton = document.getElementById("import-button")
    const deleteButton = document.getElementById("delete-button")
    const importJsonInput = document.getElementById("import-json")
    const importedDataList = document.getElementById("imported-data-list")
    const timerDisplay = document.getElementById("timer")
    const playerNameDisplay = document.getElementById("player-name-display")

    let timerInterval
    let timeElapsed = 0

    function showTimer() {
        document.getElementById("timer").style.display = "block"
    }

    function showName() {
        document.getElementById("player-name-display").style.display = "block"
    }

    startForm.addEventListener("submit", function(event) {
        event.preventDefault()
        const playerName = document.getElementById("player-name").value
        if (playerName.trim() === "") {
            alert("Please enter your name.")
            return
        }
        startGame(playerName)
    })

    backButton.addEventListener("click", function() {
        backToMenu()
    })

    saveButton.addEventListener("click", function() {
        const playerName = document.getElementById("player-name").value
        const timerValue = timeElapsed
        if (!playerName || !timerValue) {
            alert("No game data available to save.")
            return
        }
        const data = {
            playerName: playerName,
            timerValue: timerValue
        }
        saveToFile(data)
    })

    importButton.addEventListener("click", function() {
        const file = importJsonInput.files[0]
        if (!file) {
            alert("Please select a file to import.")
            return
        }
        const reader = new FileReader()
        reader.onload = function(event) {
            const importedData = JSON.parse(event.target.result)
            addImportedDataToList(importedData)
        }
        reader.readAsText(file)
    })

    deleteButton.addEventListener("click", clearImportedList)

    function startGame(playerName) {
        resetGame()
        startMenu.style.display = "none"
        importMenu.style.display = "none"
        descriptionMenu.style.display = "none"
        gameCanvas.style.display = "block"
        backButton.style.display = "block"

        //timer
        showTimer()
        timerInterval = setInterval(updateTimer, 1000)
        updateTimer()

        //name display
        showName()
        playerNameDisplay.textContent = "Player: " + playerName
    }

    function backToMenu() {
        gameCanvas.style.display = "none"
        backButton.style.display = "none"
        startMenu.style.display = "block"
        importMenu.style.display = "block"
        descriptionMenu.style.display = "block"
        document.getElementById("timer").style.display = "none"
        document.getElementById("player-name-display").style.display = "none"
        stopTimer()
    }

    function saveToFile(data) {
        const playerName = data.playerName
        const jsonString = JSON.stringify(data)
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = playerName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    function addImportedDataToList(data) {
        const listItem = document.createElement("li")
        listItem.textContent = `Player: ${data.playerName}, Time Elapsed: ${data.timerValue}`
        importedDataList.appendChild(listItem)
    }

    function clearImportedList() {
        importedDataList.innerHTML = ""
    }

    function updateTimer() {
        timeElapsed++
        const minutes = Math.floor(timeElapsed / 60)
        const seconds = timeElapsed % 60
        timerDisplay.textContent = `Time Elapsed:${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    function stopTimer() {
        clearInterval(timerInterval)
    }

    function resetTimer() {
        stopTimer()
        timeElapsed = -1
    }

    function resetGame() {
        resetTimer()
    }
})