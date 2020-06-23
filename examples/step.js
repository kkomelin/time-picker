import React from 'react';
import TimePicker from '..';
import '../assets/index.less';

const App = () => <TimePicker defaultValue={new Date()} showSecond={false} minuteStep={15} />;

export default App;
