export function generateUniqueId() {
    const timestamp = Date.now().toString(36); // time part
    const random = Math.random().toString(36).substring(2, 8); // random part
    return `${"RX-SCAM"}-${timestamp}-${random}`.toUpperCase();
}

export default generateUniqueId;