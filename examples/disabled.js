/* eslint no-console:0 */

import format from 'date-fns/format';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import React from 'react';
import TimePicker from '..';
import '../assets/index.less';

const showSecond = true;
const str = showSecond ? 'HH:mm:ss' : 'HH:mm';

let now = new Date();
now = setHours(now, 14);
now = setMinutes(now, 30);

function generateOptions(length, excludedOptions) {
  const arr = [];
  for (let value = 0; value < length; value += 1) {
    if (excludedOptions.indexOf(value) < 0) {
      arr.push(value);
    }
  }
  return arr;
}

function onChange(value) {
  console.log(value && format(value, str));
}

function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
}

function disabledMinutes(h) {
  switch (h) {
    case 9:
      return generateOptions(60, [30]);
    case 21:
      return generateOptions(60, [0]);
    default:
      return generateOptions(60, [0, 30]);
  }
}

function disabledSeconds(h, m) {
  return [h + (m % 60)];
}

const App = () => (
  <>
    <h3>Disabled picker</h3>
    <TimePicker defaultValue={now} disabled onChange={onChange} />
    <h3>Disabled options</h3>
    <TimePicker
      showSecond={showSecond}
      defaultValue={now}
      className="xxx"
      onChange={onChange}
      disabledHours={disabledHours}
      disabledMinutes={disabledMinutes}
      disabledSeconds={disabledSeconds}
    />
  </>
);

export default App;
