const functions = require('firebase-functions');
var express = require('express');
const axios = require('axios');
var Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const bodyParser = require("body-parser");
const cors = require('cors');
const Buffer = require('safer-buffer').Buffer;
const fromAddr = 'ethereum public key'
const privateKey = 'ethereum private key'
var web3 = new Web3('https://ropsten.infura.io/v3/ad5e99c0b4274a698702b461b57a7f09');

var app = express();
app.use(cors({
    origin: true
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.status(200).send('ok')
});
app.post('/api', (req, res) => {
    const toAddr = req.body.ethereum_wallet
        var private_Key = Buffer.from(privateKey, 'hex');
        axios.get('https://ethgasstation.info/json/ethgasAPI.json').then(response => {
            let prices = {
                low: response.data.safeLow / 10,
                medium: response.data.average / 10,
                high: response.data.fast / 10
            }
            var gasPrice = (prices.low * 1000000000).toFixed(0);
            var sending_eth = web3.utils.toWei("1", 'ether');

            web3.eth.getTransactionCount(fromAddr).then(txCount => {
                var rawTx = {
                    nonce: web3.utils.toHex(txCount),
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: 0x5208,
                    to: toAddr,
                    value: web3.utils.toHex(sending_eth),
                    chainId: 0x03
                }

                var tx = new Tx(rawTx);
                tx.sign(private_Key);
                var serializedTx = tx.serialize();
                web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then(transaction => {
                    res.status(200).send({
                        hash: transaction
                    })
                })
            })
        })
});

exports.faucet = functions.https.onRequest(app);
// app.listen(3000, () => {
//     console.log('Server Listening on http://localhost:3000/');
// });