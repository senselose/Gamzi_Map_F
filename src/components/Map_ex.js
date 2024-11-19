import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";

const Map_ex = () => {
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [guData, setGuData] = useState({}); // 구 단위 데이터 상태
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5683, 127.0058),
        level: 8,
      };
      const newMap = new window.kakao.maps.Map(container, options);
      setMap(newMap); // 지도 객체 저장
    }
  }, []);

  const addOrUpdateMarker = (guName, coords) => {
    setGuData((prevGuData) => {
      const updatedGuData = { ...prevGuData };

      if (updatedGuData[guName]) {
        // 기존 마커가 있을 경우 카운트 증가 및 숫자 업데이트
        updatedGuData[guName].count += 1;

        const overlayContent = `
          <div style="background: red; color: white; padding: 5px 10px; border-radius: 25px;">
            ${updatedGuData[guName].count}
          </div>
        `;
        updatedGuData[guName].overlay.setContent(overlayContent);
      } else {
        // 새로운 구일 경우 마커 및 오버레이 생성
        const count = 1;

        const overlayContent = `
          <div style="background: red; color: white; padding: 5px 10px; border-radius: 25px;">
            ${count}
          </div>
        `;
        const overlay = new window.kakao.maps.CustomOverlay({
          position: coords,
          content: overlayContent,
          map: map,
        });

        updatedGuData[guName] = { count, overlay };
      }

      return updatedGuData;
    });
  };

  const handleAddPost = (newPost) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API is not loaded.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 상세 주소에서 구 단위 정보 추출
    geocoder.addressSearch(newPost.location, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 구 이름 추출
        const guName = `${result[0].region_1depth_name} ${result[0].region_2depth_name}`;

        // 구 이름으로 중심 좌표 검색
        geocoder.addressSearch(guName, function (guResult, guStatus) {
          if (guStatus === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(guResult[0].y, guResult[0].x);

            // 구 중심 좌표에 마커 추가 또는 업데이트
            addOrUpdateMarker(guName, coords);
          } else {
            console.error("Failed to fetch coordinates for Gu:", guName);
          }
        });
      } else {
        console.error("Failed to fetch address:", newPost.location);
      }
    });
  };

  return (
    <div>
      <PostForm onAddPost={handleAddPost} />
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default Map_ex;
