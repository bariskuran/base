import styled from "styled-components";
import { Button } from 'antd';

const LockButton = styled(Button)`
  margin-left: 20px;
  margin-right: 10px;
  border-color: #595959;
  border-radius: 20px; 
  width: 100px; 
  height: 40px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 


  &:hover {
    background-color: #3a3d45; 
    border-color: #707070; 
  }

  &:focus {
    background-color: #3a3d45; 
    border-color: #707070; 
  }

  &:active {
    background-color: #23252b; 
    border-color: #4d4d4d; 
  }
`;

export default LockButton;