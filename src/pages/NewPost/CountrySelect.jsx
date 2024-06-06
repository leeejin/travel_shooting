import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import api from '../../util/api/api';
const Select = styled.div`
  width: 230px;
`;
const CountryBox = styled.div`
  position: absolute;
  overflow-y: scroll;
  width: 100%;
  height: ${(props) => (props.selected ? '200px' : '0px')};
  margin-bottom: 4px;
  border: ${(props) => (props.selected ? 'solid 1px #e6e6ea ' : '0px')};
`;
const CountryList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr;
  align-content: flex-start;
  row-gap: 8px;
  position: relative;
  background-color: var(--white-color);
  width: 100%;
`;
const CountryItem = styled.li`
  padding: 10px;
  &:hover {
    cursor: pointer;
    background-color: var(--yellow-color);
  }
`;
function CountrySelect() {
  const [countries, setCountries] = useState([]);
  const [isShowOptions, setIsShowOptions] = useState(false);
  const selectedCountry = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const countriesData = await api.countries.getAllCountries();
      setCountries(countriesData);
    }
    fetchData();
  }, []);

  const handleSelectValue = (e) => {
    selectedCountry.current.innerText = e.target.innerText;
    setIsShowOptions(false); // 선택 후 드롭다운 닫기
    localStorage.setItem('country', JSON.stringify(e.target.innerText));
  };

  return (
    <Select>
      <div
        className="title-input"
        ref={selectedCountry}
        onClick={() => setIsShowOptions((prev) => !prev)}
        style={{
          fontSize: '14px',
          textAlign: 'left',
          color: '#bbbbbb'
        }}
      >
        나라를 선택해주세요
      </div>

      <CountryBox selected={isShowOptions}>
        {isShowOptions && (
          <CountryList>
            {countries.map((filteredCountry, index) => (
              <CountryItem key={index} onClick={(e) => handleSelectValue(e)}>
                {filteredCountry}
              </CountryItem>
            ))}
          </CountryList>
        )}
      </CountryBox>
    </Select>
  );
}

export default CountrySelect;
