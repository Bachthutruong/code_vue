import { i18n } from 'boot/i18n';

export const labelsDefault = [
  '-∞',
  '-7',
  '-6',
  '-5',
  '-4',
  '-3',
  '-2',
  '-1',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '7+',
];
const mapI18n = (path: string, params?: any): string => {
  return i18n.global.t(`workspace.chart.task.${path}`, params).toString();
};

const getValueLabel = (index: number) => {
  return Math.abs(Number(labelsDefault[index]));
};
const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = '#fff';
    tooltipEl.style.borderRadius = '4px';
    tooltipEl.style.color = '#565656;';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.boxShadow =
      '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.padding = '8px';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);
  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }
  let fixLeft = 0;
  let fixTop = 0;
  // Set Text
  if (tooltip.body) {
    const dataIndex = tooltip.dataPoints[0].dataIndex as number;
    const valueColumn = tooltip.dataPoints[0].raw as number;
    // const titleLines = tooltip.title || [];
    // const bodyLines = tooltip.body.map((b: any) => b.lines);
    // const tableHead = document.createElement('thead');

    // titleLines.forEach((title:any) => {
    //   const tr = document.createElement('tr') as any
    //   tr.style.borderWidth = 0;
    //
    //   const th = document.createElement('th')  as any
    //   th.style.borderWidth = 0;
    //   const text = document.createTextNode(title);
    //
    //   th.appendChild(text);
    //   tr.appendChild(th);
    //   tableHead.appendChild(tr);
    // });

    const tableBody = document.createElement('tbody') as any;
    // tableBody.style.background = '#fff'

    // bodyLines.forEach((body:any, i: number) => {
    const colors = tooltip.labelColors[0];
    const span = document.createElement('span');
    span.style.background = colors.backgroundColor;
    span.style.borderColor = colors.borderColor;
    span.style.marginRight = '10px';
    span.style.borderRadius = '50%';
    span.style.height = '4px';
    span.style.width = '4px';
    span.style.display = 'inline-block';

    const tr = document.createElement('tr') as any;
    tr.style.backgroundColor = 'inherit';
    tr.style.borderWidth = 0;

    const td = document.createElement('td') as any;
    td.style.borderWidth = 0;
    td.style.display = 'flex';
    td.style.justifyContent = 'left';
    td.style.alignItems = 'center';
    const textRaw = `${mapI18n('taskDone')} ${valueColumn}`;
    const text = document.createTextNode(textRaw);
    const moreThan = `${mapI18n('moreThan')} 7 ${mapI18n('days', 2)}`;
    let innerTextHTMLTooltip = '';
    fixLeft = 80;
    fixTop = -50;
    if (dataIndex < 8) {
      innerTextHTMLTooltip = `<tr></tr><td>
        ${mapI18n('done')} <span style="color: #FF9800">
        ${
          dataIndex === 0
            ? moreThan
            : `${getValueLabel(dataIndex)} ${mapI18n(
                'days',
                getValueLabel(dataIndex) > 1 ? 2 : 1,
              )}`
        }
        </span>
        ${mapI18n('afterDue')}
        </td></tr>`;
    }
    if (dataIndex === 8) {
      innerTextHTMLTooltip = `<tr></tr><td>
        ${mapI18n('fished')}
        </td></tr>`;
    }
    if (dataIndex > 8) {
      innerTextHTMLTooltip = `<tr></tr><td >
         ${mapI18n('done')} <span style="color: #1C8C44">
         ${
           dataIndex === 16
             ? moreThan
             : `${getValueLabel(dataIndex)} ${mapI18n(
                 'days',
                 getValueLabel(dataIndex) > 1 ? 2 : 1,
               )}`
         } </span>
        ${mapI18n('beforeDue')}
        </td></tr>`;

      if (dataIndex > 10) {
        fixLeft = -80;
        fixTop = -50;
      }
    }
    const tr2 = document.createElement('tr') as any;
    tr2.innerHTML = innerTextHTMLTooltip;

    td.appendChild(span);
    td.appendChild(text);
    tr.appendChild(td);
    tableBody.appendChild(tr);
    tableBody.appendChild(tr2);

    // });

    const tableRoot = tooltipEl.querySelector('table') as any;

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    // tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;

  //  130
  tooltipEl.style.left = positionX + tooltip.caretX + fixLeft + 'px';
  // - 50
  tooltipEl.style.top = positionY + tooltip.caretY + fixTop + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.width = '142px';
  tooltipEl.style.padding =
    tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
