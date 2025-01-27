import {
    Connection,
    PublicKey
} from '@solana/web3.js';
import axios from 'axios';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");
const publicKey = new PublicKey('orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8');
const botToken = '';
const chatId = '';

async function sendMessage(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        });

    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}

// async function test() {
//     const sig = await connection.getSignaturesForAddress(publicKey, {limit: 1}, 'confirmed');
//     await sendMessage(`New transaction!\n\nhttps://solscan.io/tx/${sig[0].signature}`)
// }

// test();

connection.onAccountChange(
    publicKey,
    async () => {
        const sig = await connection.getSignaturesForAddress(publicKey, {limit: 1}, 'confirmed');
        await sendMessage(`New transaction!\n\nhttps://solscan.io/tx/${sig[0].signature}`)
    },
    'confirmed'
);