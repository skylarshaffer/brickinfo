export async function removeOldPriceTables(): Promise<void> {
    const $oldPriceTables = document.querySelectorAll('div[class*="price-table"]')
    if ($oldPriceTables.length) {
        $oldPriceTables.forEach(($oldPriceTable) => {
            $oldPriceTable.remove()
        })
    }
    return
}