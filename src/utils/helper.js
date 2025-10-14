export const toNum = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
};

export const insertInOrder = (prevArr, newItem, orderArray) => {
    const copy = [...prevArr];
    const newOrderIdx = orderArray.indexOf(Number(newItem.number));
    if (newOrderIdx === -1) {
        copy.push(newItem);
        return copy;
    }

    let insertAt = copy.findIndex((el) => {
        const idx = orderArray.indexOf(Number(el.number));
        return idx > newOrderIdx;
    });

    if (insertAt === -1) {
        copy.push(newItem);
    } else {
        copy.splice(insertAt, 0, newItem);
    }
    return copy;
};