import React, { useEffect, useState } from "react";
import { fetchAndProcessData } from "./fetchAndProcessData";



const ExportCSV = () => {
    const [processedData, setProcessedData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchAndProcessData(); // 함수 호출
            setProcessedData(data);
        };

        loadData(); // 데이터 로드
    }, []);

    const exportToCSV = () => {
        if (processedData.length === 0) {
            alert("No data to export.");
            return;
        }

        const csvContent = [
            ["ID", "Address", "SiGunGu", "Latitude", "Longitude"],
            ...processedData.map((row, index) => [
                index + 1,
                row.address,
                row.siGunGu,
                row.lat,
                row.lng,
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "addresses_with_coordinates.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <button onClick={exportToCSV}>Export to CSV</button>
        </div>
    );
};

export default ExportCSV;
