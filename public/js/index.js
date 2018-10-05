get_balance = () => {
    axios.get(
        'https://api-ropsten.etherscan.io/api?module=account&action=balance&address=0xcF4CA355eC55724DEC46404B360bC00E516f6E8F&apikey=RIV89WHJKBBAS75BWT9QGNUPN8DST95H5P'
    ).then(data => {
        var total_balance = (data.data.result / 1e18).toFixed(6)
        document.getElementById("total_balance").innerHTML = total_balance
    })
}
get_balance()
document.querySelector("#faucet").addEventListener("submit", e => {
    document.getElementById("show_transaction").style.display = "none"
    e.preventDefault()
    document.getElementById("submit").innerHTML = "Please wait.."
    document.getElementById("submit").disabled = true;
    var ethereum_wallet = document.getElementById("ethereum_wallet").value;

    axios({
        method: "POST",
        url: "<firebae cloud function api url>faucet/api",  //ex https://xxxxx.cloudfunctions.net/
        data: {
            ethereum_wallet: ethereum_wallet
        }
    }).then(data => {
        var hash = data.data.hash.transactionHash
            if(hash) {
                document.getElementById("show_transaction").style.display = "block"
                document.getElementById("hash").href = "https://ropsten.etherscan.io/tx/" + hash
                document.getElementById("hash").innerHTML = "https://ropsten.etherscan.io/tx/" + hash.substr(
                    0, 5) + "..."
                document.getElementById("submit").innerHTML = "Submit"
                document.getElementById("submit").disabled = false;
                get_balance()
            }
    }).catch(error => {
        document.getElementById("delay").innerHTML = '*Network error'
        document.getElementById("submit").innerHTML = "Submit"
        document.getElementById("submit").disabled = false;
    })
})