import parse from 'date-fns/parse';
import { mount } from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import TimePicker from '../src/TimePicker';
import { clickInput, clickSelectItem, escapeSelected, matchAll, matchValue } from './util';

describe('Select', () => {
  let container;

  function renderPicker(props) {
    const showSecond = true;
    const format = 'HH:mm:ss';

    return mount(
      <TimePicker
        format={format}
        showSecond={showSecond}
        defaultValue={parse('01:02:04', format, new Date())}
        {...props}
      />,
    );
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  describe('select panel', () => {
    it('select panel reacts to mouseenter and mouseleave correctly', async () => {
      const picker = renderPicker();
      clickInput(picker);

      const re = /(^|\s+)rc-time-picker-panel-select-active(\s+|$)/;

      expect(
        re.test(
          picker
            .find('.rc-time-picker-panel-select')
            .at(0)
            .instance().className,
        ),
      ).toBeFalsy();

      picker
        .find('.rc-time-picker-panel-select')
        .at(0)
        .simulate('mouseEnter');
      expect(
        re.test(
          picker
            .find('.rc-time-picker-panel-select')
            .at(0)
            .instance().className,
        ),
      ).toBeTruthy();

      picker
        .find('.rc-time-picker-panel-select')
        .at(0)
        .simulate('mouseLeave');
      expect(
        re.test(
          picker
            .find('.rc-time-picker-panel-select')
            .at(0)
            .instance().className,
        ),
      ).toBeFalsy();
    });

    it('shows only numbers according to step props', async () => {
      const picker = renderPicker({
        hourStep: 5,
        minuteStep: 15,
        secondStep: 21,
      });
      clickInput(picker);

      const selectors = picker.find('.rc-time-picker-panel-select');

      const hourSelector = selectors.at(0);
      const minuteSelector = selectors.at(1);
      const secondSelector = selectors.at(2);

      const hours = hourSelector.find('li').map(node => node.text());
      expect(hours).toEqual(['00', '05', '10', '15', '20']);

      const minutes = minuteSelector.find('li').map(node => node.text());
      expect(minutes).toEqual(['00', '15', '30', '45']);

      const seconds = secondSelector.find('li').map(node => node.text());
      expect(seconds).toEqual(['00', '21', '42']);
    });
  });

  describe('select number', () => {
    it('select number correctly', async () => {
      const picker = renderPicker();
      expect(picker.state().open).toBeFalsy();

      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      expect(picker.find('.rc-time-picker-panel-select').length).toBe(3);
    });
  });

  describe('select to change value', () => {
    it('hour correctly', async () => {
      const onChange = jest.fn();
      const picker = renderPicker({
        onChange,
      });
      expect(picker.state().open).toBeFalsy();

      clickInput(picker);

      expect(picker.state().open).toBeTruthy();
      matchAll(picker, '01:02:04');

      clickSelectItem(picker, 0, 19);

      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getHours()).toBe(19);
      matchAll(picker, '19:02:04');
      expect(picker.state().open).toBeTruthy();
    });

    it('minute correctly', async () => {
      const onChange = jest.fn();
      const picker = renderPicker({
        onChange,
      });
      expect(picker.state().open).toBeFalsy();

      clickInput(picker);

      expect(picker.state().open).toBeTruthy();
      matchAll(picker, '01:02:04');

      clickSelectItem(picker, 1, 19);

      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getMinutes()).toBe(19);
      matchAll(picker, '01:19:04');
      expect(picker.state().open).toBeTruthy();
    });

    it('second correctly', async () => {
      const onChange = jest.fn();
      const picker = renderPicker({
        onChange,
      });
      expect(picker.state().open).toBeFalsy();

      clickInput(picker);

      expect(picker.state().open).toBeTruthy();
      matchAll(picker, '01:02:04');

      clickSelectItem(picker, 2, 19);

      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getSeconds()).toBe(19);
      matchAll(picker, '01:02:19');
      expect(picker.state().open).toBeTruthy();
    });

    it('ampm correctly', async () => {
      const onAmPmChange = jest.fn();
      const date = new Date();
      date.setHours(0, 0, 0);
      const picker = renderPicker({
        onAmPmChange,
        defaultValue: date,
        format: undefined,
        showSecond: false,
        use12Hours: true,
      });
      expect(picker.state().open).toBeFalsy();
      clickInput(picker);

      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '12:00 AM');
      clickSelectItem(picker, 2, 1);

      expect(onAmPmChange).toBeCalled();
      expect(onAmPmChange.mock.calls[0][0]).toBe('PM');
      matchValue(picker, '12:00 PM');
      expect(picker.state().open).toBeTruthy();
    });

    it('disabled correctly', async () => {
      const onChange = jest.fn();
      const picker = renderPicker({
        onChange,
        disabledMinutes(h) {
          return [h];
        },
        disabledSeconds(h, m) {
          return [h + (m % 60)];
        },
      });
      expect(picker.state().open).toBeFalsy();
      clickInput(picker);

      expect(picker.state().open).toBeTruthy();

      matchAll(picker, '01:02:04');

      clickSelectItem(picker, 1, 1);

      expect(onChange).not.toBeCalled();
      matchAll(picker, '01:02:04');
      expect(picker.state().open).toBeTruthy();

      clickSelectItem(picker, 2, 3);

      expect(onChange).not.toBeCalled();
      matchAll(picker, '01:02:04');
      expect(picker.state().open).toBeTruthy();

      clickSelectItem(picker, 1, 7);

      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getMinutes()).toBe(7);
      matchAll(picker, '01:07:04');
      expect(picker.state().open).toBeTruthy();
    });

    it('hidden correctly', async () => {
      const onChange = jest.fn();
      const picker = renderPicker({
        onChange,
        disabledHours() {
          return [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
        },
        hideDisabledOptions: true,
      });
      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchAll(picker, '01:02:04');

      clickSelectItem(picker, 0, 3);

      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getHours()).toBe(6);
      matchAll(picker, '06:02:04');
      expect(picker.state().open).toBeTruthy();
      onChange.mockReset();

      clickSelectItem(picker, 0, 4);

      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getHours()).toBe(8);
      matchAll(picker, '08:02:04');
      expect(picker.state().open).toBeTruthy();
    });
  });

  describe('select in 12 hours mode', () => {
    it('renders correctly', async () => {
      const date = new Date();
      date.setHours(14, 0, 0);
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: date,
        showSecond: false,
        format: undefined,
      });

      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '2:00 PM');

      expect(picker.find('.rc-time-picker-panel-select').length).toBe(3);
    });

    it('renders 12am correctly', async () => {
      const date = new Date();
      date.setHours(0, 0, 0);
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: date,
        showSecond: false,
        format: undefined,
      });
      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      expect(picker.find('.rc-time-picker-panel-select').length).toBe(3);
    });

    it('renders 5am correctly', async () => {
      const date = new Date();
      date.setHours(0, 0, 0);
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: date,
        showSecond: false,
        format: undefined,
      });
      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '12:00 AM');
      clickSelectItem(picker, 0, 3);

      matchValue(picker, '3:00 AM');
    });

    it('renders 12am/pm correctly', async () => {
      const date = new Date();
      date.setHours(0, 0, 0);

      const picker = renderPicker({
        use12Hours: true,
        defaultValue: date,
        showSecond: false,
        format: undefined,
      });

      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '12:00 AM');

      clickSelectItem(picker, 2, 1);
      matchValue(picker, '12:00 PM');

      clickSelectItem(picker, 2, 0);
      matchValue(picker, '12:00 AM');
    });

    it('renders uppercase AM correctly', async () => {
      const date = new Date();
      date.setHours(0, 0, 0);
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: date,
        showSecond: false,
        format: 'h:mm a',
      });

      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '12:00 AM');

      clickSelectItem(picker, 2, 1);
      matchValue(picker, '12:00 PM');

      clickSelectItem(picker, 2, 0);
      matchValue(picker, '12:00 AM');
    });

    it('disabled correctly', async () => {
      const onChange = jest.fn();
      const date = new Date();
      date.setHours(0, 0, 0);
      const picker = renderPicker({
        use12Hours: true,
        format: undefined,
        onChange,
        disabledHours() {
          return [0, 2, 6, 18, 12];
        },
        defaultValue: date,
        showSecond: false,
      });

      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchAll(picker, '12:00 AM');

      clickSelectItem(picker, 0, 2);
      expect(onChange).not.toBeCalled();
      matchAll(picker, '12:00 AM');
      expect(picker.state().open).toBeTruthy();

      clickSelectItem(picker, 0, 5);
      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getHours()).toBe(5);
      matchAll(picker, '5:00 AM');
      expect(picker.state().open).toBeTruthy();
      onChange.mockReset();

      clickSelectItem(picker, 2, 1);
      expect(onChange).toBeCalled();
      matchAll(picker, '5:00 PM');
      expect(picker.state().open).toBeTruthy();
      onChange.mockReset();

      clickSelectItem(picker, 0, 0);
      expect(onChange).not.toBeCalled();
      matchAll(picker, '5:00 PM');
      expect(picker.state().open).toBeTruthy();
      onChange.mockReset();

      clickSelectItem(picker, 0, 5);
      expect(onChange).toBeCalled();
      expect(onChange.mock.calls[0][0].getHours()).toBe(17);
      matchAll(picker, '5:00 PM');
      expect(picker.state().open).toBeTruthy();
    });
  });

  describe('other operations', () => {
    function testClearIcon(name, clearIcon, findClearFunc) {
      it(name, async () => {
        const onChange = jest.fn();
        const picker = renderPicker({
          clearIcon,
          onChange,
        });

        const clearButton = findClearFunc(picker);
        matchValue(picker, '01:02:04');

        clearButton.simulate('click');
        expect(picker.state().open).toBeFalsy();
        expect(onChange.mock.calls[0][0]).toBe(null);

        clickInput(picker);
        matchValue(picker, '');
      });
    }

    testClearIcon('clear correctly', 'test-clear', picker => {
      const clearButton = picker.find('.rc-time-picker-clear');
      expect(clearButton.text()).toBe('test-clear');
      return clearButton;
    });
    testClearIcon(
      'customize element clear icon correctly',
      <span className="test-clear-element">Clear Me</span>,
      picker => picker.find('.test-clear-element'),
    );
  });

  it('escape closes popup', async () => {
    const picker = renderPicker();

    expect(picker.state().open).toBeFalsy();
    clickInput(picker);
    expect(picker.state().open).toBeTruthy();

    clickSelectItem(picker, 1, 1);
    escapeSelected(picker);

    expect(picker.state().open).toBeFalsy();
  });
});
