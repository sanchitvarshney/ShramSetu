import { Dispatch, SetStateAction } from "react";
export interface MainUIStateType {
    notification: boolean;
    setNotification: Dispatch<SetStateAction<boolean>>;
  }

  export interface Props {
    uiState: MainUIStateType;
  }