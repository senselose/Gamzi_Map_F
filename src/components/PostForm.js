import React, { useState } from 'react';
import axios from 'axios';
import { getCoordinates } from '../utils/getCoordinates';
import { fetchAndProcessData } from './fetchAndProcessData';



const PostForm = ({ onAddPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [location, setLocation] = useState('');

    const handleOpenPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                // 팝업에서 검색된 주소를 처리
                setLocation(data.address); // 검색된 주소를 location에 설정
            },
        }).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 사용자가 입력한 location 데이터를 시군구 단위로 변환
        const { siGunGu } = await getCoordinates(location);

        // 서버로 보낼 데이터를 객체로 선언
        const postData = { 
            title, 
            content, 
            location: siGunGu // 시군구 데이터만 저장
        };
        console.log("Submitting post:", postData);

        try {
            // 게시글 생성 API 호출
            const response = await axios.post("http://localhost:8080/api/posts", postData);
            console.log("Response from server:", response.data); // 응답 확인
            alert("Post saved successfully!");

            // 게시글 저장 후 CSV 업데이트
            await fetchAndProcessData(); // CSV 동기화

            // 폼 초기화
            setTitle('');
            setContent('');
            setLocation('');
        } catch (error) {
            console.error("Error saving post:", error); // 에러 로그 확인
            alert("Failed to save post.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    readOnly
                />
                <button type="button" onClick={handleOpenPostcode}>
                    Search Address
                </button>
            </div>
            <button type="submit">Create Post</button>
        </form>
    );
};

export default PostForm;
