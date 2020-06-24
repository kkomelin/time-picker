import classNames from 'classnames';
import formatFn from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import React, { Component } from 'react';

class Header extends Component {
  static defaultProps = {
    inputReadOnly: false,
  };

  constructor(props) {
    super(props);
    const { value, format } = props;
    this.state = {
      str: (value && formatFn(value, format)) || '',
      invalid: false,
    };
  }

  componentDidMount() {
    const { focusOnOpen } = this.props;
    if (focusOnOpen) {
      // requestAnimationFrame will cause jump on rc-trigger 3.x
      // https://github.com/ant-design/ant-design/pull/19698#issuecomment-552889571
      // use setTimeout can resolve it
      // 60ms is a magic timeout to avoid focusing before dropdown reposition correctly
      this.timeout = setTimeout(() => {
        this.refInput.focus();
        this.refInput.select();
      }, 60);
    }
  }

  componentDidUpdate(prevProps) {
    const { value, format } = this.props;
    if (value !== prevProps.value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        str: (value && formatFn(value, format)) || '',
        invalid: false,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onInputChange = event => {
    const str = event.target.value;
    this.setState({
      str,
    });
    const {
      format,
      hourOptions,
      minuteOptions,
      secondOptions,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      onChange,
    } = this.props;

    if (str) {
      const { value: originalValue } = this.props;
      const value = new Date(this.getProtoValue().getTime());
      const parsed = parse(str, format, new Date());
      if (!isValid(parsed)) {
        this.setState({
          invalid: true,
        });
        return;
      }
      value.setHours(parsed.getHours(), parsed.getMinutes(), parsed.getSeconds());

      // if time value not allowed, response warning.
      if (
        hourOptions.indexOf(value.getHours()) < 0 ||
        minuteOptions.indexOf(value.getMinutes()) < 0 ||
        secondOptions.indexOf(value.getSeconds()) < 0
      ) {
        this.setState({
          invalid: true,
        });
        return;
      }

      // if time value is disabled, response warning.
      const disabledHourOptions = disabledHours();
      const disabledMinuteOptions = disabledMinutes(value.getHours());
      const disabledSecondOptions = disabledSeconds(value.getHours(), value.getMinutes());
      if (
        (disabledHourOptions && disabledHourOptions.indexOf(value.getHours()) >= 0) ||
        (disabledMinuteOptions && disabledMinuteOptions.indexOf(value.getMinutes()) >= 0) ||
        (disabledSecondOptions && disabledSecondOptions.indexOf(value.getSeconds()) >= 0)
      ) {
        this.setState({
          invalid: true,
        });
        return;
      }

      if (originalValue) {
        if (
          originalValue.getHours() !== value.getHours() ||
          originalValue.getMinutes() !== value.getMinutes() ||
          originalValue.getSeconds() !== value.getSeconds()
        ) {
          // keep other fields for rc-calendar
          const changedValue = new Date(originalValue.getTime());
          changedValue.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
          onChange(changedValue);
        }
      } else if (originalValue !== value) {
        onChange(value);
      }
    } else {
      onChange(null);
    }

    this.setState({
      invalid: false,
    });
  };

  onKeyDown = e => {
    const { onEsc, onKeyDown } = this.props;
    if (e.keyCode === 27) {
      onEsc();
    }

    onKeyDown(e);
  };

  getProtoValue() {
    const { value, defaultOpenValue } = this.props;
    return value || defaultOpenValue;
  }

  getInput() {
    const { prefixCls, placeholder, inputReadOnly } = this.props;
    const { invalid, str } = this.state;
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <input
        className={classNames(`${prefixCls}-input`, invalidClass)}
        ref={ref => {
          this.refInput = ref;
        }}
        onKeyDown={this.onKeyDown}
        value={str}
        placeholder={placeholder}
        onChange={this.onInputChange}
        readOnly={!!inputReadOnly}
      />
    );
  }

  render() {
    const { prefixCls } = this.props;
    return <div className={`${prefixCls}-input-wrap`}>{this.getInput()}</div>;
  }
}

export default Header;
