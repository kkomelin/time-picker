/* eslint no-console:0 */
import format from 'date-fns/format';
import React from 'react';
import TimePicker from '..';
import '../assets/index.less';

const showSecond = true;
const str = showSecond ? 'HH:mm:ss' : 'HH:mm';

function onChange(value) {
  console.log(value && format(value, str));
}

const App = () => (
  <TimePicker
    style={{ width: 100 }}
    showSecond={showSecond}
    defaultValue={new Date()}
    className="xxx"
    onChange={onChange}
  />
);

export default App;
