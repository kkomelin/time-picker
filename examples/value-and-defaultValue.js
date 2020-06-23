/* eslint no-console:0 */
import format from 'date-fns/format';
import React from 'react';
import TimePicker from '..';
import '../assets/index.less';

class App extends React.Component {
  state = {
    value: new Date(),
  };

  handleValueChange = value => {
    console.log(value && format(value, 'HH:mm:ss'));
    this.setState({ value });
  };

  clear = () => {
    this.setState({
      value: undefined,
    });
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <TimePicker defaultValue={value} onChange={this.handleValueChange} />
        <TimePicker value={value} onChange={this.handleValueChange} />
        <button onClick={this.clear} type="button">
          clear
        </button>
      </div>
    );
  }
}

export default App;
