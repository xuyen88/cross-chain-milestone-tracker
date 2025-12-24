// Bộ theo dõi Milestone trên mạng Cardano
const axios = require('axios');

async function trackCardanoMilestones(scriptAddress) {
  console.log(`🔍 Đang quét các UTXO tại địa chỉ Script: ${scriptAddress}`);
  
  // Giả sử sử dụng Blockfrost API để lấy dữ liệu eUTXO
  // Trên Cardano, mỗi UTXO đại diện cho một đợt giải ngân (Milestone)
  const response = await axios.get(`https://cardano-mainnet.blockfrost.io/api/v0/addresses/${scriptAddress}/utxos`);
  
  const milestones = response.data.map(utxo => {
    return {
      txHash: utxo.tx_hash,
      amount: utxo.amount[0].quantity / 1000000, // Đổi từ Lovelace sang ADA
      status: "Locked (Waiting for Assessor)"
    };
  });

  console.table(milestones);
}

// Địa chỉ ví dụ của một Escrow Smart Contract trên Cardano
trackCardanoMilestones("addr_test1...");
