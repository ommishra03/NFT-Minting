// Check for MetaMask and initialize Web3
if (typeof window.ethereum !== 'undefined') {
  window.web3 = new Web3(window.ethereum);
  window.ethereum.request({ method: 'eth_requestAccounts' });
} else {
  alert("MetaMask not detected. Please install MetaMask to use this application.");
}

// Contract ABI and Address (replace with deployed contract's details)
const contractABI = [[
	{
		"inputs": [],
		"name": "joinGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "PlayerJoined",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"name": "ScoreUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newScore",
				"type": "uint256"
			}
		],
		"name": "updateScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			}
		],
		"name": "getPlayer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalPlayers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "playerList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ];
const contractAddress = '0xe7CB1054F2799F60B239C0cb19bfcfdA5166a416';

// Create contract instance
const gameContract = new web3.eth.Contract(contractABI, contractAddress);

// Update status message
document.getElementById("status").innerText = "Connected to MetaMask";

// Join Game function
async function joinGame() {
  try {
      const accounts = await web3.eth.getAccounts();
      await gameContract.methods.joinGame().send({ from: accounts[0] });
      alert("You joined the game!");
  } catch (error) {
      console.error("Error joining game:", error);
  }
}

// Update Score function
async function updateScore() {
  const score = document.getElementById('scoreInput').value;
  if (!score) {
      alert("Please enter a score!");
      return;
  }
  try {
      const accounts = await web3.eth.getAccounts();
      await gameContract.methods.updateScore(parseInt(score)).send({ from: accounts[0] });
      alert("Score updated!");
      loadLeaderboard();
  } catch (error) {
      console.error("Error updating score:", error);
  }
}

// Load Leaderboard
async function loadLeaderboard() {
  try {
      const playerAddresses = await gameContract.methods.playerList().call();
      const leaderboard = document.getElementById('leaderboardList');
      leaderboard.innerHTML = "";

      for (let i = 0; i < playerAddresses.length; i++) {
          const playerAddress = playerAddresses[i];
          const player = await gameContract.methods.getPlayer(playerAddress).call();
          const listItem = document.createElement('li');
          listItem.innerText = `Player: ${player.playerAddress}, Score: ${player.score}`;
          leaderboard.appendChild(listItem);
      }
  } catch (error) {
      console.error("Error loading leaderboard:", error);
  }
}

// Initial load of leaderboard
loadLeaderboard();
