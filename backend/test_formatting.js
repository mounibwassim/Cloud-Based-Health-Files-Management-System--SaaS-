try {
    const formatter = new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' });

    console.log("Testing Number:", formatter.format(1500.50));
    console.log("Testing String:", formatter.format("1500.50"));
    console.log("Testing String 2:", formatter.format("1000"));
} catch (e) {
    console.error("Format Failed:", e.message);
}
