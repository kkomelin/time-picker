import classNames from 'classnames';
import parse from 'date-fns/parse';
import React, { Component } from 'react';
import Combobox from './Combobox';
import Header from './Header';

function noop() {}

function generateOptions(length, disabledOptions, hideDisabledOptions, step = 1) {
  const arr = [];
  for (let value = 0; value < length; value += step) {
    if (!disabledOptions || disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
      arr.push(value);
    }
  }
  return arr;
}

function toNearestValidTime(time, hourOptions, minuteOptions, secondOptions) {
  const hour = hourOptions
    .slice()
    .sort((a, b) => Math.abs(time.getHours() - a) - Math.abs(time.getHours() - b))[0];
  const minute = minuteOptions
    .slice()
    .sort((a, b) => Math.abs(time.getMinutes() - a) - Math.abs(time.getMinutes() - b))[0];
  const second = secondOptions
    .slice()
    .sort((a, b) => Math.abs(time.getSeconds() - a) - Math.abs(time.getSeconds() - b))[0];
  return parse(`${hour}:${minute}:${second}`, 'HH:mm:ss', new Date());
}

class Panel extends Component {
  static defaultProps = {
    prefixCls: 'rc-time-picker-panel',
    onChange: noop,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    defaultOpenValue: new Date(),
    use12Hours: false,
    addon: noop,
    onKeyDown: noop,
    onAmPmChange: noop,
    inputReadOnly: false,
  };

  state = {};

  static getDerivedStateFromProps(props, state) {
    if ('value' in props) {
      return {
        ...state,
        value: props.value,
      };
    }
    return null;
  }

  onChange = newValue => {
    const { onChange } = this.props;
    this.setState({ value: newValue });
    onChange(newValue);
  };

  onAmPmChange = ampm => {
    const { onAmPmChange } = this.props;
    onAmPmChange(ampm);
  };

  onCurrentSelectPanelChange = currentSelectPanel => {
    this.setState({ currentSelectPanel });
  };

  disabledHours = () => {
    const { use12Hours, disabledHours } = this.props;
    let disabledOptions = disabledHours();
    if (use12Hours && Array.isArray(disabledOptions)) {
      if (this.isAM()) {
        disabledOptions = disabledOptions.filter(h => h < 12).map(h => (h === 0 ? 12 : h));
      } else {
        disabledOptions = disabledOptions.map(h => (h === 12 ? 12 : h - 12));
      }
    }
    return disabledOptions;
  };

  // https://github.com/ant-design/ant-design/issues/5829
  close() {
    const { onEsc } = this.props;
    onEsc();
  }

  isAM() {
    const { defaultOpenValue } = this.props;
    const { value } = this.state;
    const realValue = value || defaultOpenValue;
    return realValue.getHours() >= 0 && realValue.getHours() < 12;
  }

  render() {
    const {
      prefixCls,
      className,
      placeholder,
      disabledMinutes,
      disabledSeconds,
      hideDisabledOptions,
      showHour,
      showMinute,
      showSecond,
      format,
      defaultOpenValue,
      clearText,
      onEsc,
      addon,
      use12Hours,
      focusOnOpen,
      onKeyDown,
      hourStep,
      minuteStep,
      secondStep,
      inputReadOnly,
      clearIcon,
    } = this.props;
    const { value, currentSelectPanel } = this.state;
    const disabledHourOptions = this.disabledHours();
    const disabledMinuteOptions = disabledMinutes(value ? value.getHours() : null);
    const disabledSecondOptions = disabledSeconds(
      value ? value.getHours() : null,
      value ? value.getMinutes() : null,
    );
    const hourOptions = generateOptions(24, disabledHourOptions, hideDisabledOptions, hourStep);
    const minuteOptions = generateOptions(
      60,
      disabledMinuteOptions,
      hideDisabledOptions,
      minuteStep,
    );
    const secondOptions = generateOptions(
      60,
      disabledSecondOptions,
      hideDisabledOptions,
      secondStep,
    );

    const validDefaultOpenValue = toNearestValidTime(
      defaultOpenValue,
      hourOptions,
      minuteOptions,
      secondOptions,
    );

    return (
      <div className={classNames(className, `${prefixCls}-inner`)}>
        <Header
          clearText={clearText}
          prefixCls={prefixCls}
          defaultOpenValue={validDefaultOpenValue}
          value={value}
          currentSelectPanel={currentSelectPanel}
          onEsc={onEsc}
          format={format}
          placeholder={placeholder}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={this.disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onChange={this.onChange}
          focusOnOpen={focusOnOpen}
          onKeyDown={onKeyDown}
          inputReadOnly={inputReadOnly}
          clearIcon={clearIcon}
        />
        <Combobox
          prefixCls={prefixCls}
          value={value}
          defaultOpenValue={validDefaultOpenValue}
          format={format}
          onChange={this.onChange}
          onAmPmChange={this.onAmPmChange}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={this.disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onCurrentSelectPanelChange={this.onCurrentSelectPanelChange}
          use12Hours={use12Hours}
          onEsc={onEsc}
          isAM={this.isAM()}
        />
        {addon(this)}
      </div>
    );
  }
}

export default Panel;
