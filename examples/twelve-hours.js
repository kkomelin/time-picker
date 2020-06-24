/* eslint no-console:0 */
import formatFn from 'date-fns/format';
import React from 'react';
import TimePicker from '..';
import '../assets/index.less';

const format = 'h:mm a';

const now = new Date();
now.setHours(0, 0);

function onChange(value) {
  console.log(value && formatFn(value, format));
}

const App = () => (
  <TimePicker
    showSecond={false}
    defaultValue={now}
    className="xxx"
    onChange={onChange}
    format={format}
    use12Hours
    inputReadOnly
  />
);

export default App;
