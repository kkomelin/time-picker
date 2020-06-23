import React from 'react';
import TimePicker from '..';
import '../assets/index.less';

const App = () => (
  <>
    <TimePicker defaultValue={new Date()} showHour={false} />
    <TimePicker defaultValue={new Date()} showMinute={false} />
    <TimePicker defaultValue={new Date()} showSecond={false} />

    <TimePicker defaultValue={new Date()} showMinute={false} showSecond={false} />
    <TimePicker defaultValue={new Date()} showHour={false} showSecond={false} />
    <TimePicker defaultValue={new Date()} showHour={false} showMinute={false} />
  </>
);

export default App;
