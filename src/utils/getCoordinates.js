import axios from "axios";

const KAKAO_API_KEY = "e7a2c1cbb463e421c712a11a979a0cd7"; // 발급받은 카카오 REST API 키

export const getCoordinates = async (address) => {
    try {
        const response = await axios.get("https://dapi.kakao.com/v2/local/search/address.json", {
            headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
            params: { query: address },
        });

        console.log("API Response details:", response.data.documents[0]);

        if (response.data.documents.length > 0) {
            const document = response.data.documents[0];

            // 도로명 주소 또는 지번 주소 선택
            const addressData = document.road_address
                ? document.road_address.address_name
                : document.address.address_name;

                const addressParts = addressData.split(" "); // 공백으로 나누기

                // 시도
                const region1 = addressParts[0] || "Unknown"; // 서울특별시, 전북특별자치도 등
                // 시군구 (구 이하 제거)
                const region2 = addressParts.length >= 3 && addressParts[2].includes("구")
                    ? `${addressParts[1]} ${addressParts[2]}`
                    : addressParts[1] || "Unknown";
    
                return {
                    address: addressData,
                    siGunGu: `${region1} ${region2}`, // 시 + 구만 포함
                    coordinates: {
                        x: document.x || "Unknown",
                        y: document.y || "Unknown",
                    },
                };
        } else {
            console.log(`No data found for address: ${address}`);
            return { address, siGunGu: "Unknown", coordinates: null };
        }
    } catch (error) {
        console.error("Error fetching coordinates for address:", address, error);
        return { address, siGunGu: "Unknown", coordinates: null };
    }

};
