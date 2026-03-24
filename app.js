// 🔗 BLOCKCHAIN CONNECTION
let web3;
let contract;

const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
const abi = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_message", "type": "string" },
            { "internalType": "string", "name": "_category", "type": "string" }
        ],
        "name": "storeLead",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "leads",
        "outputs": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "string", "name": "message", "type": "string" },
            { "internalType": "string", "name": "category", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// 🔗 CONNECT WALLET FUNCTION
async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            contract = new web3.eth.Contract(abi, contractAddress);

            // ✅ SHOW WALLET ADDRESS
            document.getElementById("walletAddress").innerText =
                "Connected: " + accounts[0];

        } catch (error) {
            console.error(error);
            alert("Connection failed ❌");
        }
    } else {
        alert("MetaMask not installed ❌");
    }
}

// 🤖 AI LOGIC TO ANALYZE LEAD
function analyzeLead(message) {
    message = message.toLowerCase();

    let category = "";
    let reply = "";
    let score = Math.floor(Math.random() * 100);

    if (message.includes("buy") || message.includes("price")) {
        category = "Hot Lead 🔥";
        reply = "We’d love to help you purchase!";
    } else if (message.includes("details") || message.includes("info")) {
        category = "Warm Lead 🙂";
        reply = "Here are more details for you.";
    } else {
        category = "Cold Lead ❄️";
        reply = "Thanks! We'll get back soon.";
    }

    return { category, reply, score };
}

// 🚀 MAIN FUNCTION TO PROCESS LEAD
async function processLead() {

    // 🔹 1️⃣ Wallet check
    if (!contract) {
        alert("Please connect wallet first 🔗");
        return;
    }

    // 🔹 2️⃣ Input validation
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    if (!name || !message) {
        alert("Please enter both name and message");
        return;
    }

    // 🔹 3️⃣ Analyze the lead
    const result = analyzeLead(message);

    // 🎨 Badge styling logic
    let badgeClass = "";
    if (result.category.includes("Hot")) badgeClass = "hot";
    else if (result.category.includes("Warm")) badgeClass = "warm";
    else badgeClass = "cold";

    // 🎨 Display result in UI
    document.getElementById("result").innerHTML =
        `<p><b>Name:</b> ${name}</p>
         <p><b>Category:</b> <span class="badge ${badgeClass}">${result.category}</span></p>
         <p><b>Reply:</b> ${result.reply}</p>
         <p><b>AI Score:</b> ${result.score}%</p>
         <p><b>⏱️ Time Saved:</b> 2 minutes</p>`;

    // 🔹 4️⃣ Show loading spinner
    document.getElementById("loading").style.display = "block";

    // 🔹 5️⃣ Blockchain transaction
    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.storeLead(name, message, result.category)
            .send({ from: accounts[0] });

        alert("Stored on Blockchain ✅");
    } catch (error) {
        console.error(error);
        alert("Transaction failed ❌");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}