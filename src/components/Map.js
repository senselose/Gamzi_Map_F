import React, { useEffect, useState } from 'react';
import { getCoordinates } from '../utils/getCoordinates';
import { fetchAndProcessData } from './fetchAndProcessData';


const Map = () => {
  const [posts, setPosts] = useState([]); 

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        // CSV 데이터 가져와서 상태 업데이트
        const data = await fetchAndProcessData(); 
        console.log('Fetched CSV Data:', data);
        setPosts(data); // posts 상태 업데이트
      } catch (error) {
        console.error('Error loading markers:', error);
      }
    };

    if (window.kakao && window.kakao.maps) {
      // 지도 생성
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5683, 127.0058), // 지도 중심 좌표
        level: 8, // 확대 레벨
        // mapTypeId: window.kakao.maps.MapTypeId.ROADMAP, // 지도 타입 설정
      };
      const map = new window.kakao.maps.Map(container, options);

      loadMarkers();
      console.log('Posts state after loadMarkers:', posts); // 상태 확인

      // GeoJSON 파일로 경계 표시
      fetch(`${process.env.PUBLIC_URL}/data/Merged_sigungu_simply.json`)
        .then((response) => response.json())
        .then((geojson) => {
          geojson.features.forEach((feature) => {
            const geometryType = feature.geometry.type;

            if (geometryType === 'Polygon') {
              // 단일 Polygon 처리
              const coordinates = feature.geometry.coordinates[0].map(
                (coord) => new window.kakao.maps.LatLng(coord[1], coord[0])
              );
              renderPolygon(map, coordinates);
            } else if (geometryType === 'MultiPolygon') {
              // MultiPolygon 처리
              feature.geometry.coordinates.forEach((polygonCoords) => {
                const coordinates = polygonCoords[0].map(
                  (coord) => new window.kakao.maps.LatLng(coord[1], coord[0])
                );
                renderPolygon(map, coordinates);
              });
            }
          });
        })
        .catch((error) => console.error('Error fetching boundary data:', error));

      // 다각형을 지도에 렌더링하는 함수
      const renderPolygon = (map, coordinates) => {
        const polygon = new window.kakao.maps.Polygon({
          path: coordinates,
          strokeWeight: 1, // 경계선 두께
          strokeColor: '#FF0000', // 경계선 색상
          strokeOpacity: 0.1, // 경계선 불투명도
          strokeStyle: 'solid', // 경계선 스타일
          fillColor: '#FFAAAA', // 채우기 색상
          fillOpacity: 0.5, // 채우기 불투명도
        });

        polygon.setMap(map);
      };

      // 커스텀 마커 이미지 설정
      const markerImageSrc = `${process.env.PUBLIC_URL}/data/Fire.gif`; // 마커 이미지 경로
      const markerImageSize = new window.kakao.maps.Size(24, 35); // 마커 이미지 크기
      const markerImageOption = { offset: new window.kakao.maps.Point(12, 35) }; // 마커 이미지 기준 위치
      const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);

      // 클러스터 스타일 설정 (마커 개수에 따른 이미지 변경)
      const clusterStyles = [
        {
          width: '100px', height: '100px',
          background: `url(${process.env.PUBLIC_URL}/data/fire.png) no-repeat center`, // 마커 수가 적을 때 이미지
          backgroundSize: '100% 100%',
          textAlign: 'center',
          textColor: '#ffffff', fontWeight: 'bold',
        },
        {
          width: '100px', height: '100px',
          background: `url(${process.env.PUBLIC_URL}/data/bomb.gif) no-repeat center`, // 마커 수가 많을 때 이미지
          textAlign: 'center',
          textColor: '#ffffff', fontWeight: 'bold',
          backgroundSize: '100% 100%',
        },
      ];

      // 마커 클러스터러 생성
      const clusterer = new window.kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 10,
        styles: clusterStyles, // 클러스터 이미지 스타일 설정
      });
      
      // posts 상태를 사용하여 지도에 마커 추가
      posts.forEach((post) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(post.lat, post.lng),
          image: markerImage,
        });
        marker.setMap(map);
      });
    }
  }, []);

  // onAddPost 함수 정의
  const onAddPost = async (postData) => {
    console.log("New post added:", postData);
    // 백엔드에서 위치 데이터(위도/경도) 가져오기
    const { siGunGu, coordinates } = await getCoordinates(postData.location);
    setPosts((prevPosts) => [
      ...prevPosts,
      { ...postData, lat: coordinates.y, lng: coordinates.x },
    ]);
  };

  return <div id="map" style={{ width: '40%', height: '400px' }}></div>;
};

export default Map;
