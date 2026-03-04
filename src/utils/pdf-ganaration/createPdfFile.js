import generateOrderPdf from "./generateOrderPdf.js";

const createPdfFile = async (order, orderID) => {

    const file = await generateOrderPdf(order, orderID);
    return file;
};

export default createPdfFile;