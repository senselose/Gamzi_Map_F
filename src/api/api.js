import axios from 'axios';

const KAKAO_API_URL = "https://dapi.kakao.com/v2/local/search/address.json";
const KAKAO_API_KEY = "e7a2c1cbb463e421c712a11a979a0cd7"; // 발급받은 API 키

export const searchAddress = async (query) => {
    try {
        const response = await axios.get(KAKAO_API_URL, {
            headers: {
                Authorization: `KakaoAK ${KAKAO_API_KEY}`, // KakaoAK 접두사 포함
            },
            params: {
                query: query, // 검색할 주소
            },
        });
        console.log("API Response:", response.data); // 응답 확인
        return response.data.documents; // 검색 결과 반환
    } catch (error) {
        console.error("Error fetching address:", error);
        return [];
    }
};