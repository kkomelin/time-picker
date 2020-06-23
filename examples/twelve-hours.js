/* eslint no-console:0 */
import formatFn from 'date-fns/format';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import React from 'react';
import TimePicker from '..';
import '../assets/index.less';

const format = 'h:mm a';

let now = new Date();
now = setHours(now, 0);
now = setMinutes(now, 0);

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
