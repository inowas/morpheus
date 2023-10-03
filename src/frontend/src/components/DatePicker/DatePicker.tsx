import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import React, {useState} from 'react';
import {Calendar} from 'react-date-range';
import {Form, Popup} from 'semantic-ui-react';


interface IProps {
  date: Date | null;
  placeholder: string;
  onChangeDate: (date: Date | null) => void;
  onChangeFocus: () => void;
  formatDate: (date: Date) => string;
}

const DatePicker = ({
  date,
  onChangeDate,
  placeholder,
  onChangeFocus,
  formatDate,
}: IProps) => {
  const [popUpIsOpen, setPopUpIsOpen] = useState<boolean>(false);

  const handleChangeDatePicker = (selectedDate: Date) => {
    const utcDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
    onChangeDate(utcDate);
    setPopUpIsOpen(true);
    setTimeout(() => {
      setPopUpIsOpen(false);
      onChangeFocus();
    }, 200);
  };

  return (
    <Popup
      basic={true}
      data-testid="datepicker-popup"
      style={{zIndex: 20000000}}
      content={(
        <Calendar
          date={date ? date : new Date()}
          onChange={handleChangeDatePicker}
        />
      )}
      disabled={popUpIsOpen}
      on='click'
      pinned={true}
      position="bottom center"
      trigger={(
        <Form.Input
          data-testid="datepicker-input"
          placeholder={placeholder}
          value={date ? formatDate(date) : ''}
          type="text"
          style={{width: 105}}
        />
      )}
    />
  );
};

export default DatePicker;
export {Calendar};
