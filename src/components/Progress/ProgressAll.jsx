import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Listprofile from '../../elem/Listprofile';
import { pop3PB } from '../../global/sound';

const ProgressAll = () => {
  const navigate = useNavigate();
  const [newData, setNewdata] = useState([]);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);
  const [ref, setRef] = useState(null);
  const [list, setList] = useState(false);
  const baseURL = process.env.REACT_APP_API_KEY;

  const getProgressData = async () => {
    setLoad(true);
    try {
      const { data } = await axios.get(
        `${baseURL}/post/gif/images/0?size=6&page=${page}`
      );
      if (!data) {
        return;
      }
      setNewdata(newData.concat(data.data));
    } catch (error) {
      console.log(error);
    }

    setLoad(false);
  };

  useEffect(() => {
    getProgressData();
  }, [page]);

  const options = {
    rootMargin: '30px',
    threshold: 1.0,
  };

  const onIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setPage((page) => page + 1);

        observer.observe(entry.target);
      }
    });
  };

  useEffect(() => {
    let observer;
    if (ref) {
      observer = new IntersectionObserver(onIntersect, options);
      setTimeout(() => {
        observer.observe(ref);
      }, 500);
    }
    return () => observer && observer.disconnect();
  }, [ref]);

  return (
    <ListBox>
      {/* {load === true ? <Loadings /> : null} */}

      {newData?.map((item, index) => (
        <BestBox key={uuidv4()}>
          <div style={{ position: 'relative' }}>
            <OverlayWrap
              productImg={item?.imgUrl}
              onClick={() => {
                navigate(`/progressdetail/${item.id}`);
                pop3PB.play();
              }}
            >
              <Overlay>
                <DescBox>
                  {item?.topic === null ? (
                    <Keyword>FREE</Keyword>
                  ) : (
                    <Keyword> {item?.topic}</Keyword>
                  )}
                </DescBox>
              </Overlay>
            </OverlayWrap>
            <BestImg />
          </div>
          <BestDesc>
            <Listprofile item={item} />
            <Nickname>
              {item?.participantCount <= 0 ? (
                <>{item?.nickname.slice(0, 8)} </>
              ) : (
                <>
                  {item?.nickname.slice(0, 8)} 외 {item?.participantCount} 명
                </>
              )}
            </Nickname>
          </BestDesc>
        </BestBox>
      ))}
      <>
        <div ref={setRef}></div>
      </>
    </ListBox>
  );
};

export default ProgressAll;

const Width = styled.div`
  width: 350px;
`;

const ListBox = styled.div`
  max-width: 1200px;
  margin: auto;
  margin-top: 20px;
  position: sticky;
  z-index: 1;
`;

const BestBox = styled(Width)`
  height: 300px;
  margin-top: 50px;
  display: inline-block;
  margin-left: 35px;
  background: white;
  transition: 0.2s ease-in;
  &:hover {
    transform: scale(1.05);
  }
`;

const BestDesc = styled(Width)`
  height: 50px;
  margin-top: 20px;
  ${({ theme }) => theme.flexSet('row', 'flex-start', 'flex-start')}
`;

const DescBox = styled(Width)`
  height: 110px;
  ${({ theme }) => theme.flexSet('row', 'flex-start', 'center')}
`;

const Span = styled.span`
  font-size: 30px;
  font-weight: 800;
`;

const Keyword = styled(Span)`
  padding-top: 370px;
  padding-left: 10px;
  font-family: 'Noto Bold';
  font-size: 20px;
  color: white;
`;

const Nickname = styled(Span)`
  margin-right: 100px;
  margin-top: 10px;
  display: inline-block;
  font-family: 'NotoBold';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #2e3248;
  letter-spacing: -0.02em;
`;

const OverlaySize = css`
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div`
  ${OverlaySize}
  margin-top: 100%;
  height: 300px;
  background: white;
  cursor: pointer;
  background: linear-gradient(
    360deg,
    #000000 -90.11%,
    rgba(103, 103, 103, 0) 67.83%
  );
  transition: all 1s;
`;

const OverlayWrap = styled.div`
  ${OverlaySize}
  overflow: hidden;
  position: absolute;

  background: url(${(props) => props.productImg});
  ${({ theme }) => theme.backgroundSet('contain')};
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.09);

  &:hover ${Overlay} {
    margin-top: 10%;
  }
`;

const BestImg = styled.div`
  width: 350px;
  height: 300px;
  display: block;
`;
