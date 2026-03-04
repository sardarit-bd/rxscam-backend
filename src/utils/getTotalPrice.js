function getTotalPrice(items = []) {
    return items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        return sum + price;
    }, 0);
}

export default getTotalPrice;