import * as XLSX from "xlsx";

export const exportDataToExcel = (data: any, fileName = "data") => {
    if (!data || data.length === 0) {
        return;
    }

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Trigger file download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
