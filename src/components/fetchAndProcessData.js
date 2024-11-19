import axios from "axios";
import { getCoordinates } from "../utils/getCoordinates";


// 컴포넌트 외부로 이동하여 export
export const fetchAndProcessData = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/posts/addresses");
        const addresses = response.data;

        const processedData = [];
        for (const address of addresses) {
            const { siGunGu, coordinates } = await getCoordinates(address);
            processedData.push({
                location: siGunGu,
                lat: coordinates?.y || null,
                lng: coordinates?.x || null,
            });
        }

        console.log("Final processed data:", processedData);
        return processedData;
    } catch (error) {
        console.error("Error fetching and processing data:", error);
        return [];
    }
};
