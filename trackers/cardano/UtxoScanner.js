// Bộ theo dõi Milestone trên mạng Cardano (Bản nâng cấp bảo mật)
const axios = require('axios');
require('dotenv').config();
async function trackCardanoMilestones(scriptAddress) {
    // 1. Kiểm tra đầu vào cơ bản
    if (!scriptAddress || scriptAddress === "addr_test1...") {
        console.error("❌ Lỗi: Vui lòng cung cấp địa chỉ Script hợp lệ.");
        return;
    }

    console.log(`🔍 Đang bắt đầu quét UTXO tại: ${scriptAddress}...`);

    try {
        // 2. Thực hiện truy vấn với cơ chế bắt lỗi
        // Lưu ý: PROJECT_ID nên được bảo mật trong file .env (Sẽ làm ở Bước 2)
        const response = await axios.get(
            `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${scriptAddress}/utxos`,
            { headers: { 'project_id': process.env.BLOCKFROST_PROJECT_ID } }
        );

        if (response.data.length === 0) {
            console.log("⚠️ Thông báo: Không tìm thấy UTXO nào (Chưa có tiền được khóa).");
            return;
        }

        // 3. Chuẩn hóa dữ liệu (Data Normalization)
        // Chuyển đổi dữ liệu thô từ Cardano về định dạng báo cáo tiêu chuẩn
        const milestones = response.data.map(utxo => ({
            txHash: utxo.tx_hash,
            amountAda: utxo.amount[0].quantity / 1000000,
            status: "Locked/Waiting",
            network: "Cardano"
        }));

        console.log("✅ Dữ liệu Milestone tìm thấy:");
        console.table(milestones);

    } catch (error) {
        // 4. Xử lý các loại lỗi khác nhau
        if (error.response) {
            console.error(`❌ Lỗi API (${error.response.status}): ${error.response.data.message}`);
        } else {
            console.error("❌ Lỗi: Không thể kết nối tới Blockchain Gateway.");
        }
    }
}

// Thực thi với địa chỉ từ biến môi trường hoặc địa chỉ mặc định
const TARGET_ADDRESS = process.env.CARDANO_SCRIPT_ADDRESS || "addr_test1...";
trackCardanoMilestones(TARGET_ADDRESS);
